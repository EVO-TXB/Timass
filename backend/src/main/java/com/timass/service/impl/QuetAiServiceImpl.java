package com.timass.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.timass.dto.MonHocTkbDTO;
import com.timass.service.QuetAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class QuetAiServiceImpl implements QuetAiService {

    private static final Logger log = LoggerFactory.getLogger(QuetAiServiceImpl.class);

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
    );

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public QuetAiServiceImpl(ObjectMapper objectMapper) {
        this.restClient = RestClient.builder().build();
        this.objectMapper = objectMapper;
    }

    // Constructor phục vụ Dependency Injection / Test Mocking
    public QuetAiServiceImpl(RestClient restClient, ObjectMapper objectMapper, String apiKey, String model, String baseUrl) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
    }

    @Override
    public List<MonHocTkbDTO> trichXuatTkbTuAnh(MultipartFile tepAnh) {
        return trichXuatTkbTuAnh(tepAnh, null);
    }

    @Override
    public List<MonHocTkbDTO> trichXuatTkbTuAnh(MultipartFile tepAnh, String customApiKey) {
        // 1. Kiểm tra tính hợp lệ của tệp ảnh
        validateImageFile(tepAnh);

        String effectiveApiKey = (customApiKey != null && !customApiKey.trim().isEmpty()) 
                ? customApiKey.trim() 
                : this.apiKey;

        if (effectiveApiKey == null || effectiveApiKey.trim().isEmpty()) {
            log.error("❌ [AI-SCAN] Chưa cấu hình gemini.api-key trong hệ thống");
            throw new IllegalArgumentException("Chưa cấu hình Google Gemini API Key. Vui lòng nhập API Key trên giao diện hoặc thiết lập biến môi trường GEMINI_API_KEY.");
        }

        try {
            // 2. Chuyển đổi tệp ảnh sang Base64
            String mimeType = tepAnh.getContentType();
            String base64Data = Base64.getEncoder().encodeToString(tepAnh.getBytes());

            // 3. Chuẩn bị System Prompt ép kiểu dữ liệu trả về thuần JSON
            String promptText = """
                    Bạn là chuyên gia AI Vision chuyên bóc tách thời khóa biểu, lịch học từ hình ảnh chụp hoặc ảnh scan.
                    Hãy đọc kỹ ảnh và trích xuất toàn bộ các môn học / tiết học thành một JSON Array duy nhất.
                    Mỗi phần tử đại diện cho một môn học với các trường:
                    - "tenMonHoc": Tên môn học hoặc sự kiện (String, ví dụ: "Toán rời rạc", "Lập trình Web")
                    - "thuTrongTuan": Thứ diễn ra môn học (String, giá trị chuẩn hóa: "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật")
                    - "gioBatDau": Giờ bắt đầu học (String, định dạng "HH:mm", ví dụ: "07:00", "13:30")
                    - "gioKetThuc": Giờ kết thúc học (String, định dạng "HH:mm", ví dụ: "09:30", "15:00")
                    - "phongHoc": Tên phòng học, giảng đường (String, ví dụ: "P.302", "Lab 2", nếu không có để rỗng "")

                    Quy tắc nghiêm ngặt:
                    - Chỉ trả về DUY NHẤT một chuỗi JSON Array thuần, bắt đầu bằng [ và kết thúc bằng ].
                    - Tuyệt đối không thêm bất kỳ văn bản giải thích nào, không dùng markdown ticks (```json hoặc ```).
                    - Nếu ảnh quá mờ, không phải thời khóa biểu hoặc không tìm thấy môn học, trả về: []
                    """;

            // 4. Cấu hình Payload gửi lên Google Gemini 1.5 Flash Vision API
            Map<String, Object> textPart = Map.of("text", promptText);
            Map<String, Object> inlineData = Map.of(
                    "mime_type", mimeType,
                    "data", base64Data
            );
            Map<String, Object> imagePart = Map.of("inline_data", inlineData);

            Map<String, Object> contentObj = Map.of("parts", List.of(textPart, imagePart));
            Map<String, Object> generationConfig = Map.of(
                    "response_mime_type", "application/json",
                    "temperature", 0.1
            );

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(contentObj),
                    "generationConfig", generationConfig
            );

            String url = String.format("%s/%s:generateContent?key=%s", baseUrl, model, effectiveApiKey);

            log.info("🤖 [AI-SCAN] Đang gửi ảnh ({} bytes, MIME: {}) tới Google Gemini Model '{}'...", 
                    tepAnh.getSize(), mimeType, model);

            // 5. Gọi API Gemini
            String responseJson = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            // 6. Xử lý và trích xuất chuỗi JSON từ phản hồi của Gemini
            return parseGeminiResponse(responseJson);

        } catch (IOException e) {
            log.error("❌ [AI-SCAN] Lỗi đọc tệp ảnh: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Không thể đọc tệp ảnh tải lên: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("❌ [AI-SCAN] Lỗi khi gọi Gemini Vision API: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Lỗi kết nối tới dịch vụ AI Vision: " + e.getMessage());
        }
    }

    /**
     * Parse chuỗi JSON trả về từ Gemini và chuyển thành danh sách MonHocTkbDTO
     */
    public List<MonHocTkbDTO> parseGeminiResponse(String responseJson) {
        if (responseJson == null || responseJson.isBlank()) {
            throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
        }

        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
            }

            JsonNode content = candidates.get(0).path("content");
            JsonNode parts = content.path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
            }

            String rawText = parts.get(0).path("text").asText();
            if (rawText == null || rawText.isBlank()) {
                throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
            }

            // Loại bỏ markdown code blocks nếu model vô tình sinh ra
            String cleanedJson = rawText.trim();
            if (cleanedJson.startsWith("```json")) {
                cleanedJson = cleanedJson.substring(7);
            } else if (cleanedJson.startsWith("```")) {
                cleanedJson = cleanedJson.substring(3);
            }
            if (cleanedJson.endsWith("```")) {
                cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
            }
            cleanedJson = cleanedJson.trim();

            if (cleanedJson.isEmpty() || cleanedJson.equals("[]")) {
                throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
            }

            List<MonHocTkbDTO> danhSachMonHoc = objectMapper.readValue(cleanedJson, new TypeReference<List<MonHocTkbDTO>>() {});

            if (danhSachMonHoc == null || danhSachMonHoc.isEmpty()) {
                throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại");
            }

            log.info("🎉 [AI-SCAN] Bóc tách thành công {} môn học từ thời khóa biểu", danhSachMonHoc.size());
            return danhSachMonHoc;

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("❌ [AI-SCAN] Lỗi phân tích cú pháp JSON trả về từ AI: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, cấu trúc dữ liệu không hợp lệ");
        }
    }

    /**
     * Kiểm tra tính hợp lệ của tệp ảnh: không rỗng, dung lượng <= 5MB, đúng định dạng MIME
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Vui lòng tải lên tệp ảnh thời khóa biểu");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Dung lượng ảnh (" + (file.getSize() / 1024 / 1024) + 
                    "MB) vượt quá giới hạn tối đa cho phép là 5MB");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new IllegalArgumentException("Định dạng tệp (" + mimeType + 
                    ") không hợp lệ. Hệ thống chỉ hỗ trợ các định dạng ảnh: JPG, PNG, WebP");
        }
    }
}

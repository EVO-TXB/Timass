package com.timass.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.timass.dto.MonHocTkbDTO;
import com.timass.service.impl.QuetAiServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class QuetAiServiceTest {

    private QuetAiServiceImpl quetAiService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        quetAiService = new QuetAiServiceImpl(null, objectMapper, "test-api-key", "gemini-1.5-flash", "https://mock");
    }

    @Test
    @DisplayName("Báo lỗi khi tệp tải lên rỗng")
    void testValidateImage_Rong() {
        MockMultipartFile emptyFile = new MockMultipartFile("tepAnh", "empty.png", "image/png", new byte[0]);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                quetAiService.trichXuatTkbTuAnh(emptyFile)
        );
        assertTrue(ex.getMessage().contains("Vui lòng tải lên tệp ảnh"));
    }

    @Test
    @DisplayName("Báo lỗi khi dung lượng ảnh vượt quá 5MB")
    void testValidateImage_QuaDungLuong() {
        byte[] oversizedBytes = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeFile = new MockMultipartFile("tepAnh", "large.jpg", "image/jpeg", oversizedBytes);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                quetAiService.trichXuatTkbTuAnh(largeFile)
        );
        assertTrue(ex.getMessage().contains("vượt quá giới hạn tối đa"));
    }

    @Test
    @DisplayName("Báo lỗi khi tệp không đúng định dạng ảnh cho phép (ví dụ: PDF)")
    void testValidateImage_SaiDinhDang() {
        MockMultipartFile pdfFile = new MockMultipartFile("tepAnh", "doc.pdf", "application/pdf", new byte[]{1, 2, 3});

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                quetAiService.trichXuatTkbTuAnh(pdfFile)
        );
        assertTrue(ex.getMessage().contains("không hợp lệ"));
    }

    @Test
    @DisplayName("Bóc tách thành công chuỗi JSON thuần trả về từ Gemini")
    void testParseGeminiResponse_ThanhCong() {
        String mockGeminiJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "[{\\"tenMonHoc\\": \\"Kỹ thuật lập trình\\", \\"thuTrongTuan\\": \\"Thứ 2\\", \\"gioBatDau\\": \\"07:00\\", \\"gioKetThuc\\": \\"09:30\\", \\"phongHoc\\": \\"P.204\\"}, {\\"tenMonHoc\\": \\"Cấu trúc dữ liệu\\", \\"thuTrongTuan\\": \\"Thứ 4\\", \\"gioBatDau\\": \\"13:00\\", \\"gioKetThuc\\": \\"15:30\\", \\"phongHoc\\": \\"Lab 1\\"}]"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        List<MonHocTkbDTO> result = quetAiService.parseGeminiResponse(mockGeminiJson);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Kỹ thuật lập trình", result.get(0).getTenMonHoc());
        assertEquals("Thứ 2", result.get(0).getThuTrongTuan());
        assertEquals("07:00", result.get(0).getGioBatDau());
        assertEquals("09:30", result.get(0).getGioKetThuc());
        assertEquals("P.204", result.get(0).getPhongHoc());

        assertEquals("Cấu trúc dữ liệu", result.get(1).getTenMonHoc());
    }

    @Test
    @DisplayName("Tự động loại bỏ markdown backticks (```json ... ```) nếu Gemini trả về")
    void testParseGeminiResponse_CoMarkdownBackticks() {
        String mockGeminiJsonWithMarkdown = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "```json\\n[{\\"tenMonHoc\\": \\"Hệ điều hành\\", \\"thuTrongTuan\\": \\"Thứ 6\\", \\"gioBatDau\\": \\"09:45\\", \\"gioKetThuc\\": \\"11:45\\", \\"phongHoc\\": \\"A1-501\\"}]\\n```"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        List<MonHocTkbDTO> result = quetAiService.parseGeminiResponse(mockGeminiJsonWithMarkdown);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Hệ điều hành", result.get(0).getTenMonHoc());
    }

    @Test
    @DisplayName("Ném ngoại lệ thân thiện khi ảnh quá mờ / AI trả về mảng rỗng []")
    void testParseGeminiResponse_AnhMoHoacKhongTimThay() {
        String mockEmptyResponse = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "[]"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                quetAiService.parseGeminiResponse(mockEmptyResponse)
        );
        assertTrue(ex.getMessage().contains("Không nhận diện được thời khóa biểu trong ảnh"));
    }
}

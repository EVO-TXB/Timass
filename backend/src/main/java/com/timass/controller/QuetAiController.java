package com.timass.controller;

import com.timass.dto.ApiResponse;
import com.timass.dto.MonHocTkbDTO;
import com.timass.service.QuetAiService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class QuetAiController {

    private final QuetAiService quetAiService;

    public QuetAiController(QuetAiService quetAiService) {
        this.quetAiService = quetAiService;
    }

    /**
     * Endpoint quét và nhận diện thời khóa biểu từ hình ảnh qua Gemini Vision AI
     * POST /api/v1/ai/quet-tkb
     *
     * @param tepAnh File ảnh thời khóa biểu (JPG, PNG, WebP <= 5MB)
     * @return Danh sách các môn học trích xuất được để hiển thị lên Preview Modal
     */
    @PostMapping(value = "/quet-tkb", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<MonHocTkbDTO>>> quetAnhTkb(
            @RequestParam("tepAnh") MultipartFile tepAnh,
            @RequestHeader(value = "X-Gemini-Api-Key", required = false) String customApiKey) {

        List<MonHocTkbDTO> danhSachMonHoc = quetAiService.trichXuatTkbTuAnh(tepAnh, customApiKey);
        return ResponseEntity.ok(ApiResponse.ok("Trích xuất thời khóa biểu thành công (" + 
                danhSachMonHoc.size() + " môn học)", danhSachMonHoc));
    }
}

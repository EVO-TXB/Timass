package com.timass.service;

import com.timass.dto.MonHocTkbDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface QuetAiService {

    /**
     * Phân tích và trích xuất danh sách môn học từ ảnh chụp thời khóa biểu qua Google Gemini AI.
     *
     * @param tepAnh File ảnh thời khóa biểu tải lên (JPG, PNG, WebP; tối đa 5MB)
     * @return Danh sách các môn học trích xuất được
     */
    List<MonHocTkbDTO> trichXuatTkbTuAnh(MultipartFile tepAnh);

    /**
     * Phân tích và trích xuất danh sách môn học từ ảnh chụp thời khóa biểu qua Google Gemini AI (cho phép truyền custom API Key).
     *
     * @param tepAnh File ảnh thời khóa biểu tải lên (JPG, PNG, WebP; tối đa 5MB)
     * @param customApiKey Gemini API Key người dùng cung cấp nếu server chưa có biến môi trường
     * @return Danh sách các môn học trích xuất được
     */
    List<MonHocTkbDTO> trichXuatTkbTuAnh(MultipartFile tepAnh, String customApiKey);
}

package com.timass.controller;

import com.timass.dto.MonHocTkbDTO;
import com.timass.exception.GlobalExceptionHandler;
import com.timass.service.QuetAiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class QuetAiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private QuetAiService quetAiService;

    @InjectMocks
    private QuetAiController quetAiController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(quetAiController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("API POST /api/v1/ai/quet-tkb quét ảnh thành công (200 OK)")
    void testQuetAnhTkb_ThanhCong() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "tepAnh",
                "tkb.png",
                "image/png",
                new byte[]{1, 2, 3, 4}
        );

        MonHocTkbDTO monHoc = new MonHocTkbDTO("Mạng máy tính", "Thứ 3", "07:00", "09:30", "B301");
        List<MonHocTkbDTO> resultList = Collections.singletonList(monHoc);

        when(quetAiService.trichXuatTkbTuAnh(any(), any())).thenReturn(resultList);

        mockMvc.perform(multipart("/api/v1/ai/quet-tkb").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data[0].tenMonHoc", is("Mạng máy tính")))
                .andExpect(jsonPath("$.data[0].thuTrongTuan", is("Thứ 3")))
                .andExpect(jsonPath("$.data[0].phongHoc", is("B301")));
    }

    @Test
    @DisplayName("API POST /api/v1/ai/quet-tkb trả về lỗi 400 khi ảnh không đọc được / mờ")
    void testQuetAnhTkb_LoiAnhMo() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "tepAnh",
                "mo.png",
                "image/png",
                new byte[]{1, 2, 3}
        );

        when(quetAiService.trichXuatTkbTuAnh(any(), any()))
                .thenThrow(new IllegalArgumentException("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại"));

        mockMvc.perform(multipart("/api/v1/ai/quet-tkb").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại")));
    }
}

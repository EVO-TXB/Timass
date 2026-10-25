package com.timass.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.timass.dto.CapNhatTrangThaiDTO;
import com.timass.dto.CongViecResponseDTO;
import com.timass.dto.TaoCongViecDonLeDTO;
import com.timass.dto.YeuCauCongViecLapLaiDTO;
import com.timass.exception.GlobalExceptionHandler;
import com.timass.model.LoaiCongViec;
import com.timass.model.TrangThaiCongViec;
import com.timass.service.CongViecService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CongViecControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private CongViecService congViecService;

    @InjectMocks
    private CongViecController congViecController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(congViecController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("API POST /api/v1/cong-viec/don-le tạo công việc đơn lẻ thành công (201 Created)")
    void testApiTaoCongViecDonLe() throws Exception {
        TaoCongViecDonLeDTO request = new TaoCongViecDonLeDTO(
                "Ôn thi giải thuật",
                LocalDate.of(2026, 10, 21),
                LocalTime.of(8, 0),
                LocalTime.of(11, 0),
                LoaiCongViec.CHU_DONG,
                "Thư viện"
        );

        CongViecResponseDTO responseDto = new CongViecResponseDTO();
        responseDto.setMaCongViec(1L);
        responseDto.setTieuDe("Ôn thi giải thuật");
        responseDto.setTrangThai(TrangThaiCongViec.DANG_CHO);

        when(congViecService.taoCongViecDonLe(any(), any(TaoCongViecDonLeDTO.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/v1/cong-viec/don-le")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.maCongViec", is(1)))
                .andExpect(jsonPath("$.data.tieuDe", is("Ôn thi giải thuật")));
    }

    @Test
    @DisplayName("API POST /api/v1/cong-viec/lap-lai tạo chuỗi công việc lặp lại (201 Created)")
    void testApiTaoCongViecLapLai() throws Exception {
        YeuCauCongViecLapLaiDTO request = new YeuCauCongViecLapLaiDTO(
                "Thể dục sáng",
                LocalTime.of(6, 0),
                LocalTime.of(7, 0),
                Arrays.asList(2, 4, 6),
                LocalDate.of(2026, 10, 19),
                LocalDate.of(2026, 10, 25),
                LoaiCongViec.THIET_YEU_BI_DONG,
                "Công viên"
        );

        CongViecResponseDTO resItem = new CongViecResponseDTO();
        resItem.setMaCongViec(10L);
        resItem.setTieuDe("Thể dục sáng");
        resItem.setCoLapLai(true);

        when(congViecService.taoCongViecLapLai(any(), any(YeuCauCongViecLapLaiDTO.class)))
                .thenReturn(Collections.singletonList(resItem));

        mockMvc.perform(post("/api/v1/cong-viec/lap-lai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data[0].maCongViec", is(10)));
    }

    @Test
    @DisplayName("API PATCH /api/v1/cong-viec/{id}/trang-thai cập nhật trạng thái (200 OK)")
    void testApiCapNhatTrangThai() throws Exception {
        CapNhatTrangThaiDTO request = new CapNhatTrangThaiDTO(TrangThaiCongViec.HOAN_THANH);

        CongViecResponseDTO responseDto = new CongViecResponseDTO();
        responseDto.setMaCongViec(5L);
        responseDto.setTrangThai(TrangThaiCongViec.HOAN_THANH);

        when(congViecService.capNhatTrangThai(eq(5L), any(CapNhatTrangThaiDTO.class))).thenReturn(responseDto);

        mockMvc.perform(patch("/api/v1/cong-viec/5/trang-thai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.trangThai", is("HOAN_THANH")));
    }

    @Test
    @DisplayName("API Validation bắt lỗi khi thiếu tiêu đề (400 Bad Request)")
    void testApiValidation_ThieuTieuDe() throws Exception {
        TaoCongViecDonLeDTO invalidReq = new TaoCongViecDonLeDTO(
                "", // Blank title -> Invalid!
                LocalDate.of(2026, 10, 21),
                LocalTime.of(8, 0),
                LocalTime.of(10, 0),
                LoaiCongViec.CHU_DONG,
                null
        );

        mockMvc.perform(post("/api/v1/cong-viec/don-le")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.data.tieuDe").exists());
    }

    @Test
    @DisplayName("API POST /api/v1/cong-viec/luu-hang-loat lưu TKB hàng loạt (201 Created)")
    void testApiLuuTkbHangLoat() throws Exception {
        com.timass.dto.MonHocTkbDTO monHoc = new com.timass.dto.MonHocTkbDTO(
                "Lập trình Java", "Thứ 2", "07:00", "09:30", "P101"
        );
        com.timass.dto.YeuCauLuuTkbHangLoatDTO request = new com.timass.dto.YeuCauLuuTkbHangLoatDTO(
                LocalDate.of(2026, 10, 19),
                LocalDate.of(2026, 10, 25),
                Collections.singletonList(monHoc)
        );

        CongViecResponseDTO res = new CongViecResponseDTO();
        res.setMaCongViec(200L);
        res.setTieuDe("Lập trình Java");

        when(congViecService.luuTkbHangLoat(any(), any(com.timass.dto.YeuCauLuuTkbHangLoatDTO.class)))
                .thenReturn(Collections.singletonList(res));

        mockMvc.perform(post("/api/v1/cong-viec/luu-hang-loat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data[0].maCongViec", is(200)));
    }
}

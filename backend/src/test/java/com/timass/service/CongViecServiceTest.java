package com.timass.service;

import com.timass.dto.CapNhatTrangThaiDTO;
import com.timass.dto.CongViecResponseDTO;
import com.timass.dto.TaoCongViecDonLeDTO;
import com.timass.dto.YeuCauCongViecLapLaiDTO;
import com.timass.model.*;
import com.timass.repository.CongViecRepository;
import com.timass.repository.NguoiDungRepository;
import com.timass.service.impl.CongViecServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CongViecServiceTest {

    @Mock
    private CongViecRepository congViecRepository;

    @Mock
    private NguoiDungRepository nguoiDungRepository;

    @InjectMocks
    private CongViecServiceImpl congViecService;

    private NguoiDung mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new NguoiDung(1L, "0912345678", "encodedPass", "Nguyen Van A");
    }

    @Test
    @DisplayName("Tạo công việc đơn lẻ thành công khi giờ hợp lệ")
    void testTaoCongViecDonLe_ThanhCong() {
        when(nguoiDungRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        TaoCongViecDonLeDTO req = new TaoCongViecDonLeDTO(
                "Làm bài tập lớn",
                LocalDate.of(2026, 10, 21),
                LocalTime.of(8, 0),
                LocalTime.of(10, 0),
                LoaiCongViec.CHU_DONG,
                "Phòng 302");

        when(congViecRepository.save(any(CongViec.class))).thenAnswer(invocation -> {
            CongViec cv = invocation.getArgument(0);
            cv.setMaCongViec(99L);
            return cv;
        });

        CongViecResponseDTO result = congViecService.taoCongViecDonLe(1L, req);

        assertNotNull(result);
        assertEquals(99L, result.getMaCongViec());
        assertEquals("Làm bài tập lớn", result.getTieuDe());
        assertEquals(TrangThaiCongViec.DANG_CHO, result.getTrangThai());
        assertFalse(result.getCoLapLai());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi giờ kết thúc trước hoặc bằng giờ bắt đầu")
    void testValidation_GioKetThucTruocGioBatDau() {
        TaoCongViecDonLeDTO req = new TaoCongViecDonLeDTO(
                "Lỗi giờ",
                LocalDate.of(2026, 10, 21),
                LocalTime.of(10, 0),
                LocalTime.of(8, 0), // Lỗi: kết thúc trước bắt đầu
                LoaiCongViec.CHU_DONG,
                null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> congViecService.taoCongViecDonLe(1L, req));
        assertTrue(ex.getMessage().contains("Giờ kết thúc"));
    }

    @Test
    @DisplayName("Tạo công việc lặp lại hàng loạt: tự động sinh UUID maNhomLapLai và gọi saveAll()")
    void testTaoCongViecLapLai_ThanhCong() {
        when(nguoiDungRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // Khoảng từ Thứ 2 ngày 2026-10-19 đến CN ngày 2026-10-25
        // Chọn Thứ 2, Thứ 4, Thứ 6 (VN: 2, 4, 6)
        YeuCauCongViecLapLaiDTO req = new YeuCauCongViecLapLaiDTO(
                "Học Lập trình Java",
                LocalTime.of(7, 0),
                LocalTime.of(9, 30),
                Arrays.asList(2, 4, 6),
                LocalDate.of(2026, 10, 19), // Thứ 2
                LocalDate.of(2026, 10, 25), // Chủ nhật
                LoaiCongViec.CHU_DONG,
                "Giảng đường B");

        when(congViecRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<CongViecResponseDTO> results = congViecService.taoCongViecLapLai(1L, req);

        // Tuần đó có Thứ 2 (19), Thứ 4 (21), Thứ 6 (23) -> đúng 3 ngày
        assertEquals(3, results.size());

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<CongViec>> captor = ArgumentCaptor.forClass(List.class);
        verify(congViecRepository).saveAll(captor.capture());

        List<CongViec> savedList = captor.getValue();
        assertEquals(3, savedList.size());

        // Kiểm tra tất cả đều có chung maNhomLapLai (UUID) và coLapLai = true
        String maNhom = savedList.get(0).getMaNhomLapLai();
        assertNotNull(maNhom);
        for (CongViec cv : savedList) {
            assertEquals(maNhom, cv.getMaNhomLapLai());
            assertTrue(cv.getCoLapLai());
            assertEquals(TrangThaiCongViec.DANG_CHO, cv.getTrangThai());
            assertEquals(LoaiCongViec.CHU_DONG, cv.getLoaiCongViec());
        }
    }

    @Test
    @DisplayName("Cập nhật trạng thái thủ công thành HOAN_THANH")
    void testCapNhatTrangThai_ThanhCong() {
        CongViec existing = new CongViec();
        existing.setMaCongViec(123L);
        existing.setTrangThai(TrangThaiCongViec.DANG_CHO);

        when(congViecRepository.findById(123L)).thenReturn(Optional.of(existing));
        when(congViecRepository.save(any(CongViec.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CongViecResponseDTO response = congViecService.capNhatTrangThai(123L,
                new CapNhatTrangThaiDTO(TrangThaiCongViec.HOAN_THANH));

        assertEquals(TrangThaiCongViec.HOAN_THANH, response.getTrangThai());
        verify(congViecRepository).save(existing);
    }

    @Test
    @DisplayName("Lưu thời khóa biểu hàng loạt: gán đúng NguonTao.QUET_AI và coLapLai = true")
    void testLuuTkbHangLoat_ThanhCong() {
        when(nguoiDungRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        com.timass.dto.MonHocTkbDTO m1 = new com.timass.dto.MonHocTkbDTO(
                "Kiến trúc máy tính", "Thứ 2", "07:30", "09:30", "Phòng 101");
        com.timass.dto.MonHocTkbDTO m2 = new com.timass.dto.MonHocTkbDTO(
                "Phân tích thiết kế hệ thống", "Thứ 4", "13:00", "15:30", "Phòng 305");

        com.timass.dto.YeuCauLuuTkbHangLoatDTO req = new com.timass.dto.YeuCauLuuTkbHangLoatDTO(
                LocalDate.of(2026, 10, 19), // Thứ 2
                LocalDate.of(2026, 10, 25), // Chủ nhật (1 tuần: đúng 1 buổi T2 và 1 buổi T4)
                Arrays.asList(m1, m2));

        when(congViecRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<CongViecResponseDTO> results = congViecService.luuTkbHangLoat(1L, req);

        assertEquals(2, results.size());

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<CongViec>> captor = ArgumentCaptor.forClass(List.class);
        verify(congViecRepository).saveAll(captor.capture());

        List<CongViec> savedList = captor.getValue();
        assertEquals(2, savedList.size());

        for (CongViec cv : savedList) {
            assertEquals(NguonTao.QUET_AI, cv.getNguonTao()); // Phải là QUET_AI
            assertTrue(cv.getCoLapLai());
            assertNotNull(cv.getMaNhomLapLai());
            assertEquals(TrangThaiCongViec.DANG_CHO, cv.getTrangThai());
        }
    }

    @Test
    @DisplayName("Lưu thời khóa biểu hàng loạt ném ngoại lệ nếu giờ kết thúc trước giờ bắt đầu")
    void testLuuTkbHangLoat_LoiGio() {
        com.timass.dto.MonHocTkbDTO m = new com.timass.dto.MonHocTkbDTO(
                "Môn lỗi", "Thứ 2", "10:00", "08:00", "Phòng 1");

        com.timass.dto.YeuCauLuuTkbHangLoatDTO req = new com.timass.dto.YeuCauLuuTkbHangLoatDTO(
                LocalDate.of(2026, 10, 19),
                LocalDate.of(2026, 10, 25),
                Collections.singletonList(m));

        assertThrows(IllegalArgumentException.class, () -> congViecService.luuTkbHangLoat(1L, req));
    }
}

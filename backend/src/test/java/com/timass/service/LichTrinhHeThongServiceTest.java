package com.timass.service;

import com.timass.model.*;
import com.timass.repository.CongViecRepository;
import com.timass.repository.ThongBaoRepository;
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
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LichTrinhHeThongServiceTest {

    @Mock
    private CongViecRepository congViecRepo;

    @Mock
    private ThongBaoRepository thongBaoRepo;

    @InjectMocks
    private LichTrinhHeThongService lichTrinhHeThongService;

    private NguoiDung mockUser;
    private CongViec mockCongViec;

    @BeforeEach
    void setUp() {
        mockUser = new NguoiDung(1L, "0912345678", "hashPass", "Tran Van B");
        mockCongViec = new CongViec();
        mockCongViec.setMaCongViec(50L);
        mockCongViec.setNguoiDung(mockUser);
        mockCongViec.setTieuDe("Ăn trưa & Nghỉ ngơi");
        mockCongViec.setNgayThucHien(LocalDate.now());
        mockCongViec.setGioBatDau(LocalTime.of(12, 0));
        mockCongViec.setGioKetThuc(LocalTime.of(13, 0));
        mockCongViec.setLoaiCongViec(LoaiCongViec.THIET_YEU_BI_DONG);
        mockCongViec.setTrangThai(TrangThaiCongViec.DANG_CHO);
    }

    @Test
    @DisplayName("Tự động tích việc thiết yếu đã quá giờ kết thúc -> chuyển sang HOAN_THANH")
    void testTuDongTichViecThietYeu_ThanhCong() {
        when(congViecRepo.timViecThietYeuChuaXongTruocGio(any(LocalTime.class), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(mockCongViec));

        lichTrinhHeThongService.tuDongTichViecThietYeu();

        assertEquals(TrangThaiCongViec.HOAN_THANH, mockCongViec.getTrangThai());
        verify(congViecRepo, times(1)).save(mockCongViec);
    }

    @Test
    @DisplayName("Quét và gửi thông báo trước 15 phút: lưu vào bảng thong_bao với da_gui = true")
    void testQuetVaGuiThongBao15Phut_ThanhCong() {
        when(congViecRepo.timViecSapBatDauSau15PhutChuaBao(any(LocalTime.class), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(mockCongViec));
        when(thongBaoRepo.existsByCongViec_MaCongViecAndDaGuiTrue(50L)).thenReturn(false);

        lichTrinhHeThongService.quetVaGuiThongBao15Phut();

        ArgumentCaptor<ThongBao> captor = ArgumentCaptor.forClass(ThongBao.class);
        verify(thongBaoRepo, times(1)).save(captor.capture());

        ThongBao savedTb = captor.getValue();
        assertNotNull(savedTb);
        assertTrue(savedTb.getDaGui());
        assertEquals(mockCongViec, savedTb.getCongViec());
        assertEquals(mockUser, savedTb.getNguoiDung());
        assertNotNull(savedTb.getThoiGianNhac());
        assertNotNull(savedTb.getThoiGianGui());
    }

    @Test
    @DisplayName("Bỏ qua không tạo thông báo nếu công việc đã được gửi trước đó")
    void testQuetVaGuiThongBao15Phut_BoQuaKhiDaGui() {
        when(congViecRepo.timViecSapBatDauSau15PhutChuaBao(any(LocalTime.class), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(mockCongViec));
        when(thongBaoRepo.existsByCongViec_MaCongViecAndDaGuiTrue(50L)).thenReturn(true);

        lichTrinhHeThongService.quetVaGuiThongBao15Phut();

        verify(thongBaoRepo, never()).save(any(ThongBao.class));
    }

    @Test
    @DisplayName("Xử lý an toàn khi xảy ra lỗi DB mà không làm crash scheduler")
    void testSafeHandlingKhiCoNgoaiLe() {
        when(congViecRepo.timViecThietYeuChuaXongTruocGio(any(LocalTime.class), any(LocalDate.class)))
                .thenThrow(new RuntimeException("Lỗi kết nối cơ sở dữ liệu giả lập"));

        assertDoesNotThrow(() -> lichTrinhHeThongService.tuDongTichViecThietYeu());
    }
}

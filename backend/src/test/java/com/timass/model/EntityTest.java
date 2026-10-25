package com.timass.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class EntityTest {

    @Test
    @DisplayName("Kiểm tra khởi tạo và liên kết các Entity JPA theo ERD")
    void testEntityMappingAndEnums() {
        // 1. Kiểm tra Enums
        assertEquals(LoaiCongViec.CHU_DONG, LoaiCongViec.valueOf("CHU_DONG"));
        assertEquals(LoaiCongViec.THIET_YEU_BI_DONG, LoaiCongViec.valueOf("THIET_YEU_BI_DONG"));

        assertEquals(TrangThaiCongViec.DANG_CHO, TrangThaiCongViec.valueOf("DANG_CHO"));
        assertEquals(TrangThaiCongViec.HOAN_THANH, TrangThaiCongViec.valueOf("HOAN_THANH"));

        assertEquals(NguonTao.THU_CONG, NguonTao.valueOf("THU_CONG"));
        assertEquals(NguonTao.QUET_AI, NguonTao.valueOf("QUET_AI"));

        // 2. Tạo NguoiDung
        NguoiDung user = new NguoiDung(1L, "0912345678", "$2a$10$encryptedPass", "Nguyen Van A");
        user.onCreate();

        assertNotNull(user.getThoiGianTao());
        assertEquals("0912345678", user.getSoDienThoai());

        // 3. Tạo CongViec
        CongViec job = new CongViec();
        job.setMaCongViec(100L);
        job.setNguoiDung(user);
        job.setTieuDe("Học Spring Boot 3 & JPA");
        job.setNgayThucHien(LocalDate.of(2026, 10, 21));
        job.setGioBatDau(LocalTime.of(8, 0));
        job.setGioKetThuc(LocalTime.of(10, 0));
        job.setLoaiCongViec(LoaiCongViec.CHU_DONG);
        job.setTrangThai(TrangThaiCongViec.DANG_CHO);
        job.setNguonTao(NguonTao.THU_CONG);
        job.setCoLapLai(true);
        job.setMaNhomLapLai("GROUP-2026-X1");
        job.setDiaDiem("Phòng Lab A1");
        job.onCreate();

        user.getDanhSachCongViec().add(job);

        assertEquals(1, user.getDanhSachCongViec().size());
        assertEquals(user, job.getNguoiDung());
        assertEquals(LoaiCongViec.CHU_DONG, job.getLoaiCongViec());

        // 4. Tạo ThongBao
        ThongBao alert = new ThongBao();
        alert.setMaThongBao(1000L);
        alert.setCongViec(job);
        alert.setNguoiDung(user);
        alert.setThoiGianNhac(LocalDateTime.of(2026, 10, 21, 7, 45));
        alert.setDaGui(false);
        alert.onCreate();

        job.getDanhSachThongBao().add(alert);
        user.getDanhSachThongBao().add(alert);

        assertEquals(1, job.getDanhSachThongBao().size());
        assertEquals(1, user.getDanhSachThongBao().size());
        assertFalse(alert.getDaGui());
    }
}

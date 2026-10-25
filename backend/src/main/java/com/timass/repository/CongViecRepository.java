package com.timass.repository;

import com.timass.model.CongViec;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CongViecRepository extends JpaRepository<CongViec, Long> {

    // 1. Tìm công việc của người dùng theo một ngày cụ thể (sắp xếp theo giờ bắt đầu)
    @Query("SELECT c FROM CongViec c WHERE c.nguoiDung.maNguoiDung = :maNguoiDung AND c.ngayThucHien = :ngay ORDER BY c.gioBatDau ASC")
    List<CongViec> timTheoNguoiDungVaNgay(@Param("maNguoiDung") Long maNguoiDung, @Param("ngay") LocalDate ngay);

    // 2. Tìm công việc của người dùng trong khoảng ngày (Lịch tuần / Day range)
    @Query("SELECT c FROM CongViec c WHERE c.nguoiDung.maNguoiDung = :maNguoiDung AND c.ngayThucHien BETWEEN :batDau AND :ketThuc ORDER BY c.ngayThucHien ASC, c.gioBatDau ASC")
    List<CongViec> timTheoNguoiDungVaKhoangNgay(@Param("maNguoiDung") Long maNguoiDung, @Param("batDau") LocalDate batDau, @Param("ketThuc") LocalDate ketThuc);

    // 3. Tìm các việc thiết yếu / bị động chưa hoàn thành và đã qua khung giờ kết thúc trong ngày (JOIN FETCH tránh N+1)
    @Query("SELECT c FROM CongViec c JOIN FETCH c.nguoiDung WHERE c.loaiCongViec = com.timass.model.LoaiCongViec.THIET_YEU_BI_DONG AND c.trangThai = com.timass.model.TrangThaiCongViec.DANG_CHO AND c.ngayThucHien = :ngay AND c.gioKetThuc <= :gioHienTai")
    List<CongViec> timViecThietYeuChuaXongTruocGio(@Param("gioHienTai") LocalTime gioHienTai, @Param("ngay") LocalDate ngay);

    // 4. Tìm các việc sắp bắt đầu sau 15 phút (JOIN FETCH tránh N+1)
    @Query("SELECT c FROM CongViec c JOIN FETCH c.nguoiDung WHERE c.ngayThucHien = :ngay AND c.gioBatDau = :gioMucTieu")
    List<CongViec> timViecSapBatDauSau15Phut(@Param("gioMucTieu") LocalTime gioMucTieu, @Param("ngay") LocalDate ngay);

    // 4b. Tìm các việc sắp bắt đầu sau 15 phút VÀ chưa gửi thông báo trước đó
    @Query("SELECT c FROM CongViec c JOIN FETCH c.nguoiDung WHERE c.ngayThucHien = :ngay AND c.gioBatDau = :gioMucTieu AND NOT EXISTS (SELECT t FROM ThongBao t WHERE t.congViec = c AND t.daGui = true)")
    List<CongViec> timViecSapBatDauSau15PhutChuaBao(@Param("gioMucTieu") LocalTime gioMucTieu, @Param("ngay") LocalDate ngay);

    // 5. Xóa toàn bộ công việc theo mã nhóm lặp lại
    @Modifying
    @Query("DELETE FROM CongViec c WHERE c.maNhomLapLai = :maNhom")
    void xoaTheoMaNhomLapLai(@Param("maNhom") String maNhom);

    // Spring Data JPA query methods bổ sung
    List<CongViec> findByMaNhomLapLai(String maNhomLapLai);

    void deleteByMaNhomLapLai(String maNhomLapLai);
}

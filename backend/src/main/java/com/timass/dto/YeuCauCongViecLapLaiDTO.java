package com.timass.dto;

import com.timass.model.LoaiCongViec;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class YeuCauCongViecLapLaiDTO {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String tieuDe;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime gioBatDau;

    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalTime gioKetThuc;

    @NotEmpty(message = "Danh sách thứ lặp lại không được để trống")
    private List<Integer> danhSachThu; // Ví dụ: [2, 4, 6] (Thứ 2, 4, 6) hoặc [1..7] (ISO DayOfWeek)

    @NotNull(message = "Ngày bắt đầu áp dụng không được để trống")
    private LocalDate ngayBatDau;

    @NotNull(message = "Ngày kết thúc áp dụng không được để trống")
    private LocalDate ngayKetThuc;

    @NotNull(message = "Loại công việc không được để trống (CHU_DONG hoặc THIET_YEU_BI_DONG)")
    private LoaiCongViec loaiCongViec;

    private String diaDiem;

    public YeuCauCongViecLapLaiDTO() {
    }

    public YeuCauCongViecLapLaiDTO(String tieuDe, LocalTime gioBatDau, LocalTime gioKetThuc,
                                   List<Integer> danhSachThu, LocalDate ngayBatDau,
                                   LocalDate ngayKetThuc, LoaiCongViec loaiCongViec, String diaDiem) {
        this.tieuDe = tieuDe;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.danhSachThu = danhSachThu;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.loaiCongViec = loaiCongViec;
        this.diaDiem = diaDiem;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public LocalTime getGioBatDau() {
        return gioBatDau;
    }

    public void setGioBatDau(LocalTime gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public LocalTime getGioKetThuc() {
        return gioKetThuc;
    }

    public void setGioKetThuc(LocalTime gioKetThuc) {
        this.gioKetThuc = gioKetThuc;
    }

    public List<Integer> getDanhSachThu() {
        return danhSachThu;
    }

    public void setDanhSachThu(List<Integer> danhSachThu) {
        this.danhSachThu = danhSachThu;
    }

    public LocalDate getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDate ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public LoaiCongViec getLoaiCongViec() {
        return loaiCongViec;
    }

    public void setLoaiCongViec(LoaiCongViec loaiCongViec) {
        this.loaiCongViec = loaiCongViec;
    }

    public String getDiaDiem() {
        return diaDiem;
    }

    public void setDiaDiem(String diaDiem) {
        this.diaDiem = diaDiem;
    }
}

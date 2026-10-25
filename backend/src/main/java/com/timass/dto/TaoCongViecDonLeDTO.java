package com.timass.dto;

import com.timass.model.LoaiCongViec;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class TaoCongViecDonLeDTO {

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự")
    private String tieuDe;

    @NotNull(message = "Ngày thực hiện không được để trống")
    private LocalDate ngayThucHien;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime gioBatDau;

    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalTime gioKetThuc;

    @NotNull(message = "Loại công việc không được để trống (CHU_DONG hoặc THIET_YEU_BI_DONG)")
    private LoaiCongViec loaiCongViec;

    private String diaDiem;

    public TaoCongViecDonLeDTO() {
    }

    public TaoCongViecDonLeDTO(String tieuDe, LocalDate ngayThucHien, LocalTime gioBatDau,
                               LocalTime gioKetThuc, LoaiCongViec loaiCongViec, String diaDiem) {
        this.tieuDe = tieuDe;
        this.ngayThucHien = ngayThucHien;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.loaiCongViec = loaiCongViec;
        this.diaDiem = diaDiem;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public void setTieuDe(String tieuDe) {
        this.tieuDe = tieuDe;
    }

    public LocalDate getNgayThucHien() {
        return ngayThucHien;
    }

    public void setNgayThucHien(LocalDate ngayThucHien) {
        this.ngayThucHien = ngayThucHien;
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

package com.timass.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public class YeuCauLuuTkbHangLoatDTO {

    @NotNull(message = "Ngày bắt đầu áp dụng thời khóa biểu không được để trống")
    private LocalDate ngayBatDau;

    @NotNull(message = "Ngày kết thúc áp dụng thời khóa biểu không được để trống")
    private LocalDate ngayKetThuc;

    @NotEmpty(message = "Danh sách môn học từ thời khóa biểu không được để trống")
    @Valid
    private List<MonHocTkbDTO> danhSachMonHoc;

    public YeuCauLuuTkbHangLoatDTO() {
    }

    public YeuCauLuuTkbHangLoatDTO(LocalDate ngayBatDau, LocalDate ngayKetThuc, List<MonHocTkbDTO> danhSachMonHoc) {
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.danhSachMonHoc = danhSachMonHoc;
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

    public List<MonHocTkbDTO> getDanhSachMonHoc() {
        return danhSachMonHoc;
    }

    public void setDanhSachMonHoc(List<MonHocTkbDTO> danhSachMonHoc) {
        this.danhSachMonHoc = danhSachMonHoc;
    }
}

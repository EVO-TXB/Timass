package com.timass.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MonHocTkbDTO {

    @NotBlank(message = "Tên môn học không được để trống")
    private String tenMonHoc;

    @NotBlank(message = "Thứ trong tuần không được để trống (ví dụ: Thứ 2, Thứ 3...)")
    private String thuTrongTuan;

    @NotBlank(message = "Giờ bắt đầu không được để trống (định dạng HH:mm)")
    private String gioBatDau;

    @NotBlank(message = "Giờ kết thúc không được để trống (định dạng HH:mm)")
    private String gioKetThuc;

    private String phongHoc;

    public MonHocTkbDTO() {
    }

    public MonHocTkbDTO(String tenMonHoc, String thuTrongTuan, String gioBatDau, String gioKetThuc, String phongHoc) {
        this.tenMonHoc = tenMonHoc;
        this.thuTrongTuan = thuTrongTuan;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.phongHoc = phongHoc;
    }

    public String getTenMonHoc() {
        return tenMonHoc;
    }

    public void setTenMonHoc(String tenMonHoc) {
        this.tenMonHoc = tenMonHoc;
    }

    public String getThuTrongTuan() {
        return thuTrongTuan;
    }

    public void setThuTrongTuan(String thuTrongTuan) {
        this.thuTrongTuan = thuTrongTuan;
    }

    public String getGioBatDau() {
        return gioBatDau;
    }

    public void setGioBatDau(String gioBatDau) {
        this.gioBatDau = gioBatDau;
    }

    public String getGioKetThuc() {
        return gioKetThuc;
    }

    public void setGioKetThuc(String gioKetThuc) {
        this.gioKetThuc = gioKetThuc;
    }

    public String getPhongHoc() {
        return phongHoc;
    }

    public void setPhongHoc(String phongHoc) {
        this.phongHoc = phongHoc;
    }

    @Override
    public String toString() {
        return "MonHocTkbDTO{" +
                "tenMonHoc='" + tenMonHoc + '\'' +
                ", thuTrongTuan='" + thuTrongTuan + '\'' +
                ", gioBatDau='" + gioBatDau + '\'' +
                ", gioKetThuc='" + gioKetThuc + '\'' +
                ", phongHoc='" + phongHoc + '\'' +
                '}';
    }
}

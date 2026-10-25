package com.timass.dto;

import jakarta.validation.constraints.NotBlank;

public class DangNhapDTO {

    @NotBlank(message = "Số điện thoại không được để trống")
    private String soDienThoai;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String matKhau;

    public DangNhapDTO() {
    }

    public DangNhapDTO(String soDienThoai, String matKhau) {
        this.soDienThoai = soDienThoai;
        this.matKhau = matKhau;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
}

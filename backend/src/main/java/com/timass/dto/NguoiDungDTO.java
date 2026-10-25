package com.timass.dto;

import com.timass.model.NguoiDung;

public class NguoiDungDTO {
    private Long id;
    private Long maNguoiDung;
    private String hoTen;
    private String soDienThoai;
    private String token;
    private String role;
    private String avatarUrl;

    public NguoiDungDTO() {
    }

    public static NguoiDungDTO fromEntity(NguoiDung entity, String token) {
        NguoiDungDTO dto = new NguoiDungDTO();
        dto.setId(entity.getMaNguoiDung());
        dto.setMaNguoiDung(entity.getMaNguoiDung());
        dto.setHoTen(entity.getHoVaTen() != null ? entity.getHoVaTen() : "Người dùng Timass");
        dto.setSoDienThoai(entity.getSoDienThoai());
        dto.setToken(token);
        dto.setRole("USER");
        dto.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80");
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(Long maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}

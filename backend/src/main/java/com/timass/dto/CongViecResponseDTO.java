package com.timass.dto;

import com.timass.model.CongViec;
import com.timass.model.LoaiCongViec;
import com.timass.model.NguonTao;
import com.timass.model.TrangThaiCongViec;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class CongViecResponseDTO {

    private Long maCongViec;
    private Long maNguoiDung;
    private String tieuDe;
    private LocalDate ngayThucHien;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private LoaiCongViec loaiCongViec;
    private TrangThaiCongViec trangThai;
    private NguonTao nguonTao;
    private Boolean coLapLai;
    private String maNhomLapLai;
    private String diaDiem;
    private LocalDateTime thoiGianTao;

    public CongViecResponseDTO() {
    }

    public static CongViecResponseDTO fromEntity(CongViec entity) {
        if (entity == null) {
            return null;
        }
        CongViecResponseDTO dto = new CongViecResponseDTO();
        dto.setMaCongViec(entity.getMaCongViec());
        if (entity.getNguoiDung() != null) {
            dto.setMaNguoiDung(entity.getNguoiDung().getMaNguoiDung());
        }
        dto.setTieuDe(entity.getTieuDe());
        dto.setNgayThucHien(entity.getNgayThucHien());
        dto.setGioBatDau(entity.getGioBatDau());
        dto.setGioKetThuc(entity.getGioKetThuc());
        dto.setLoaiCongViec(entity.getLoaiCongViec());
        dto.setTrangThai(entity.getTrangThai());
        dto.setNguonTao(entity.getNguonTao());
        dto.setCoLapLai(entity.getCoLapLai());
        dto.setMaNhomLapLai(entity.getMaNhomLapLai());
        dto.setDiaDiem(entity.getDiaDiem());
        dto.setThoiGianTao(entity.getThoiGianTao());
        return dto;
    }

    public Long getMaCongViec() {
        return maCongViec;
    }

    public void setMaCongViec(Long maCongViec) {
        this.maCongViec = maCongViec;
    }

    public Long getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(Long maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
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

    public TrangThaiCongViec getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiCongViec trangThai) {
        this.trangThai = trangThai;
    }

    public NguonTao getNguonTao() {
        return nguonTao;
    }

    public void setNguonTao(NguonTao nguonTao) {
        this.nguonTao = nguonTao;
    }

    public Boolean getCoLapLai() {
        return coLapLai;
    }

    public void setCoLapLai(Boolean coLapLai) {
        this.coLapLai = coLapLai;
    }

    public String getMaNhomLapLai() {
        return maNhomLapLai;
    }

    public void setMaNhomLapLai(String maNhomLapLai) {
        this.maNhomLapLai = maNhomLapLai;
    }

    public String getDiaDiem() {
        return diaDiem;
    }

    public void setDiaDiem(String diaDiem) {
        this.diaDiem = diaDiem;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public void setThoiGianTao(LocalDateTime thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }
}

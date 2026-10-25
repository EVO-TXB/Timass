package com.timass.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.timass.model.LoaiCongViec;
import com.timass.model.TrangThaiCongViec;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CapNhatCongViecDTO {

    private String tieuDe;
    private LocalDate ngayThucHien;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private LoaiCongViec loaiCongViec;
    private TrangThaiCongViec trangThai;
    private String diaDiem;
    private Boolean coLapLai;
    private String maNhomLapLai;

    @JsonAlias({"apDungTatCa", "applyToAll"})
    private Boolean apDungChoTatCa = false;

    private List<Object> danhSachThu;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;

    public CapNhatCongViecDTO() {
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

    public String getDiaDiem() {
        return diaDiem;
    }

    public void setDiaDiem(String diaDiem) {
        this.diaDiem = diaDiem;
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

    public Boolean getApDungChoTatCa() {
        return apDungChoTatCa;
    }

    public void setApDungChoTatCa(Boolean apDungChoTatCa) {
        this.apDungChoTatCa = apDungChoTatCa;
    }

    public List<Object> getDanhSachThu() {
        return danhSachThu;
    }

    public void setDanhSachThu(List<Object> danhSachThu) {
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
}

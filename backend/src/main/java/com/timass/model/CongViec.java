package com.timass.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "cong_viec")
public class CongViec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_cong_viec")
    private Long maCongViec;

    // Quan hệ N - 1 với NguoiDung (Công việc thuộc về 1 người dùng)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "tieu_de", nullable = false, length = 255)
    private String tieuDe;

    @Column(name = "ngay_thuc_hien", nullable = false)
    private LocalDate ngayThucHien;

    @Column(name = "gio_bat_dau", nullable = false)
    private LocalTime gioBatDau;

    @Column(name = "gio_ket_thuc", nullable = false)
    private LocalTime gioKetThuc;

    @Enumerated(EnumType.STRING)
    @Column(name = "loai_cong_viec", nullable = false, columnDefinition = "ENUM('CHU_DONG', 'THIET_YEU_BI_DONG')")
    private LoaiCongViec loaiCongViec;

    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai", nullable = false, columnDefinition = "ENUM('DANG_CHO', 'HOAN_THANH') DEFAULT 'DANG_CHO'")
    private TrangThaiCongViec trangThai = TrangThaiCongViec.DANG_CHO;

    @Enumerated(EnumType.STRING)
    @Column(name = "nguon_tao", nullable = false, columnDefinition = "ENUM('THU_CONG', 'QUET_AI') DEFAULT 'THU_CONG'")
    private NguonTao nguonTao = NguonTao.THU_CONG;

    @Column(name = "co_lap_lai")
    private Boolean coLapLai = false;

    @Column(name = "ma_nhom_lap_lai", length = 64)
    private String maNhomLapLai;

    @Column(name = "dia_diem", length = 255)
    private String diaDiem;

    @Column(name = "thoi_gian_tao", updatable = false)
    private LocalDateTime thoiGianTao;

    // Quan hệ 1 - N với ThongBao (Công việc kích hoạt nhiều thông báo)
    @OneToMany(mappedBy = "congViec", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ThongBao> danhSachThongBao = new ArrayList<>();

    public CongViec() {
    }

    public CongViec(Long maCongViec, NguoiDung nguoiDung, String tieuDe, LocalDate ngayThucHien,
                    LocalTime gioBatDau, LocalTime gioKetThuc, LoaiCongViec loaiCongViec,
                    TrangThaiCongViec trangThai, NguonTao nguonTao, Boolean coLapLai,
                    String maNhomLapLai, String diaDiem) {
        this.maCongViec = maCongViec;
        this.nguoiDung = nguoiDung;
        this.tieuDe = tieuDe;
        this.ngayThucHien = ngayThucHien;
        this.gioBatDau = gioBatDau;
        this.gioKetThuc = gioKetThuc;
        this.loaiCongViec = loaiCongViec;
        this.trangThai = (trangThai != null) ? trangThai : TrangThaiCongViec.DANG_CHO;
        this.nguonTao = (nguonTao != null) ? nguonTao : NguonTao.THU_CONG;
        this.coLapLai = (coLapLai != null) ? coLapLai : false;
        this.maNhomLapLai = maNhomLapLai;
        this.diaDiem = diaDiem;
    }

    @PrePersist
    protected void onCreate() {
        if (this.thoiGianTao == null) {
            this.thoiGianTao = LocalDateTime.now();
        }
        if (this.coLapLai == null) {
            this.coLapLai = false;
        }
        if (this.trangThai == null) {
            this.trangThai = TrangThaiCongViec.DANG_CHO;
        }
        if (this.nguonTao == null) {
            this.nguonTao = NguonTao.THU_CONG;
        }
    }

    public Long getMaCongViec() {
        return maCongViec;
    }

    public void setMaCongViec(Long maCongViec) {
        this.maCongViec = maCongViec;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public void setNguoiDung(NguoiDung nguoiDung) {
        this.nguoiDung = nguoiDung;
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

    public List<ThongBao> getDanhSachThongBao() {
        return danhSachThongBao;
    }

    public void setDanhSachThongBao(List<ThongBao> danhSachThongBao) {
        this.danhSachThongBao = danhSachThongBao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CongViec)) return false;
        CongViec that = (CongViec) o;
        return Objects.equals(maCongViec, that.maCongViec);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maCongViec);
    }

    @Override
    public String toString() {
        return "CongViec{" +
                "maCongViec=" + maCongViec +
                ", tieuDe='" + tieuDe + '\'' +
                ", ngayThucHien=" + ngayThucHien +
                ", gioBatDau=" + gioBatDau +
                ", gioKetThuc=" + gioKetThuc +
                ", loaiCongViec=" + loaiCongViec +
                ", trangThai=" + trangThai +
                ", nguonTao=" + nguonTao +
                ", coLapLai=" + coLapLai +
                ", maNhomLapLai='" + maNhomLapLai + '\'' +
                ", diaDiem='" + diaDiem + '\'' +
                ", thoiGianTao=" + thoiGianTao +
                '}';
    }
}

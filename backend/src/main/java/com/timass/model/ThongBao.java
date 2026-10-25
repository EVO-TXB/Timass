package com.timass.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "thong_bao")
public class ThongBao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_thong_bao")
    private Long maThongBao;

    // Quan hệ N - 1 với CongViec (Thông báo kích hoạt từ 1 công việc)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_cong_viec", nullable = false)
    private CongViec congViec;

    // Quan hệ N - 1 với NguoiDung (Thông báo gửi tới 1 người dùng)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "thoi_gian_nhac", nullable = false)
    private LocalDateTime thoiGianNhac;

    @Column(name = "da_gui", nullable = false)
    private Boolean daGui = false;

    @Column(name = "thoi_gian_gui")
    private LocalDateTime thoiGianGui;

    public ThongBao() {
    }

    public ThongBao(Long maThongBao, CongViec congViec, NguoiDung nguoiDung,
            LocalDateTime thoiGianNhac, Boolean daGui, LocalDateTime thoiGianGui) {
        this.maThongBao = maThongBao;
        this.congViec = congViec;
        this.nguoiDung = nguoiDung;
        this.thoiGianNhac = thoiGianNhac;
        this.daGui = (daGui != null) ? daGui : false;
        this.thoiGianGui = thoiGianGui;
    }

    @PrePersist
    protected void onCreate() {
        if (this.daGui == null) {
            this.daGui = false;
        }
    }

    public Long getMaThongBao() {
        return maThongBao;
    }

    public void setMaThongBao(Long maThongBao) {
        this.maThongBao = maThongBao;
    }

    public CongViec getCongViec() {
        return congViec;
    }

    public void setCongViec(CongViec congViec) {
        this.congViec = congViec;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public void setNguoiDung(NguoiDung nguoiDung) {
        this.nguoiDung = nguoiDung;
    }

    public LocalDateTime getThoiGianNhac() {
        return thoiGianNhac;
    }

    public void setThoiGianNhac(LocalDateTime thoiGianNhac) {
        this.thoiGianNhac = thoiGianNhac;
    }

    public Boolean getDaGui() {
        return daGui;
    }

    public void setDaGui(Boolean daGui) {
        this.daGui = daGui;
    }

    public LocalDateTime getThoiGianGui() {
        return thoiGianGui;
    }

    public void setThoiGianGui(LocalDateTime thoiGianGui) {
        this.thoiGianGui = thoiGianGui;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ThongBao))
            return false;
        ThongBao thongBao = (ThongBao) o;
        return Objects.equals(maThongBao, thongBao.maThongBao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maThongBao);
    }

    @Override
    public String toString() {
        return "ThongBao{" +
                "maThongBao=" + maThongBao +
                ", thoiGianNhac=" + thoiGianNhac +
                ", daGui=" + daGui +
                ", thoiGianGui=" + thoiGianGui +
                '}';
    }
}

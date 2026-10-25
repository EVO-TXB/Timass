package com.timass.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "nguoi_dung")
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nguoi_dung")
    private Long maNguoiDung;

    @Column(name = "so_dien_thoai", nullable = false, unique = true, length = 20)
    private String soDienThoai;

    @Column(name = "mat_khau_ma_hoa", nullable = false, length = 255)
    private String matKhauMaHoa;

    @Column(name = "ho_va_ten", length = 100)
    private String hoVaTen;

    @Column(name = "thoi_gian_tao", updatable = false)
    private LocalDateTime thoiGianTao;

    // Quan hệ 1 - N với CongViec (Người dùng sở hữu nhiều công việc)
    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CongViec> danhSachCongViec = new ArrayList<>();

    // Quan hệ 1 - N với ThongBao (Người dùng nhận nhiều thông báo)
    @OneToMany(mappedBy = "nguoiDung", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ThongBao> danhSachThongBao = new ArrayList<>();

    public NguoiDung() {
    }

    public NguoiDung(Long maNguoiDung, String soDienThoai, String matKhauMaHoa, String hoVaTen) {
        this.maNguoiDung = maNguoiDung;
        this.soDienThoai = soDienThoai;
        this.matKhauMaHoa = matKhauMaHoa;
        this.hoVaTen = hoVaTen;
    }

    @PrePersist
    protected void onCreate() {
        if (this.thoiGianTao == null) {
            this.thoiGianTao = LocalDateTime.now();
        }
    }

    public Long getMaNguoiDung() {
        return maNguoiDung;
    }

    public void setMaNguoiDung(Long maNguoiDung) {
        this.maNguoiDung = maNguoiDung;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getMatKhauMaHoa() {
        return matKhauMaHoa;
    }

    public void setMatKhauMaHoa(String matKhauMaHoa) {
        this.matKhauMaHoa = matKhauMaHoa;
    }

    public String getHoVaTen() {
        return hoVaTen;
    }

    public void setHoVaTen(String hoVaTen) {
        this.hoVaTen = hoVaTen;
    }

    public LocalDateTime getThoiGianTao() {
        return thoiGianTao;
    }

    public void setThoiGianTao(LocalDateTime thoiGianTao) {
        this.thoiGianTao = thoiGianTao;
    }

    public List<CongViec> getDanhSachCongViec() {
        return danhSachCongViec;
    }

    public void setDanhSachCongViec(List<CongViec> danhSachCongViec) {
        this.danhSachCongViec = danhSachCongViec;
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
        if (!(o instanceof NguoiDung)) return false;
        NguoiDung that = (NguoiDung) o;
        return Objects.equals(maNguoiDung, that.maNguoiDung);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maNguoiDung);
    }

    @Override
    public String toString() {
        return "NguoiDung{" +
                "maNguoiDung=" + maNguoiDung +
                ", soDienThoai='" + soDienThoai + '\'' +
                ", hoVaTen='" + hoVaTen + '\'' +
                ", thoiGianTao=" + thoiGianTao +
                '}';
    }
}

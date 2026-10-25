package com.timass.repository;

import com.timass.model.ThongBao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongBaoRepository extends JpaRepository<ThongBao, Long> {

    // Phương thức khớp đặc tả Class Diagram
    default ThongBao luuThongBao(ThongBao thongBao) {
        return save(thongBao);
    }

    List<ThongBao> findByNguoiDung_MaNguoiDung(Long maNguoiDung);

    List<ThongBao> findByCongViec_MaCongViec(Long maCongViec);

    boolean existsByCongViec_MaCongViecAndDaGuiTrue(Long maCongViec);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ThongBao t WHERE t.congViec.maCongViec = :maCongViec")
    void xoaTheoMaCongViec(@org.springframework.data.repository.query.Param("maCongViec") Long maCongViec);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ThongBao t WHERE t.congViec.maNhomLapLai = :maNhom")
    void xoaTheoMaNhomLapLai(@org.springframework.data.repository.query.Param("maNhom") String maNhom);
}

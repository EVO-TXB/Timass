package com.timass.repository;

import com.timass.model.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {

    // Phương thức chuẩn Spring Data JPA
    Optional<NguoiDung> findBySoDienThoai(String soDienThoai);

    boolean existsBySoDienThoai(String soDienThoai);

    // Phương thức khớp đặc tả Class Diagram
    @Query("SELECT n FROM NguoiDung n WHERE n.soDienThoai = :soDienThoai")
    Optional<NguoiDung> timTheoSoDienThoai(@Param("soDienThoai") String soDienThoai);

    @Query("SELECT CASE WHEN COUNT(n) > 0 THEN true ELSE false END FROM NguoiDung n WHERE n.soDienThoai = :soDienThoai")
    Boolean tonTaiSoDienThoai(@Param("soDienThoai") String soDienThoai);
}

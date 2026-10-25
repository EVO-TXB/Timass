package com.timass.service;

import com.timass.dto.CapNhatTrangThaiDTO;
import com.timass.dto.CongViecResponseDTO;
import com.timass.dto.TaoCongViecDonLeDTO;
import com.timass.dto.YeuCauCongViecLapLaiDTO;
import com.timass.model.TrangThaiCongViec;

import java.time.LocalDate;
import java.util.List;

public interface CongViecService {

    /**
     * Tạo một công việc đơn lẻ
     */
    CongViecResponseDTO taoCongViecDonLe(Long maNguoiDung, TaoCongViecDonLeDTO yeuCau);

    /**
     * Tạo chuỗi công việc lặp lại hàng loạt theo các thứ trong tuần
     */
    List<CongViecResponseDTO> taoCongViecLapLai(Long maNguoiDung, YeuCauCongViecLapLaiDTO yeuCau);

    /**
     * Cập nhật trạng thái hoàn thành công việc (thủ công)
     */
    CongViecResponseDTO capNhatTrangThai(Long maCongViec, TrangThaiCongViec trangThai);

    /**
     * Cập nhật trạng thái công việc qua DTO
     */
    CongViecResponseDTO capNhatTrangThai(Long maCongViec, CapNhatTrangThaiDTO yeuCau);

    /**
     * Cập nhật công việc (hỗ trợ cả cập nhật đơn lẻ và cập nhật cả chuỗi lặp)
     */
    CongViecResponseDTO capNhatCongViec(Long maCongViec, com.timass.dto.CapNhatCongViecDTO yeuCau);

    /**
     * Lấy danh sách công việc theo khoảng ngày (Lịch tuần / Day range)
     */
    List<CongViecResponseDTO> layDanhSachTheoKhoangNgay(Long maNguoiDung, LocalDate tuNgay, LocalDate denNgay);

    /**
     * Lấy danh sách công việc theo một ngày cụ thể
     */
    List<CongViecResponseDTO> layLichTheoNgay(Long maNguoiDung, LocalDate ngay);

    /**
     * Lưu hàng loạt các môn học từ thời khóa biểu (AI trích xuất) áp dụng theo khoảng ngày
     */
    List<CongViecResponseDTO> luuTkbHangLoat(Long maNguoiDung, com.timass.dto.YeuCauLuuTkbHangLoatDTO yeuCau);

    /**
     * Xóa công việc: đơn lẻ hoặc xóa toàn bộ chuỗi lặp lại
     */
    void xoaCongViec(Long maCongViec, boolean xoaCaChuoiLap);

    /**
     * Xóa toàn bộ chuỗi công việc theo mã nhóm lặp lại
     */
    void xoaTheoNhomLapLai(String maNhomLapLai);
}

package com.timass.controller;

import com.timass.dto.*;
import com.timass.service.CongViecService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cong-viec")
@CrossOrigin(origins = "http://localhost:5173")
public class CongViecController {

    private final CongViecService congViecService;

    public CongViecController(CongViecService congViecService) {
        this.congViecService = congViecService;
    }

    /**
     * API 1: Tạo công việc đơn lẻ
     * POST /api/v1/cong-viec/don-le (hoặc POST /api/v1/cong-viec)
     */
    @PostMapping(path = {"", "/don-le"})
    public ResponseEntity<ApiResponse<CongViecResponseDTO>> taoCongViecDonLe(
            @RequestHeader(value = "X-User-Id", required = false) Long maNguoiDung,
            @Valid @RequestBody TaoCongViecDonLeDTO yeuCau) {

        CongViecResponseDTO ketQua = congViecService.taoCongViecDonLe(maNguoiDung, yeuCau);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo công việc thành công", ketQua));
    }

    /**
     * API 2: Tạo chuỗi công việc lặp lại hàng loạt theo thứ trong tuần
     * POST /api/v1/cong-viec/lap-lai
     */
    @PostMapping("/lap-lai")
    public ResponseEntity<ApiResponse<List<CongViecResponseDTO>>> taoCongViecLapLai(
            @RequestHeader(value = "X-User-Id", required = false) Long maNguoiDung,
            @Valid @RequestBody YeuCauCongViecLapLaiDTO yeuCau) {

        List<CongViecResponseDTO> danhSachDaTao = congViecService.taoCongViecLapLai(maNguoiDung, yeuCau);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo chuỗi công việc lặp lại thành công (" + danhSachDaTao.size() + " bản ghi)", danhSachDaTao));
    }

    /**
     * API 2b: Lưu hàng loạt thời khóa biểu trích xuất từ ảnh AI vào lịch trình
     * POST /api/v1/cong-viec/luu-hang-loat
     */
    @PostMapping("/luu-hang-loat")
    public ResponseEntity<ApiResponse<List<CongViecResponseDTO>>> luuTkbHangLoat(
            @RequestHeader(value = "X-User-Id", required = false) Long maNguoiDung,
            @Valid @RequestBody YeuCauLuuTkbHangLoatDTO yeuCau) {

        List<CongViecResponseDTO> ketQua = congViecService.luuTkbHangLoat(maNguoiDung, yeuCau);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đã lưu toàn bộ thời khóa biểu vào lịch (" + ketQua.size() + " buổi học)", ketQua));
    }

    /**
     * API 3: Cập nhật trạng thái hoàn thành (thủ công)
     * PATCH /api/v1/cong-viec/{maCongViec}/trang-thai
     */
    @PatchMapping("/{maCongViec}/trang-thai")
    public ResponseEntity<ApiResponse<CongViecResponseDTO>> capNhatTrangThai(
            @PathVariable("maCongViec") Long maCongViec,
            @Valid @RequestBody CapNhatTrangThaiDTO yeuCau) {

        CongViecResponseDTO ketQua = congViecService.capNhatTrangThai(maCongViec, yeuCau);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái công việc thành công", ketQua));
    }

    /**
     * API 3b: Cập nhật chi tiết công việc (đơn lẻ hoặc chuỗi lặp)
     * PUT /api/v1/cong-viec/{maCongViec}
     */
    @PutMapping("/{maCongViec}")
    public ResponseEntity<ApiResponse<CongViecResponseDTO>> capNhatCongViec(
            @PathVariable("maCongViec") Long maCongViec,
            @RequestBody CapNhatCongViecDTO yeuCau) {

        CongViecResponseDTO ketQua = congViecService.capNhatCongViec(maCongViec, yeuCau);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin công việc thành công", ketQua));
    }

    /**
     * API 4: Lấy danh sách lịch trình
     * GET /api/v1/cong-viec?ngay=2026-10-21 (xem theo ngày)
     * GET /api/v1/cong-viec?tuNgay=2026-10-19&denNgay=2026-10-25 (xem theo khoảng / lịch tuần)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CongViecResponseDTO>>> layDanhSach(
            @RequestHeader(value = "X-User-Id", required = false) Long maNguoiDung,
            @RequestParam(value = "ngay", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay,
            @RequestParam(value = "tuNgay", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam(value = "denNgay", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay) {

        List<CongViecResponseDTO> ketQua;
        if (ngay != null) {
            ketQua = congViecService.layLichTheoNgay(maNguoiDung, ngay);
        } else {
            ketQua = congViecService.layDanhSachTheoKhoangNgay(maNguoiDung, tuNgay, denNgay);
        }

        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách công việc thành công", ketQua));
    }

    /**
     * API 5: Xóa công việc
     * DELETE /api/v1/cong-viec/{maCongViec}?xoaCaChuoiLap=false|true
     */
    @DeleteMapping("/{maCongViec}")
    public ResponseEntity<ApiResponse<Void>> xoaCongViec(
            @PathVariable("maCongViec") Long maCongViec,
            @RequestParam(value = "xoaCaChuoiLap", defaultValue = "false") boolean xoaCaChuoiLap) {

        congViecService.xoaCongViec(maCongViec, xoaCaChuoiLap);
        String thongBao = xoaCaChuoiLap ? "Đã xóa toàn bộ chuỗi công việc lặp lại" : "Đã xóa công việc thành công";
        return ResponseEntity.ok(ApiResponse.ok(thongBao, null));
    }

    /**
     * API 5b: Xóa toàn bộ chuỗi công việc theo mã nhóm lặp lại
     * DELETE /api/v1/cong-viec/nhom/{maNhomLapLai}
     */
    @DeleteMapping("/nhom/{maNhomLapLai}")
    public ResponseEntity<ApiResponse<Void>> xoaTheoNhomLapLai(
            @PathVariable("maNhomLapLai") String maNhomLapLai) {
        congViecService.xoaTheoNhomLapLai(maNhomLapLai);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa toàn bộ chuỗi công việc lặp lại", null));
    }
}

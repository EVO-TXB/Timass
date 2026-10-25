package com.timass.controller;

import com.timass.dto.ApiResponse;
import com.timass.dto.DangKyDTO;
import com.timass.dto.DangNhapDTO;
import com.timass.dto.NguoiDungDTO;
import com.timass.model.NguoiDung;
import com.timass.repository.NguoiDungRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final NguoiDungRepository nguoiDungRepository;

    public AuthController(NguoiDungRepository nguoiDungRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> login(@Valid @RequestBody DangNhapDTO yeuCau) {
        String sdt = yeuCau.getSoDienThoai().trim();
        Optional<NguoiDung> nguoiDungOpt = nguoiDungRepository.findBySoDienThoai(sdt);

        NguoiDung nguoiDung;
        if (nguoiDungOpt.isPresent()) {
            nguoiDung = nguoiDungOpt.get();
        } else {
            // Tự động tạo người dùng mới khi đăng nhập lần đầu
            nguoiDung = new NguoiDung();
            nguoiDung.setSoDienThoai(sdt);
            nguoiDung.setMatKhauMaHoa(yeuCau.getMatKhau());
            if ("0912345678".equals(sdt) || "0988888888".equals(sdt)) {
                nguoiDung.setHoVaTen("Nguyễn Văn A");
            } else {
                nguoiDung.setHoVaTen("Người dùng " + sdt.substring(Math.max(0, sdt.length() - 4)));
            }
            nguoiDung = nguoiDungRepository.save(nguoiDung);
        }

        String token = "timass_jwt_" + UUID.randomUUID().toString();
        NguoiDungDTO dto = NguoiDungDTO.fromEntity(nguoiDung, token);

        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", dto));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> register(@Valid @RequestBody DangKyDTO yeuCau) {
        String sdt = yeuCau.getSoDienThoai().trim();
        Optional<NguoiDung> existing = nguoiDungRepository.findBySoDienThoai(sdt);
        if (existing.isPresent()) {
            String token = "timass_jwt_" + UUID.randomUUID().toString();
            return ResponseEntity.ok(ApiResponse.ok("Số điện thoại đã tồn tại, đã đăng nhập thành công", 
                    NguoiDungDTO.fromEntity(existing.get(), token)));
        }

        NguoiDung nguoiDungMoi = new NguoiDung();
        nguoiDungMoi.setSoDienThoai(sdt);
        nguoiDungMoi.setHoVaTen(yeuCau.getHoTen().trim());
        nguoiDungMoi.setMatKhauMaHoa(yeuCau.getMatKhau());
        NguoiDung daLuu = nguoiDungRepository.save(nguoiDungMoi);

        String token = "timass_jwt_" + UUID.randomUUID().toString();
        NguoiDungDTO dto = NguoiDungDTO.fromEntity(daLuu, token);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đăng ký tài khoản thành công", dto));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long maNguoiDung) {
        if (maNguoiDung == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Chưa đăng nhập"));
        }
        return nguoiDungRepository.findById(maNguoiDung)
                .map(u -> ResponseEntity.ok(ApiResponse.ok(NguoiDungDTO.fromEntity(u, null))))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Không tìm thấy người dùng")));
    }
}

package com.timass.service.impl;

import com.timass.dto.CapNhatTrangThaiDTO;
import com.timass.dto.CongViecResponseDTO;
import com.timass.dto.TaoCongViecDonLeDTO;
import com.timass.dto.YeuCauCongViecLapLaiDTO;
import com.timass.model.CongViec;
import com.timass.model.LoaiCongViec;
import com.timass.model.NguoiDung;
import com.timass.model.NguonTao;
import com.timass.model.TrangThaiCongViec;
import com.timass.repository.CongViecRepository;
import com.timass.repository.NguoiDungRepository;
import com.timass.repository.ThongBaoRepository;
import com.timass.service.CongViecService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CongViecServiceImpl implements CongViecService {

    private final CongViecRepository congViecRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ThongBaoRepository thongBaoRepository;

    public CongViecServiceImpl(CongViecRepository congViecRepository,
                               NguoiDungRepository nguoiDungRepository,
                               ThongBaoRepository thongBaoRepository) {
        this.congViecRepository = congViecRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.thongBaoRepository = thongBaoRepository;
    }

    @Override
    public CongViecResponseDTO taoCongViecDonLe(Long maNguoiDung, TaoCongViecDonLeDTO yeuCau) {
        // Validation nghiệp vụ: Giờ kết thúc phải sau giờ bắt đầu
        if (!yeuCau.getGioKetThuc().isAfter(yeuCau.getGioBatDau())) {
            throw new IllegalArgumentException("Giờ kết thúc (" + yeuCau.getGioKetThuc() + 
                    ") phải sau giờ bắt đầu (" + yeuCau.getGioBatDau() + ")");
        }

        NguoiDung nguoiDung = layNguoiDung(maNguoiDung);

        CongViec congViec = new CongViec();
        congViec.setNguoiDung(nguoiDung);
        congViec.setTieuDe(yeuCau.getTieuDe().trim());
        congViec.setNgayThucHien(yeuCau.getNgayThucHien());
        congViec.setGioBatDau(yeuCau.getGioBatDau());
        congViec.setGioKetThuc(yeuCau.getGioKetThuc());
        congViec.setLoaiCongViec(yeuCau.getLoaiCongViec());
        congViec.setTrangThai(TrangThaiCongViec.DANG_CHO);
        congViec.setNguonTao(NguonTao.THU_CONG);
        congViec.setCoLapLai(false);
        congViec.setMaNhomLapLai(null);
        congViec.setDiaDiem(yeuCau.getDiaDiem() != null ? yeuCau.getDiaDiem().trim() : null);

        CongViec daLuu = congViecRepository.save(congViec);
        return CongViecResponseDTO.fromEntity(daLuu);
    }

    @Override
    public List<CongViecResponseDTO> taoCongViecLapLai(Long maNguoiDung, YeuCauCongViecLapLaiDTO yeuCau) {
        // 1. Validation nghiệp vụ: Giờ kết thúc phải sau giờ bắt đầu
        if (!yeuCau.getGioKetThuc().isAfter(yeuCau.getGioBatDau())) {
            throw new IllegalArgumentException("Giờ kết thúc (" + yeuCau.getGioKetThuc() + 
                    ") phải sau giờ bắt đầu (" + yeuCau.getGioBatDau() + ")");
        }

        // 2. Validation ngày bắt đầu / kết thúc
        if (yeuCau.getNgayKetThuc().isBefore(yeuCau.getNgayBatDau())) {
            throw new IllegalArgumentException("Ngày kết thúc (" + yeuCau.getNgayKetThuc() + 
                    ") phải bằng hoặc sau ngày bắt đầu (" + yeuCau.getNgayBatDau() + ")");
        }

        if (yeuCau.getDanhSachThu() == null || yeuCau.getDanhSachThu().isEmpty()) {
            throw new IllegalArgumentException("Danh sách thứ lặp lại không được để trống");
        }

        NguoiDung nguoiDung = layNguoiDung(maNguoiDung);

        // 3. Tự động sinh mã nhóm lặp lại (UUID)
        String maNhomLapLai = UUID.randomUUID().toString();

        // 4. Duyệt khoảng ngày và lọc các ngày khớp với danh sách thứ
        List<CongViec> danhSachMoi = new ArrayList<>();
        LocalDate ngayHienTai = yeuCau.getNgayBatDau();

        while (!ngayHienTai.isAfter(yeuCau.getNgayKetThuc())) {
            if (isDayMatching(ngayHienTai.getDayOfWeek(), yeuCau.getDanhSachThu())) {
                CongViec cv = new CongViec();
                cv.setNguoiDung(nguoiDung);
                cv.setTieuDe(yeuCau.getTieuDe().trim());
                cv.setNgayThucHien(ngayHienTai);
                cv.setGioBatDau(yeuCau.getGioBatDau());
                cv.setGioKetThuc(yeuCau.getGioKetThuc());
                cv.setLoaiCongViec(yeuCau.getLoaiCongViec());
                cv.setTrangThai(TrangThaiCongViec.DANG_CHO);
                cv.setNguonTao(NguonTao.THU_CONG);
                cv.setCoLapLai(true);
                cv.setMaNhomLapLai(maNhomLapLai);
                cv.setDiaDiem(yeuCau.getDiaDiem() != null ? yeuCau.getDiaDiem().trim() : null);

                danhSachMoi.add(cv);
            }
            ngayHienTai = ngayHienTai.plusDays(1);
        }

        if (danhSachMoi.isEmpty()) {
            throw new IllegalArgumentException("Không có ngày nào từ " + yeuCau.getNgayBatDau() + 
                    " đến " + yeuCau.getNgayKetThuc() + " khớp với danh sách thứ đã chọn");
        }

        // 5. Lưu hàng loạt bằng saveAll()
        List<CongViec> danhSachDaLuu = congViecRepository.saveAll(danhSachMoi);

        return danhSachDaLuu.stream()
                .map(CongViecResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CongViecResponseDTO capNhatTrangThai(Long maCongViec, TrangThaiCongViec trangThai) {
        CongViec congViec = congViecRepository.findById(maCongViec)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy công việc với mã: " + maCongViec));

        congViec.setTrangThai(trangThai);
        CongViec daCapNhat = congViecRepository.save(congViec);
        return CongViecResponseDTO.fromEntity(daCapNhat);
    }

    @Override
    public CongViecResponseDTO capNhatTrangThai(Long maCongViec, CapNhatTrangThaiDTO yeuCau) {
        if (yeuCau == null || yeuCau.getTrangThai() == null) {
            throw new IllegalArgumentException("Trạng thái công việc không được để trống");
        }
        return capNhatTrangThai(maCongViec, yeuCau.getTrangThai());
    }

    @Override
    public CongViecResponseDTO capNhatCongViec(Long maCongViec, com.timass.dto.CapNhatCongViecDTO yeuCau) {
        CongViec congViec = congViecRepository.findById(maCongViec)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy công việc với mã: " + maCongViec));

        if (Boolean.TRUE.equals(yeuCau.getApDungChoTatCa()) && congViec.getMaNhomLapLai() != null) {
            // Cập nhật tất cả các sự kiện trong chuỗi
            List<CongViec> chuoiLap = congViecRepository.findByMaNhomLapLai(congViec.getMaNhomLapLai());
            for (CongViec item : chuoiLap) {
                if (yeuCau.getTieuDe() != null) item.setTieuDe(yeuCau.getTieuDe());
                if (yeuCau.getGioBatDau() != null) item.setGioBatDau(yeuCau.getGioBatDau());
                if (yeuCau.getGioKetThuc() != null) item.setGioKetThuc(yeuCau.getGioKetThuc());
                if (yeuCau.getLoaiCongViec() != null) item.setLoaiCongViec(yeuCau.getLoaiCongViec());
                if (yeuCau.getDiaDiem() != null) item.setDiaDiem(yeuCau.getDiaDiem());
                if (yeuCau.getTrangThai() != null) item.setTrangThai(yeuCau.getTrangThai());
            }
            congViecRepository.saveAll(chuoiLap);
            return CongViecResponseDTO.fromEntity(congViec);
        } else {
            // Cập nhật đơn lẻ cho công việc này
            if (yeuCau.getTieuDe() != null) congViec.setTieuDe(yeuCau.getTieuDe());
            if (yeuCau.getGioBatDau() != null) congViec.setGioBatDau(yeuCau.getGioBatDau());
            if (yeuCau.getGioKetThuc() != null) congViec.setGioKetThuc(yeuCau.getGioKetThuc());
            if (yeuCau.getLoaiCongViec() != null) congViec.setLoaiCongViec(yeuCau.getLoaiCongViec());
            if (yeuCau.getDiaDiem() != null) congViec.setDiaDiem(yeuCau.getDiaDiem());
            if (yeuCau.getNgayThucHien() != null) congViec.setNgayThucHien(yeuCau.getNgayThucHien());
            if (yeuCau.getTrangThai() != null) congViec.setTrangThai(yeuCau.getTrangThai());

            if (Boolean.FALSE.equals(yeuCau.getApDungChoTatCa()) && Boolean.TRUE.equals(congViec.getCoLapLai())) {
                congViec.setCoLapLai(false);
                congViec.setMaNhomLapLai(null);
            }

            CongViec daLuu = congViecRepository.save(congViec);
            return CongViecResponseDTO.fromEntity(daLuu);
        }
    }

    @Override
    public List<CongViecResponseDTO> layDanhSachTheoKhoangNgay(Long maNguoiDung, LocalDate tuNgay, LocalDate denNgay) {
        if (tuNgay == null) {
            tuNgay = LocalDate.now().with(DayOfWeek.MONDAY);
        }
        if (denNgay == null) {
            denNgay = tuNgay.plusDays(6);
        }
        if (denNgay.isBefore(tuNgay)) {
            throw new IllegalArgumentException("Ngày kết thúc (" + denNgay + ") phải bằng hoặc sau ngày bắt đầu (" + tuNgay + ")");
        }

        NguoiDung nguoiDung = layNguoiDung(maNguoiDung);
        List<CongViec> danhSach = congViecRepository.timTheoNguoiDungVaKhoangNgay(nguoiDung.getMaNguoiDung(), tuNgay, denNgay);

        return danhSach.stream()
                .map(CongViecResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<CongViecResponseDTO> layLichTheoNgay(Long maNguoiDung, LocalDate ngay) {
        if (ngay == null) {
            ngay = LocalDate.now();
        }
        NguoiDung nguoiDung = layNguoiDung(maNguoiDung);
        List<CongViec> danhSach = congViecRepository.timTheoNguoiDungVaNgay(nguoiDung.getMaNguoiDung(), ngay);

        return danhSach.stream()
                .map(CongViecResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void xoaCongViec(Long maCongViec, boolean xoaCaChuoiLap) {
        CongViec congViec = congViecRepository.findById(maCongViec).orElse(null);
        if (congViec == null) {
            return;
        }

        if (xoaCaChuoiLap && congViec.getMaNhomLapLai() != null && !congViec.getMaNhomLapLai().isBlank()) {
            xoaTheoNhomLapLai(congViec.getMaNhomLapLai());
        } else {
            thongBaoRepository.xoaTheoMaCongViec(congViec.getMaCongViec());
            congViecRepository.delete(congViec);
        }
    }

    @Override
    public void xoaTheoNhomLapLai(String maNhomLapLai) {
        if (maNhomLapLai == null || maNhomLapLai.isBlank()) {
            return;
        }
        thongBaoRepository.xoaTheoMaNhomLapLai(maNhomLapLai);
        congViecRepository.xoaTheoMaNhomLapLai(maNhomLapLai);
    }

    /**
     * Kiểm tra thứ trong tuần có khớp với danh sách thứ chỉ định.
     * Ánh xạ chuẩn theo văn hóa & giao diện lịch biểu tiếng Việt (đặc tả Timass: Thứ 2, Thứ 4, Thứ 6...):
     * - MONDAY (Thứ 2)    -> 2
     * - TUESDAY (Thứ 3)   -> 3
     * - WEDNESDAY (Thứ 4) -> 4
     * - THURSDAY (Thứ 5)  -> 5
     * - FRIDAY (Thứ 6)    -> 6
     * - SATURDAY (Thứ 7)  -> 7
     * - SUNDAY (Chủ nhật) -> 8 (hoặc 1)
     */
    private boolean isDayMatching(DayOfWeek dayOfWeek, List<Integer> danhSachThu) {
        if (danhSachThu == null || danhSachThu.isEmpty()) {
            return false;
        }
        switch (dayOfWeek) {
            case MONDAY:
                return danhSachThu.contains(2);
            case TUESDAY:
                return danhSachThu.contains(3);
            case WEDNESDAY:
                return danhSachThu.contains(4);
            case THURSDAY:
                return danhSachThu.contains(5);
            case FRIDAY:
                return danhSachThu.contains(6);
            case SATURDAY:
                return danhSachThu.contains(7);
            case SUNDAY:
                return danhSachThu.contains(8) || danhSachThu.contains(1);
            default:
                return false;
        }
    }

    /**
     * Lấy người dùng theo ID, nếu chưa có (database mới khởi tạo) thì tự động tạo người dùng mặc định.
     */
    private NguoiDung layNguoiDung(Long maNguoiDung) {
        if (maNguoiDung != null) {
            return nguoiDungRepository.findById(maNguoiDung)
                    .orElseGet(() -> {
                        NguoiDung newUser = new NguoiDung();
                        newUser.setSoDienThoai("09" + String.format("%08d", Math.abs(maNguoiDung) % 100000000));
                        newUser.setMatKhauMaHoa("123456");
                        newUser.setHoVaTen("Người dùng " + maNguoiDung);
                        return nguoiDungRepository.save(newUser);
                    });
        }
        return taoHoacLayNguoiDungMacDinh();
    }

    @Override
    public List<CongViecResponseDTO> luuTkbHangLoat(Long maNguoiDung, com.timass.dto.YeuCauLuuTkbHangLoatDTO yeuCau) {
        if (yeuCau == null) {
            throw new IllegalArgumentException("Dữ liệu lưu thời khóa biểu không được rỗng");
        }
        if (yeuCau.getNgayKetThuc().isBefore(yeuCau.getNgayBatDau())) {
            throw new IllegalArgumentException("Ngày kết thúc áp dụng (" + yeuCau.getNgayKetThuc() + 
                    ") phải bằng hoặc sau ngày bắt đầu (" + yeuCau.getNgayBatDau() + ")");
        }
        if (yeuCau.getDanhSachMonHoc() == null || yeuCau.getDanhSachMonHoc().isEmpty()) {
            throw new IllegalArgumentException("Danh sách môn học từ thời khóa biểu không được để trống");
        }

        NguoiDung nguoiDung = layNguoiDung(maNguoiDung);
        List<CongViec> danhSachCongViecMoi = new ArrayList<>();

        for (com.timass.dto.MonHocTkbDTO monHoc : yeuCau.getDanhSachMonHoc()) {
            if (monHoc.getTenMonHoc() == null || monHoc.getTenMonHoc().trim().isEmpty()) {
                continue;
            }

            DayOfWeek targetDay = parseThuTrongTuan(monHoc.getThuTrongTuan());
            LocalTime gioBatDau = parseLocalTime(monHoc.getGioBatDau());
            LocalTime gioKetThuc = parseLocalTime(monHoc.getGioKetThuc());

            if (!gioKetThuc.isAfter(gioBatDau)) {
                throw new IllegalArgumentException("Môn '" + monHoc.getTenMonHoc() + "': Giờ kết thúc (" + 
                        gioKetThuc + ") phải sau giờ bắt đầu (" + gioBatDau + ")");
            }

            // Gán chung một mã nhóm lặp lại cho mỗi môn học trong kỳ
            String maNhomMon = UUID.randomUUID().toString();

            LocalDate current = yeuCau.getNgayBatDau();
            while (!current.isAfter(yeuCau.getNgayKetThuc())) {
                if (current.getDayOfWeek() == targetDay) {
                    CongViec cv = new CongViec();
                    cv.setNguoiDung(nguoiDung);
                    cv.setTieuDe(monHoc.getTenMonHoc().trim());
                    cv.setNgayThucHien(current);
                    cv.setGioBatDau(gioBatDau);
                    cv.setGioKetThuc(gioKetThuc);
                    cv.setLoaiCongViec(LoaiCongViec.CHU_DONG);
                    cv.setTrangThai(TrangThaiCongViec.DANG_CHO);
                    cv.setNguonTao(NguonTao.QUET_AI); // Gán nguồn tạo là QUET_AI theo đúng nghiệp vụ
                    cv.setCoLapLai(true);
                    cv.setMaNhomLapLai(maNhomMon);
                    cv.setDiaDiem(monHoc.getPhongHoc() != null ? monHoc.getPhongHoc().trim() : null);

                    danhSachCongViecMoi.add(cv);
                }
                current = current.plusDays(1);
            }
        }

        if (danhSachCongViecMoi.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy ngày học nào khớp trong khoảng thời gian từ " + 
                    yeuCau.getNgayBatDau() + " đến " + yeuCau.getNgayKetThuc());
        }

        List<CongViec> savedList = congViecRepository.saveAll(danhSachCongViecMoi);

        return savedList.stream()
                .map(CongViecResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển đổi chuỗi thứ (tiếng Việt hoặc số) sang DayOfWeek của Java
     */
    private DayOfWeek parseThuTrongTuan(String thuStr) {
        if (thuStr == null || thuStr.isBlank()) {
            throw new IllegalArgumentException("Thứ trong tuần không được để trống");
        }
        String clean = thuStr.trim().toLowerCase();
        if (clean.contains("2") || clean.contains("hai") || clean.contains("mon")) {
            return DayOfWeek.MONDAY;
        } else if (clean.contains("3") || clean.contains("ba") || clean.contains("tue")) {
            return DayOfWeek.TUESDAY;
        } else if (clean.contains("4") || clean.contains("tư") || clean.contains("tu") || clean.contains("wed")) {
            return DayOfWeek.WEDNESDAY;
        } else if (clean.contains("5") || clean.contains("năm") || clean.contains("nam") || clean.contains("thu")) {
            return DayOfWeek.THURSDAY;
        } else if (clean.contains("6") || clean.contains("sáu") || clean.contains("sau") || clean.contains("fri")) {
            return DayOfWeek.FRIDAY;
        } else if (clean.contains("7") || clean.contains("bảy") || clean.contains("bay") || clean.contains("sat")) {
            return DayOfWeek.SATURDAY;
        } else if (clean.contains("8") || clean.contains("nhật") || clean.contains("nhat") || clean.contains("cn") || clean.contains("sun") || clean.equals("1")) {
            return DayOfWeek.SUNDAY;
        }
        throw new IllegalArgumentException("Không nhận diện được thứ trong tuần: '" + thuStr + "'");
    }

    /**
     * Chuyển đổi định dạng giờ chuỗi (HH:mm, H:mm, 7h30, 07:00:00) sang LocalTime
     */
    private LocalTime parseLocalTime(String timeStr) {
        if (timeStr == null || timeStr.isBlank()) {
            throw new IllegalArgumentException("Khung giờ không được để trống");
        }
        String clean = timeStr.trim().toLowerCase().replace("h", ":");
        if (clean.endsWith(":")) {
            clean += "00";
        }
        String[] parts = clean.split(":");
        int hour = Integer.parseInt(parts[0].trim());
        int minute = parts.length > 1 ? Integer.parseInt(parts[1].trim()) : 0;
        return LocalTime.of(hour, minute);
    }

    private NguoiDung taoHoacLayNguoiDungMacDinh() {
        return nguoiDungRepository.findAll().stream().findFirst().orElseGet(() -> {
            NguoiDung defaultUser = new NguoiDung();
            defaultUser.setSoDienThoai("0988888888");
            defaultUser.setMatKhauMaHoa("$2a$10$defaultDemoHashPassword123456");
            defaultUser.setHoVaTen("Người Dùng Mặc Định");
            return nguoiDungRepository.save(defaultUser);
        });
    }
}

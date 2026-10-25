package com.timass.service;

import com.timass.model.CongViec;
import com.timass.model.ThongBao;
import com.timass.model.TrangThaiCongViec;
import com.timass.repository.CongViecRepository;
import com.timass.repository.ThongBaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service quản lý các tác vụ nền tự động định kỳ (Timer / Scheduled Jobs):
 * 1. Quét và phát thông báo nhắc nhở trước 15 phút.
 * 2. Tự động tích hoàn thành các công việc thiết yếu / bị động khi qua khung giờ kết thúc.
 */
@Service
public class LichTrinhHeThongService {

    private static final Logger log = LoggerFactory.getLogger(LichTrinhHeThongService.class);

    private final CongViecRepository congViecRepo;
    private final ThongBaoRepository thongBaoRepo;

    public LichTrinhHeThongService(CongViecRepository congViecRepo, ThongBaoRepository thongBaoRepo) {
        this.congViecRepo = congViecRepo;
        this.thongBaoRepo = thongBaoRepo;
    }

    /**
     * Tác vụ 1: Quét và gửi thông báo nhắc việc trước 15 phút.
     * Chạy định kỳ mỗi phút một lần vào giây thứ 0.
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void quetVaGuiThongBao15Phut() {
        try {
            LocalDate homNay = LocalDate.now();
            // Lấy mốc thời gian mục tiêu: giờ hiện tại + 15 phút (làm tròn đến phút để khớp chính xác TIME trong DB)
            LocalTime gioMucTieu = LocalTime.now().truncatedTo(ChronoUnit.MINUTES).plusMinutes(15);

            log.debug("⏰ [TIMER-NOTIF] Đang quét sự kiện bắt đầu lúc {} ngày {}...", gioMucTieu, homNay);

            // Truy vấn tối ưu với JOIN FETCH và NOT EXISTS loại bỏ việc đã gửi trước đó
            List<CongViec> danhSachCanNhac = congViecRepo.timViecSapBatDauSau15PhutChuaBao(gioMucTieu, homNay);

            if (danhSachCanNhac.isEmpty()) {
                log.debug("⏰ [TIMER-NOTIF] Không có công việc nào cần nhắc trước 15 phút.");
                return;
            }

            log.info("🔔 [TIMER-NOTIF] Phát hiện {} công việc sắp diễn ra lúc {}. Bắt đầu gửi thông báo...", 
                    danhSachCanNhac.size(), gioMucTieu);

            for (CongViec cv : danhSachCanNhac) {
                try {
                    // Phòng ngừa gửi lặp nếu bản ghi thông báo đã tồn tại
                    if (thongBaoRepo.existsByCongViec_MaCongViecAndDaGuiTrue(cv.getMaCongViec())) {
                        continue;
                    }

                    // Ghi nhận lịch sử thông báo vào database
                    ThongBao thongBao = new ThongBao();
                    thongBao.setCongViec(cv);
                    thongBao.setNguoiDung(cv.getNguoiDung());
                    thongBao.setThoiGianNhac(LocalDateTime.now());
                    thongBao.setDaGui(true);
                    thongBao.setThoiGianGui(LocalDateTime.now());

                    thongBaoRepo.save(thongBao);

                    String tenNguoiDung = (cv.getNguoiDung() != null && cv.getNguoiDung().getHoVaTen() != null)
                            ? cv.getNguoiDung().getHoVaTen() : "N/A";
                    String sdt = (cv.getNguoiDung() != null) ? cv.getNguoiDung().getSoDienThoai() : "N/A";
                    Long maNd = (cv.getNguoiDung() != null) ? cv.getNguoiDung().getMaNguoiDung() : null;

                    log.info("🔔 [THÔNG BÁO 15 PHÚT] Gửi nhắc nhở thành công | Người dùng: '{}' (SĐT: {}, ID: {}) | " +
                                    "Công việc: '{}' (ID: {}) | Giờ bắt đầu: {}",
                            tenNguoiDung, sdt, maNd, cv.getTieuDe(), cv.getMaCongViec(), cv.getGioBatDau());

                } catch (Exception ex) {
                    log.error("❌ [TIMER-NOTIF] Lỗi khi xử lý thông báo cho công việc ID {}: {}", 
                            cv.getMaCongViec(), ex.getMessage(), ex);
                }
            }

        } catch (Exception e) {
            log.error("💥 [TIMER-NOTIF] Lỗi không mong muốn trong tiến trình quét thông báo 15 phút: {}", 
                    e.getMessage(), e);
        }
    }

    /**
     * Tác vụ 2: Tự động tích hoàn thành công việc thiết yếu / bị động khi qua khung giờ.
     * Chạy định kỳ mỗi phút một lần vào giây thứ 0.
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void tuDongTichViecThietYeu() {
        try {
            LocalDate homNay = LocalDate.now();
            LocalTime gioHienTai = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);

            log.debug("⏰ [TIMER-AUTO-CHECK] Đang quét công việc thiết yếu quá hạn trước {} ngày {}...", 
                    gioHienTai, homNay);

            // Tìm các việc thiết yếu / bị động đang chờ có giờ kết thúc <= giờ hiện tại
            List<CongViec> danhSachQuaHan = congViecRepo.timViecThietYeuChuaXongTruocGio(gioHienTai, homNay);

            if (danhSachQuaHan.isEmpty()) {
                log.debug("⏰ [TIMER-AUTO-CHECK] Không có công việc thiết yếu nào quá hạn cần hoàn thành.");
                return;
            }

            log.info("⏳ [TIMER-AUTO-CHECK] Tìm thấy {} việc thiết yếu quá hạn kết thúc. Đang tự động tích hoàn thành...", 
                    danhSachQuaHan.size());

            for (CongViec cv : danhSachQuaHan) {
                try {
                    cv.setTrangThai(TrangThaiCongViec.HOAN_THANH);
                    congViecRepo.save(cv);

                    String tenNguoiDung = (cv.getNguoiDung() != null && cv.getNguoiDung().getHoVaTen() != null)
                            ? cv.getNguoiDung().getHoVaTen() : "N/A";
                    Long maNd = (cv.getNguoiDung() != null) ? cv.getNguoiDung().getMaNguoiDung() : null;

                    log.info("✅ [TỰ ĐỘNG TÍCH HOÀN THÀNH] Công việc thiết yếu '{}' (ID: {}) của người dùng '{}' (ID: {}) " +
                                    "| Khung giờ [{} - {}] đã tự động cập nhật -> HOAN_THANH",
                            cv.getTieuDe(), cv.getMaCongViec(), tenNguoiDung, maNd, cv.getGioBatDau(), cv.getGioKetThuc());

                } catch (Exception ex) {
                    log.error("❌ [TIMER-AUTO-CHECK] Lỗi khi tự động cập nhật công việc ID {}: {}", 
                            cv.getMaCongViec(), ex.getMessage(), ex);
                }
            }

        } catch (Exception e) {
            log.error("💥 [TIMER-AUTO-CHECK] Lỗi không mong muốn trong tiến trình tự động tích việc thiết yếu: {}", 
                    e.getMessage(), e);
        }
    }
}

-- =============================================================================
-- Timass Seed Data (Dữ liệu mẫu cho hệ thống quản lý lịch trình Timass)
-- =============================================================================

USE `timass_db`;

-- 1. Tạo người dùng mặc định
INSERT INTO `nguoi_dung` (`ma_nguoi_dung`, `so_dien_thoai`, `mat_khau_ma_hoa`, `ho_va_ten`)
VALUES (1, '0987654321', 'matkhau123', 'Nguyễn Văn A')
ON DUPLICATE KEY UPDATE `ho_va_ten` = 'Nguyễn Văn A';

-- 2. Dữ liệu công việc mẫu Tuần 42 (12/10/2026 - 18/10/2026)
INSERT INTO `cong_viec` (`ma_cong_viec`, `ma_nguoi_dung`, `tieu_de`, `ngay_thuc_hien`, `gio_bat_dau`, `gio_ket_thuc`, `loai_cong_viec`, `trang_thai`, `nguon_tao`, `co_lap_lai`, `ma_nhom_lap_lai`, `dia_diem`)
VALUES
(101, 1, 'Học Lập trình Web', '2026-10-12', '08:00:00', '11:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_web_dev', 'A3-402'),
(102, 1, 'Họp nhóm đồ án Web', '2026-10-13', '09:30:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Google Meet'),
(103, 1, 'Thực hành CSDL nâng cao', '2026-10-13', '14:00:00', '16:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Lab 2 - B2'),
(104, 1, 'Lập trình Web nâng cao', '2026-10-14', '07:30:00', '09:45:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402'),
(105, 1, 'Họp nhóm FootyBook', '2026-10-14', '10:00:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Google Meet'),
(106, 1, 'Nghỉ trưa & Ăn cơm', '2026-10-14', '11:30:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Căn tin trường'),
(107, 1, 'Tự học TOEIC Listening', '2026-10-14', '15:00:00', '17:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Thư viện tầng 3'),
(108, 1, 'Nấu bữa tối', '2026-10-14', '18:00:00', '19:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Nhà bếp'),
(109, 1, 'Tập Gym', '2026-10-14', '19:30:00', '21:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Fitness Center'),
(110, 1, 'Đọc sách chuyên ngành', '2026-10-14', '21:30:00', '22:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Phòng ngủ'),
(111, 1, 'Kiến trúc phần mềm', '2026-10-15', '08:30:00', '11:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'B1-201'),
(112, 1, 'Nghỉ trưa & Ăn cơm', '2026-10-15', '12:00:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Căn tin trường'),
(113, 1, 'Học TOEIC', '2026-10-15', '18:00:00', '20:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Trung tâm ngoại ngữ'),
(114, 1, 'Chạy bộ thể dục', '2026-10-16', '16:30:00', '17:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Công viên Thống Nhất'),
(115, 1, 'Gặp gỡ bạn bè cuối tuần', '2026-10-17', '19:00:00', '21:30:00', 'THIET_YEU_BI_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'The Coffee House'),
(116, 1, 'Ôn tập tuần & Thư giãn', '2026-10-18', '15:00:00', '17:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Góc học tập')
ON DUPLICATE KEY UPDATE `tieu_de` = VALUES(`tieu_de`);

-- 3. Dữ liệu công việc mẫu Tuần 43 (19/10/2026 - 25/10/2026)
INSERT INTO `cong_viec` (`ma_cong_viec`, `ma_nguoi_dung`, `tieu_de`, `ngay_thuc_hien`, `gio_bat_dau`, `gio_ket_thuc`, `loai_cong_viec`, `trang_thai`, `nguon_tao`, `co_lap_lai`, `ma_nhom_lap_lai`, `dia_diem`)
VALUES
(201, 1, 'Học Lập trình Web', '2026-10-19', '08:00:00', '11:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402'),
(202, 1, 'Thực hành CSDL nâng cao', '2026-10-20', '08:00:00', '10:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Lab 2 - B2'),
(203, 1, 'Ăn trưa & Nghỉ ngơi', '2026-10-20', '11:30:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Căn tin trường'),
(204, 1, 'Kiến trúc phần mềm', '2026-10-22', '08:30:00', '11:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'B1-201'),
(205, 1, 'Học TOEIC', '2026-10-22', '18:00:00', '20:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Trung tâm ngoại ngữ'),
(206, 1, 'Lập trình Web nâng cao', '2026-10-23', '07:30:00', '09:45:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402'),
(207, 1, 'Workshop AI & Tech Trends', '2026-10-23', '09:00:00', '11:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Hội trường C'),
(208, 1, 'Dọn dẹp phòng & Giặt đồ', '2026-10-23', '08:00:00', '09:30:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Tại nhà'),
(209, 1, 'Ăn trưa & Nghỉ ngơi', '2026-10-23', '12:00:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Căn tin trường'),
(210, 1, 'Chạy bộ thể dục', '2026-10-23', '16:30:00', '17:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Công viên Thống Nhất'),
(211, 1, 'Nấu bữa tối', '2026-10-23', '18:00:00', '19:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Nhà bếp'),
(212, 1, 'Tập Gym', '2026-10-23', '19:30:00', '21:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Fitness Center'),
(213, 1, 'Ôn tập tuần & Thư giãn', '2026-10-23', '21:00:00', '22:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Góc học tập')
ON DUPLICATE KEY UPDATE `tieu_de` = VALUES(`tieu_de`);

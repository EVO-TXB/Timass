USE `timass_db`;

INSERT INTO `cong_viec` 
(`ma_cong_viec`, `ma_nguoi_dung`, `tieu_de`, `ngay_thuc_hien`, `gio_bat_dau`, `gio_ket_thuc`, `loai_cong_viec`, `trang_thai`, `nguon_tao`, `co_lap_lai`, `ma_nhom_lap_lai`, `dia_diem`, `thoi_gian_tao`)
VALUES
-- Tuần 42 (12/10 - 18/10/2026)
(101, 1, 'Học Lập trình Web', '2026-10-12', '08:00:00', '11:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_web_dev', 'A3-402', NOW()),
(102, 1, 'Họp nhóm đồ án Web', '2026-10-13', '09:30:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Google Meet', NOW()),
(103, 1, 'Thực hành CSDL nâng cao', '2026-10-13', '14:00:00', '16:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Lab 2 - B2', NOW()),
(1,   1, 'Học Lập trình Web', '2026-10-14', '07:30:00', '09:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402', NOW()),
(2,   1, 'Họp nhóm FootyBook', '2026-10-14', '10:00:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Online Google Meet', NOW()),
(3,   1, 'Nghỉ trưa & Ăn cơm', '2026-10-14', '11:30:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_lunch', 'Căn tin trường', NOW()),
(4,   1, 'Tự học TOEIC Listening', '2026-10-14', '15:00:00', '17:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_toeic', 'Thư viện tầng 3', NOW()),
(5,   1, 'Tập Gym', '2026-10-14', '19:30:00', '21:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_gym', 'Fitness Center', NOW()),
(6,   1, 'Đọc sách Clean Code', '2026-10-14', '06:15:00', '07:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Phòng học', NOW()),
(7,   1, 'Nấu bữa tối', '2026-10-14', '18:00:00', '19:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Nhà bếp', NOW()),
(8,   1, 'Lên kế hoạch tuần mới', '2026-10-14', '21:30:00', '22:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Bàn làm việc', NOW()),
(104, 1, 'Nghỉ trưa & Ăn cơm', '2026-10-15', '12:00:00', '13:30:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_lunch', 'Căn tin trường', NOW()),
(105, 1, 'Học TOEIC', '2026-10-15', '18:00:00', '20:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_toeic', 'Trung tâm ngoại ngữ', NOW()),
(106, 1, 'Kiến trúc phần mềm', '2026-10-16', '08:30:00', '11:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'B1-201', NOW()),
(107, 1, 'Chạy bộ thể dục', '2026-10-16', '16:30:00', '17:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Công viên Thống Nhất', NOW()),
(108, 1, 'Workshop AI & Tech Trends', '2026-10-17', '09:00:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Hội trường C', NOW()),
(109, 1, 'Gặp gỡ bạn bè cuối tuần', '2026-10-17', '19:00:00', '21:30:00', 'THIET_YEU_BI_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'The Coffee House', NOW()),
(110, 1, 'Dọn dẹp phòng & Giặt đồ', '2026-10-18', '08:00:00', '09:30:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_cleaning', 'Tại nhà', NOW()),
(111, 1, 'Ôn tập tuần & Thư giãn', '2026-10-18', '15:00:00', '17:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Góc học tập', NOW()),

-- Tuần 43 (19/10 - 25/10/2026) - Tuần hiện tại
(201, 1, 'Học Lập trình Web', '2026-10-19', '08:00:00', '11:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402', NOW()),
(202, 1, 'Họp nhóm đồ án Web', '2026-10-20', '09:30:00', '11:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Google Meet', NOW()),
(203, 1, 'Học Lập trình Web', '2026-10-21', '07:30:00', '09:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_web_dev', 'A3-402', NOW()),
(204, 1, 'Tập Gym', '2026-10-21', '19:30:00', '21:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_gym', 'Fitness Center', NOW()),
(205, 1, 'Kiến trúc phần mềm', '2026-10-22', '08:30:00', '11:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'B1-201', NOW()),
(206, 1, 'Học TOEIC', '2026-10-22', '18:00:00', '20:00:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_toeic', 'Trung tâm ngoại ngữ', NOW()),
-- Thứ 6 hôm nay (23/10/2026)
(207, 1, 'Thực hành CSDL nâng cao', '2026-10-23', '08:00:00', '10:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Lab 2 - B2', NOW()),
(208, 1, 'Ăn trưa & Nghỉ ngơi', '2026-10-23', '11:30:00', '13:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 1, 'rec_lunch', 'Căn tin trường', NOW()),
(209, 1, 'Chạy bộ thể dục', '2026-10-23', '16:30:00', '17:30:00', 'CHU_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Công viên Thống Nhất', NOW()),
(210, 1, 'Nấu bữa tối', '2026-10-23', '18:00:00', '19:00:00', 'THIET_YEU_BI_DONG', 'HOAN_THANH', 'THU_CONG', 0, NULL, 'Nhà bếp', NOW()),
(211, 1, 'Nghỉ ngơi & Uống trà', '2026-10-23', '19:30:00', '20:00:00', 'THIET_YEU_BI_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Phòng khách', NOW()),
(212, 1, 'Ôn tập tuần & Thư giãn', '2026-10-23', '21:00:00', '22:00:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Góc học tập', NOW()),
-- Cuối tuần
(213, 1, 'Workshop AI & Tech Trends', '2026-10-24', '09:00:00', '11:30:00', 'CHU_DONG', 'DANG_CHO', 'THU_CONG', 0, NULL, 'Hội trường C', NOW()),
(214, 1, 'Dọn dẹp phòng & Giặt đồ', '2026-10-25', '08:00:00', '09:30:00', 'THIET_YEU_BI_DONG', 'DANG_CHO', 'THU_CONG', 1, 'rec_cleaning', 'Tại nhà', NOW())
ON DUPLICATE KEY UPDATE 
`tieu_de` = VALUES(`tieu_de`),
`ngay_thuc_hien` = VALUES(`ngay_thuc_hien`),
`gio_bat_dau` = VALUES(`gio_bat_dau`),
`gio_ket_thuc` = VALUES(`gio_ket_thuc`),
`loai_cong_viec` = VALUES(`loai_cong_viec`),
`trang_thai` = VALUES(`trang_thai`),
`co_lap_lai` = VALUES(`co_lap_lai`),
`ma_nhom_lap_lai` = VALUES(`ma_nhom_lap_lai`),
`dia_diem` = VALUES(`dia_diem`);

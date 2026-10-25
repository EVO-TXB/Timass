-- =============================================================================
-- Timass Database Schema (MySQL)
-- Dựa trên đặc tả ERD: nguoi_dung, cong_viec, thong_bao
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `timass_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `timass_db`;

-- 1. Bảng nguoi_dung (Người dùng)
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
    `ma_nguoi_dung` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `so_dien_thoai` VARCHAR(20) NOT NULL UNIQUE,
    `mat_khau_ma_hoa` VARCHAR(255) NOT NULL,
    `ho_va_ten` VARCHAR(100) DEFAULT NULL,
    `thoi_gian_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng cong_viec (Công việc / Lịch trình)
CREATE TABLE IF NOT EXISTS `cong_viec` (
    `ma_cong_viec` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ma_nguoi_dung` BIGINT NOT NULL,
    `tieu_de` VARCHAR(255) NOT NULL,
    `ngay_thuc_hien` DATE NOT NULL,
    `gio_bat_dau` TIME NOT NULL,
    `gio_ket_thuc` TIME NOT NULL,
    `loai_cong_viec` ENUM('CHU_DONG', 'THIET_YEU_BI_DONG') NOT NULL,
    `trang_thai` ENUM('DANG_CHO', 'HOAN_THANH') NOT NULL DEFAULT 'DANG_CHO',
    `nguon_tao` ENUM('THU_CONG', 'QUET_AI') NOT NULL DEFAULT 'THU_CONG',
    `co_lap_lai` BOOLEAN DEFAULT FALSE,
    `ma_nhom_lap_lai` VARCHAR(64) DEFAULT NULL,
    `dia_diem` VARCHAR(255) DEFAULT NULL,
    `thoi_gian_tao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cong_viec_nguoi_dung` FOREIGN KEY (`ma_nguoi_dung`)
        REFERENCES `nguoi_dung` (`ma_nguoi_dung`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng thong_bao (Thông báo nhắc việc)
CREATE TABLE IF NOT EXISTS `thong_bao` (
    `ma_thong_bao` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ma_cong_viec` BIGINT NOT NULL,
    `ma_nguoi_dung` BIGINT NOT NULL,
    `thoi_gian_nhac` TIMESTAMP NOT NULL,
    `da_gui` BOOLEAN NOT NULL DEFAULT FALSE,
    `thoi_gian_gui` TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT `fk_thong_bao_cong_viec` FOREIGN KEY (`ma_cong_viec`)
        REFERENCES `cong_viec` (`ma_cong_viec`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `fk_thong_bao_nguoi_dung` FOREIGN KEY (`ma_nguoi_dung`)
        REFERENCES `nguoi_dung` (`ma_nguoi_dung`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chỉ mục hỗ trợ tối ưu hiệu năng truy vấn
CREATE INDEX `idx_cong_viec_nguoi_dung_ngay` ON `cong_viec` (`ma_nguoi_dung`, `ngay_thuc_hien`);
CREATE INDEX `idx_cong_viec_nhom_lap_lai` ON `cong_viec` (`ma_nhom_lap_lai`);
CREATE INDEX `idx_thong_bao_thoi_gian_nhac_da_gui` ON `thong_bao` (`thoi_gian_nhac`, `da_gui`);

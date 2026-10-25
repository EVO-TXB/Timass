@startuml
skinparam linetype ortho
skinparam shadowing false

entity "nguoi_dung" as nguoi_dung {
  * ma_nguoi_dung : BIGINT AUTO_INCREMENT <<PK>>
  --
  * so_dien_thoai : VARCHAR(20) <<UNIQUE>>
  * mat_khau_ma_hoa : VARCHAR(255)
  ho_va_ten : VARCHAR(100)
  thoi_gian_tao : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

entity "cong_viec" as cong_viec {
  * ma_cong_viec : BIGINT AUTO_INCREMENT <<PK>>
  --
  * ma_nguoi_dung : BIGINT <<FK>>
  * tieu_de : VARCHAR(255)
  * ngay_thuc_hien : DATE
  * gio_bat_dau : TIME
  * gio_ket_thuc : TIME
  * loai_cong_viec : ENUM('CHU_DONG', 'THIET_YEU_BI_DONG')
  * trang_thai : ENUM('DANG_CHO', 'HOAN_THANH') DEFAULT 'DANG_CHO'
  * nguon_tao : ENUM('THU_CONG', 'QUET_AI') DEFAULT 'THU_CONG'
  co_lap_lai : BOOLEAN DEFAULT FALSE
  ma_nhom_lap_lai : VARCHAR(64)
  dia_diem : VARCHAR(255)
  thoi_gian_tao : TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

entity "thong_bao" as thong_bao {
  * ma_thong_bao : BIGINT AUTO_INCREMENT <<PK>>
  --
  * ma_cong_viec : BIGINT <<FK>>
  * ma_nguoi_dung : BIGINT <<FK>>
  * thoi_gian_nhac : TIMESTAMP
  * da_gui : BOOLEAN DEFAULT FALSE
  thoi_gian_gui : TIMESTAMP
}

nguoi_dung ||--o{ cong_viec : "sở hữu (ma_nguoi_dung)"
cong_viec ||--o{ thong_bao : "kích hoạt (ma_cong_viec)"
nguoi_dung ||--o{ thong_bao : "nhận (ma_nguoi_dung)"

@enduml


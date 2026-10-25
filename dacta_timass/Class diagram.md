@startuml
skinparam classAttributeIconSize 0
skinparam shadowing false

package "com.timass.dinh_nghia" {
  enum LoaiCongViec {
    CHU_DONG
    THIET_YEU_BI_DONG
  }
  enum TrangThaiCongViec {
    DANG_CHO
    HOAN_THANH
  }
  enum NguonTao {
    THU_CONG
    QUET_AI
  }
}

package "com.timass.thuc_the" {
  class NguoiDung {
    - maNguoiDung: Long
    - soDienThoai: String
    - matKhauMaHoa: String
    - hoVaTen: String
    - thoiGianTao: LocalDateTime
  }

  class CongViec {
    - maCongViec: Long
    - maNguoiDung: Long
    - tieuDe: String
    - ngayThucHien: LocalDate
    - gioBatDau: LocalTime
    - gioKetThuc: LocalTime
    - loaiCongViec: LoaiCongViec
    - trangThai: TrangThaiCongViec
    - nguonTao: NguonTao
    - coLapLai: Boolean
    - maNhomLapLai: String
    - diaDiem: String
    - thoiGianTao: LocalDateTime
  }

  class ThongBao {
    - maThongBao: Long
    - maCongViec: Long
    - maNguoiDung: Long
    - thoiGianNhac: LocalDateTime
    - daGui: Boolean
    - thoiGianGui: LocalDateTime
  }
}

package "com.timass.du_lieu_truyen" {
  class MonHocTkbDTO {
    + tenMonHoc: String
    + thuTrongTuan: String
    + gioBatDau: String
    + gioKetThuc: String
    + phongHoc: String
  }

  class YeuCauCongViecLapLaiDTO {
    + tieuDe: String
    + gioBatDau: LocalTime
    + gioKetThuc: LocalTime
    + danhSachThu: List<Integer>
    + ngayBatDau: LocalDate
    + ngayKetThuc: LocalDate
    + loaiCongViec: LoaiCongViec
    + diaDiem: String
  }

  class YeuCauLuuTkbHangLoatDTO {
    + ngayBatDau: LocalDate
    + ngayKetThuc: LocalDate
    + danhSachMonHoc: List<MonHocTkbDTO>
  }
}

package "com.timass.kho_du_lieu" {
  interface NguoiDungRepository {
    + timTheoSoDienThoai(soDienThoai: String): Optional<NguoiDung>
    + tonTaiSoDienThoai(soDienThoai: String): Boolean
  }

  interface CongViecRepository {
    + timTheoNguoiDungVaNgay(maNguoiDung: Long, ngay: LocalDate): List<CongViec>
    + timTheoNguoiDungVaKhoangNgay(maNguoiDung: Long, batDau: LocalDate, ketThuc: LocalDate): List<CongViec>
    + timViecThietYeuChuaXongTruocGio(gioHienTai: LocalTime, ngay: LocalDate): List<CongViec>
    + timViecSapBatDauSau15Phut(gioMucTieu: LocalTime, ngay: LocalDate): List<CongViec>
    + xoaTheoMaNhomLapLai(maNhom: String): void
  }

  interface ThongBaoRepository {
    + luuThongBao(thongBao: ThongBao): ThongBao
  }
}

package "com.timass.dich_vu" {
  interface CongViecService {
    + layLichTheoNgay(maNguoiDung: Long, ngay: LocalDate): List<CongViec>
    + taoCongViecLapLai(maNguoiDung: Long, yeuCau: YeuCauCongViecLapLaiDTO): List<CongViec>
    + luuTkbHangLoat(maNguoiDung: Long, yeuCau: YeuCauLuuTkbHangLoatDTO): List<CongViec>
    + capNhatTrangThai(maCongViec: Long, trangThai: TrangThaiCongViec): CongViec
  }

  interface QuetAiService {
    + trichXuatTkbTuAnh(tepAnh: MultipartFile): List<MonHocTkbDTO>
  }

  class LichTrinhHeThongService {
    - congViecRepo: CongViecRepository
    - thongBaoRepo: ThongBaoRepository
    + tuDongTichViecThietYeu(): void
    + quetVaGuiThongBao15Phut(): void
  }
}

package "com.timass.dieu_khien" {
  class CongViecController {
    - congViecService: CongViecService
    + layLichTrinh(ngay: LocalDate): ResponseEntity<?>
    + taoCongViecLapLai(yeuCau: YeuCauCongViecLapLaiDTO): ResponseEntity<?>
    + luuTkbHangLoat(yeuCau: YeuCauLuuTkbHangLoatDTO): ResponseEntity<?>
    + capNhatTrangThai(maCongViec: Long, trangThai: TrangThaiCongViec): ResponseEntity<?>
  }

  class QuetAiController {
    - quetAiService: QuetAiService
    + quetAnhTkb(tepAnh: MultipartFile): ResponseEntity<List<MonHocTkbDTO>>
  }
}

CongViec --> LoaiCongViec
CongViec --> TrangThaiCongViec
CongViec --> NguonTao
CongViecController --> CongViecService
QuetAiController --> QuetAiService
CongViecService --> CongViecRepository
LichTrinhHeThongService --> CongViecRepository
LichTrinhHeThongService --> ThongBaoRepository
@enduml


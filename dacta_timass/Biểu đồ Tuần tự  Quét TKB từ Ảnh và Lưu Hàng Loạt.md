@startuml
autonumber
skinparam shadowing false
skinparam sequenceMessageAlign center

actor "Người dùng" as NguoiDung
boundary "Giao diện Web\n(React)" as WebUI
control "QuetAiController" as AiCtrl
entity "QuetAiService" as AiSvc
control "Gemini Vision API" as Gemini
control "CongViecController" as CongViecCtrl
entity "CongViecService" as CongViecSvc
database "Cơ sở dữ liệu\n(MySQL)" as DB

NguoiDung -> WebUI: Tải lên tệp ảnh thời khóa biểu (tệpẢnh)
activate WebUI

alt [[False] Định dạng không hợp lệ hoặc dung lượng > 5MB]
  WebUI --> NguoiDung: Hiển thị cảnh báo: Tệp không hợp lệ
else [[True] Tệp ảnh hợp lệ]
  WebUI -> AiCtrl: quétẢnhThờiKhóaBiểu(tệpẢnh)
  activate AiCtrl

  AiCtrl -> AiSvc: tríchXuấtThờiKhóaBiểu(tệpẢnh)
  activate AiSvc

  AiSvc -> Gemini: gửiYêuCầuPhânTích(tệpẢnh, câuLệnhMẫuJson)
  activate Gemini
  Gemini --> AiSvc: Trả về kết quả JSON (danhSáchMônHọc)
  deactivate Gemini

  alt [[False] JSON rỗng hoặc không nhận diện được TKB]
    AiSvc --> AiCtrl: Báo lỗi: Không tìm thấy dữ liệu thời khóa biểu
    AiCtrl --> WebUI: Trả về lỗi 400 Bad Request
    WebUI --> NguoiDung: Hiển thị thông báo: "Không nhận diện được TKB trong ảnh"
  else [[True] Nhận diện thành công]
    AiSvc -> AiSvc: chuyểnĐổiJsonSangDanhSách(danhSáchMônHọc)
    AiSvc --> AiCtrl: Trả về danh sách môn học (danhSáchMônHọcDTO)
    deactivate AiSvc

    AiCtrl --> WebUI: 200 OK (danhSáchMônHọcDTO)
    deactivate AiCtrl

    WebUI -> NguoiDung: Hiển thị giao diện "Xem trước & Xác nhận lịch"
    deactivate WebUI

    alt [[Hành động] Người dùng bấm HỦY BỎ]
      NguoiDung -> WebUI: Bấm nút "Hủy bỏ"
      activate WebUI
      WebUI --> NguoiDung: Đóng cửa sổ và hủy dữ liệu tạm thời
      deactivate WebUI
    else [[Hành động] Người dùng XÁC NHẬN LƯU]
      NguoiDung -> WebUI: Hiệu chỉnh thông tin & bấm "Lưu vào lịch"
      activate WebUI

      WebUI -> CongViecCtrl: lưuThờiKhóaBiểuHàngLoạt(dữLiệuLưuTkbDTO)
      activate CongViecCtrl

      CongViecCtrl -> CongViecSvc: lưuDanhSáchCôngViệc(mãNgườiDùng, dữLiệuLưuTkbDTO)
      activate CongViecSvc

      loop [Cho từng môn học trong danh sách áp dụng theo tuần]
        CongViecSvc -> CongViecSvc: tínhToánNgàyCụThể(thứTrongTuần, khoảngTuần)
      end

      CongViecSvc -> DB: lưuTấtCả(danhSáchCôngViệcMới)
      activate DB
      DB --> CongViecSvc: Trả về kết quả: Lưu thành công
      deactivate DB

      CongViecSvc --> CongViecCtrl: Trả về danh sách công việc đã tạo
      deactivate CongViecSvc

      CongViecCtrl --> WebUI: 201 Created
      deactivate CongViecCtrl

      WebUI --> NguoiDung: Cập nhật lịch trình lên lưới tuần & thông báo thành công
      deactivate WebUI
    end
  end
end
@enduml


@startuml
autonumber
skinparam shadowing false
skinparam sequenceMessageAlign center

actor "Hệ thống (Timer)" as Timer
control "NotificationController" as NotifCtrl
entity "NotificationService" as NotifSvc
boundary "PushNotificationService" as PushSvc
database "Cơ sở dữ liệu\n(Database)" as DB
boundary "Giao diện Web\n(React)" as WebUI
actor "Người dùng" as NguoiDung

== Giai đoạn 1: Quét và Gửi thông báo nhắc việc trước 15 phút ==

Timer -> NotifCtrl: kíchHoạtTiếnTrìnhĐịnhKỳ(thờiGianHiệnTại)
activate NotifCtrl

NotifCtrl -> NotifSvc: xửLýThôngBáoVàTựĐộngTíchViệc(thờiGianHiệnTại, ngàyHômNay)
activate NotifSvc

NotifSvc -> DB: tìmSựKiệnSắpBắtĐầu(thờiGianHiệnTại, mốc15Phút, ngàyHômNay)[cite: 2]
activate DB
DB --> NotifSvc: Trả về danh sách sự kiện đến hạn (danhSáchSựKiện)[cite: 2]
deactivate DB

alt [[False] Danh sách rỗng (Không có sự kiện sắp diễn ra)][cite: 2]
  NotifSvc -> NotifSvc: ghiNhậnKhôngCóSựKiệnĐếnHạn()
else [[True] Có sự kiện đến hạn][cite: 2]
  loop [Cho từng sự kiện trong danh sách][cite: 2]
    NotifSvc -> DB: kiểmTraCàiĐặtThôngBáo(mãNgườiDùng)[cite: 2]
    activate DB
    DB --> NotifSvc: Trả về trạng thái thông báo (Bật/Tắt)[cite: 2]
    deactivate DB

    alt [[True] Trạng thái thông báo đang BẬT][cite: 2]
      NotifSvc -> PushSvc: gửiThôngBáo(mãNgườiDùng, nộiDungThôngBáo)[cite: 2]
      activate PushSvc
      PushSvc -> NguoiDung: Hiển thị Web Push Notification trên màn hình[cite: 2]
      deactivate PushSvc

      NotifSvc -> DB: cậpNhậtTrạngTháiĐãThôngBáo(mãCôngViệc)[cite: 2]
      activate DB
      DB --> NotifSvc: Trả về kết quả: Cập nhật thành công[cite: 2]
      deactivate DB
    else [[False] Trạng thái thông báo đang TẮT][cite: 2]
      NotifSvc -> NotifSvc: bỏQuaThôngBáo()[cite: 2]
    end
  end
end

== Giai đoạn 2: Tự động tích hoàn thành công việc bị động/thiết yếu ==

NotifSvc -> DB: tìmViệcBịĐộngQuáHạnChưaXong(thờiGianHiệnTại, ngàyHômNay)
activate DB
DB --> NotifSvc: Trả về danh sách việc bị động quá hạn (danhSáchViệcBịĐộng)
deactivate DB

alt [[False] Danh sách rỗng (Không có việc bị động quá hạn)]
  NotifSvc -> NotifSvc: kếtThúcKiểmTraViệcBịĐộng()
else [[True] Có việc bị động cần hoàn thành tự động]
  loop [Cho từng công việc trong danh sách việc bị động]
    NotifSvc -> NotifSvc: đặtTrạngThái('HOÀN_THÀNH')
    NotifSvc -> DB: cậpNhậtTrạngTháiCôngViệc(mãCôngViệc, 'HOÀN_THÀNH')
    activate DB
    DB --> NotifSvc: Trả về kết quả: Cập nhật thành công
    deactivate DB
  end

  NotifSvc -> WebUI: đồngBộTrạngTháiHoànThành(mãNgườiDùng, danhSáchViệcĐãĐổi)
  activate WebUI
  WebUI -> NguoiDung: Tự động hiển thị tích xanh hoàn thành trên lịch
  deactivate WebUI
end

NotifSvc --> NotifCtrl: Hoàn thành toàn bộ tiến trình quét định kỳ[cite: 2]
deactivate NotifSvc

NotifCtrl --> Timer: Kết thúc lượt quét[cite: 2]
deactivate NotifCtrl

@enduml


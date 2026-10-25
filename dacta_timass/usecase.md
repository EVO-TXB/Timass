@startuml
left to right direction
skinparam packageStyle rectangle
skinparam shadowing false

' --- Actors ---
actor "Người dùng" as User
actor "Hệ thống (Timer/Jobs)" as System
actor "Dịch vụ AI\n(Gemini API)" as AI <<External Service>>

rectangle "Hệ thống Quản lý Thời gian (Timass)" {
  
  ' --- Nhóm tài khoản ---
  usecase "Đăng nhập / Đăng ký (SĐT)" as UC_Auth
  
  ' --- Nhóm quản lý công việc ---
  usecase "Quản lý công việc" as UC_Manage
  usecase "Xử lý công việc lặp lại hàng loạt" as UC_Repeat
  
  ' --- Nhóm AI (Bổ sung duy nhất) ---
  usecase "Quét thời khóa biểu từ ảnh (AI)" as UC_ScanAI
  usecase "Xem trước & xác nhận lịch" as UC_PreviewConfirm
  
  ' --- Nhóm trạng thái & hoàn thành ---
  usecase "Đánh dấu hoàn thành công việc (Thủ công)" as UC_ManualDone
  usecase "Tự động tích hoàn thành công việc bị động/thiết yếu\n(Khi qua khung giờ)" as UC_AutoDone
  usecase "Hiển thị trạng thái công việc trên lịch" as UC_DisplayStatus
  
  ' --- Nhóm nhắc nhở ---
  usecase "Gửi thông báo nhắc nhở (Trước 15p)" as UC_Notify
}

' --- Liên kết Người dùng ---
User --> UC_Auth
User --> UC_Manage
User --> UC_ManualDone
User --> UC_ScanAI

' --- Liên kết Hệ thống nền (Timer/Jobs) ---
System --> UC_AutoDone
System --> UC_Notify

' --- Quan hệ Extend / Include ---
UC_Repeat .> UC_Manage : <<extend>>
UC_ManualDone ..> UC_DisplayStatus : <<include>>
UC_AutoDone ..> UC_DisplayStatus : <<include>>

UC_ScanAI ..> UC_PreviewConfirm : <<include>>

' --- Liên kết dịch vụ ngoài ---
UC_ScanAI --> AI : Gửi ảnh phân tích

@enduml


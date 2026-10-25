Timass
1. Tổng quan Dự án (Project Overview)
	Tên dự án: Timass (Time Management & Scheduling System)
	Mục tiêu (Objective): Giúp người dùng quản lý thời gian, tối ưu lịch trình
	Khách hàng/Người dùng mục tiêu (Target Audience): người dùng có như cầu quản lý lịch trình trong ngày
2. Phạm vi Sản phẩm & Tính năng MVP (MVP Scope & Features)
	Tính năng cốt lõi (MVP Scope - Phase 1): 
	[Tính năng 1]: đăng nhập, đăng kí thông qua số điện thoại
	[Tính năng 2]: thêm, bớt các công việc vào lịch trình theo ngày,giờ ( có thể thêm và xóa hàng loạt các công việc trùng tên và khung thời gian lặp lại trong nhiều ngày)
	[Tính năng 3]: thông báo công việc sắp tới trước 15 phút khi đến khung giờ của công việc đó
	[Tính năng 4]: hiển thị lịch trình trên lịch tuần theo các khung giờ trong ngày
	[Tính năng 5]: công việc bị động có chia thành các task và tích khi đã hoàn thành ( các việc thiết yếu như ăn uống, ngủ thì tự động được tích khi qua khung giờ của nó)
	[Tính năng 6]: tích hợp AI để quét lịch trình qua hình ảnh của người dùng rồi tự động thêm công việc

	Tính năng định hướng tương lai (Out of Scope / Phase 2): 
	đưa ra các lịch trình mẫu tối ưu cho từng loại công việc, học tập
	phát trển phiên bản trên nền tảng Androi và IOS
3. Mô tả Chi tiết Tính năng & Yêu cầu Nghiệp vụ (Functional Requirements)
3.1. Tính năng: Đăng nhập & Đăng nhập, Xác thực
	Luồng người dùng (User Flow): 
	Người dùng truy cập trang /auth trên trình duyệt (chuyển đổi giữa tab Đăng ký hoặc Đăng nhập).
	Trường hợp Đăng ký:Hệ thống trả về JWT Token và chuyển hướng vào Dashboard.
	Người dùng nhập Số điện thoại, Họ và tên, Mật khẩu và Xác nhận mật khẩu.
	Hệ thống kiểm tra định dạng và xác thực số điện thoại chưa tồn tại trong cơ sở dữ liệu.
	Người dùng nhấn "Đăng ký" sau đó hệ thống lưu thông tin tài khoản mới và tự động đăng nhập.
	Trường hợp Đăng nhập:
	Người dùng nhập Số điện thoại và Mật khẩu.
	Hệ thống kiểm tra thông tin hợp lệ.
	Nếu chính xác, hệ thống trả về JWT Token và chuyển hướng người dùng vào trang Lịch tuần (Dashboard).
	Quy tắc nghiệp vụ (Business Rules): 
	Số điện thoại phải tuân thủ định dạng chuẩn của Việt Nam(10 chữ số, bắt đầu các đầu số hợp lệ: 03, 05, 07, 08, 09).
	Mật khẩu tối thiểu 6 ký tự, bắt buộc được mã hóa bằng thuật toán Bcrypt trước khi lưu vào bảng nguoi_dung.
	Token hết hạn sau 24 giờ.
3.2. Tính năng: Quản lý Công việc & Lập lịch lặp lại hàng loạt
	Luồng người dùng (User Flow):
	Tại giao diện Lịch, người dùng click vào nút "+ Thêm công việc" hoặc click trực tiếp vào một ô giờ trống trên lưới tuần.
	Giao diện mở Modal "Thêm công việc mới". Người dùng nhập:\
	Tiêu đề công việc.
	Loại công việc: Chọn giữa Chủ động (học tập, làm việc) hoặc Thiết yếu / Bị động (ăn uống, ngủ, nghỉ ngơi).
	Khung giờ: Giờ bắt đầu và Giờ kết thúc.
	Địa điểm / Phòng học (nếu có).
	Thiết lập lặp lại (Tùy chọn):
	Tích chọn ô "Lặp lại hàng tuần".
	Chọn các ngày diễn ra trong tuần (ví dụ: Thứ 2, Thứ 4, Thứ 6).
	Chọn khoảng thời gian áp dụng (Từ ngày... Đến ngày...).
	Người dùng bấm "Lưu công việc":
	Nếu là công việc đơn: Backend tạo 1 bản ghi vào bảng cong_viec.
	Nếu là công việc lặp lại: Backend sinh một chuỗi các bản ghi khớp với các thứ đã chọn, gán chung một ma_nhom_lap_lai
	Xóa công việc lặp lại: Khi người dùng bấm xóa một công việc nằm trong chuỗi lặp, hệ thống hiển thị tùy chọn: "Chỉ xóa công việc này" hoặc "Xóa toàn bộ các công việc lặp lại trong chuỗi".
	Quy tắc nghiệp vụ (Business Rules):
	gio_ket_thuc bắt buộc phải sau gio_bat_dau.
	Khung thời gian của một công việc không được vượt quá 24 giờ trong cùng một ngày.
	Các công việc thuộc cùng một chuỗi lặp lại bắt buộc phải có chung giá trị ma_nhom_lap_lai.
3.3. Tính năng: Chỉnh sửa Công việc & Cập nhật Chuỗi lặp lại
	Luồng người dùng (User Flow):
	Tại giao diện Lịch trình (Day/Week View), người dùng nhấp chuột (click) vào thẻ công việc muốn chỉnh sửa.
	Hệ thống hiển thị Modal "Chi tiết / Chỉnh sửa công việc" với toàn bộ dữ liệu hiện tại được điền sẵn (Tiêu đề, Ngày thực hiện, Giờ bắt đầu, Giờ kết thúc, Loại công việc, Địa điểm, Ghi chú).
	Người dùng thực hiện thay đổi các trường thông tin cần thiết.
	Xử lý lựa chọn cập nhật:
	Trường hợp công việc đơn lẻ (co_lap_lai = FALSE): Người dùng bấm nút "Cập nhật”. Hệ thống gửi yêu cầu PUT /api/v1/cong-viec/{maCongViec}.
	Trường hợp công việc thuộc chuỗi lặp lại (co_lap_lai = TRUE): Khi người dùng bấm "Lưu thay đổi", hệ thống hiển thị hộp thoại xác nhận với 2 tùy chọn:
	Tùy chọn A - "Chỉ áp dụng cho công việc này": Chỉ sửa thông tin của riêng bản ghi ngày hôm đó và tách công việc này ra khỏi chuỗi lặp lại.
	Tùy chọn B - "Áp dụng cho tất cả các công việc trong chuỗi": Đồng bộ nội dung sửa đổi cho toàn bộ các công việc có chung ma_nhom_lap_lai.
	Backend xử lý cập nhật cơ sở dữ liệu và trả về mã thành công 
	Giao diện React cập nhật hiển thị ngay lập tức khối công việc vừa sửa trên bảng lịch và hiển thị thông báo "Cập nhật công việc thành công".
	Quy tắc nghiệp vụ (Business Rules):
	Ràng buộc thời gian: gio_ket_thuc bắt buộc phải sau gio_bat_dau. Nếu người dùng đổi giờ bắt đầu/kết thúc không hợp lệ, nút lưu sẽ bị vô hiệu hóa kèm cảnh báo đỏ.
	Xử lý tách chuỗi lặp (Tùy chọn A): Nếu người dùng chọn "Chỉ áp dụng cho công việc này", bản ghi được chỉnh sửa sẽ được gán lại: co_lap_lai = FALSE và ma_nhom_lap_lai = NULL để không còn bị ảnh hưởng bởi chuỗi lặp cũ.
	Đồng bộ chuỗi lặp (Tùy chọn B): Hệ thống thực hiện UPDATE hàng loạt các bản ghi có cùng ma_nhom_lap_lai và ma_nguoi_dung, cập nhật lại tiêu đề, khung giờ, loại công việc và địa điểm mới.
	Cập nhật lại lịch nhắc nhở (Timer/Job): Nếu gio_bat_dau hoặc ngay_thuc_hien thay đổi, hệ thống phải tự động tính toán lại thời gian gửi thông báo trước 15 phút (cập nhật trường thoi_gian_nhac và đặt lại da_gui = FALSE nếu chưa đến khung giờ mới).
	Bảo mật quyền sở hữu: Chỉ tài khoản tạo ra công việc (ma_nguoi_dung khớp với Token người dùng đang đăng nhập) mới có quyền chỉnh sửa.
3.4. TÍNH NĂNG: QUÉT VÀ NHẬP THỜI KHÓA BIỂU TỪ HÌNH ẢNH (AI TIMETABLE SCANNER)
	Luồng người dùng (User Flow):
	Trên thanh công cụ của trang Calendar Dashboard, người dùng chọn nút "Nhập lịch bằng ảnh" (Upload Schedule).
	Giao diện mở modal tải tệp: Người dùng kéo thả hoặc tải lên ảnh chụp thời khóa biểu (hỗ trợ JPG, PNG, WebP; dung lượng <= 5Mb). Có thẻ xem trước ảnh vừa chọn
	Người dùng nhấn nút "Phân tích ảnh":
	Frontend hiển thị trạng thái xử lý (Loading Spinner / Skeleton).
	File ảnh được gửi lên Backend Spring Boot qua API multipart/form-data.
	Backend gọi Vision Model (ví dụ: Google Gemini 1.5 Flash Vision) kèm System Prompt ép kiểu dữ liệu trả về thành mảng JSON.
	Giai đoạn Xem trước & Chỉnh sửa (Preview & Validation Modal):
	Khi nhận được kết quả JSON, giao diện hiển thị bảng danh sách các sự kiện bóc tách được từ ảnh.
	Người dùng có thể kiểm tra lại, sửa trực tiếp tên môn, đổi khung giờ, chọn màu sắc đại diện cho môn học, hoặc xóa bớt các dòng bị nhận diện thừa.
	Lưu lịch trình:
	Người dùng chọn phạm vi áp dụng (Ví dụ: Áp dụng từ ngày ... đến ngày).
	Nhấn "Xác nhận thêm vào lịch": Hệ thống lưu toàn bộ dữ liệu vào MySQL và cập nhật ngay lên lưới lịch tuần của React mà không cần reload trang.
	Quy tắc nghiệp vụ (Business Rules):
	Nguyên tắc an toàn (Human-in-the-Loop): Hệ thống không tự động lưu trực tiếp dữ liệu do AI trích xuất vào CSDL nếu người dùng chưa bấm xác nhận ở bước Preview.
	Xử lý ảnh không hợp lệ: Nếu ảnh quá mờ, không phải lịch trình, hoặc AI không tìm thấy cấu trúc thời gian hợp lệ, hệ thống phải trả về thông báo lỗi thân thiện: "Không nhận diện được thời khóa biểu trong ảnh, vui lòng chụp rõ nét hơn hoặc thử lại".
	Xử lý xung đột (Conflict Warning): Nếu thời gian trích xuất từ ảnh bị trùng với các sự kiện cá nhân đã có sẵn trên web, hệ thống hiển thị cảnh báo đỏ trên dòng sự kiện đó tại bảng Preview để người dùng quyết định ghi đè hoặc bỏ qua.
3.5. Tính năng: Hiển thị Lịch trình & Đánh dấu hoàn thành thủ công
	Luồng người dùng (User Flow):
	Người dùng truy cập trang chính: Hệ thống tự động tải dữ liệu lịch trình của tuần hiện tại và hiển thị dưới dạng lưới 7 cột (Thứ 2 đến Chủ nhật) kèm trục thời gian 24 giờ.
	Người dùng có thể bấm nút điều hướng "Tuần trước" / "Tuần sau" hoặc chọn ngày cụ thể từ bộ chọn lịch nhỏ.
	Mỗi khối công việc hiển thị rõ: Tiêu đề, khung giờ, địa điểm và trạng thái hoàn thành.
	Đánh dấu thủ công(với công việc chủ động):
	Đối với các công việc loại Chủ động: Người dùng nhấp vào biểu tượng ô kiểm (checkbox) hoặc nút hoàn thành trên khối công việc.
	Frontend gửi yêu cầu PATCH /api/v1/cong-viec/{maCongViec}/trang-thai với trạng thái HOAN_THANH.
	Khối công việc đổi sang màu xanh/gạch ngang tiêu đề ngay lập tức trên giao diện.
	Quy tắc nghiệp vụ (Business Rules)
	Người dùng có thể đánh dấu hoàn thành trước, trong hoặc sau khung giờ diễn ra.
	Hỗ trợ cho phép hủy hoàn thành (chuyển ngược lại từ HOAN_THANH về DANG_CHO) nếu người dùng bấm nhầm.
3.6. Tính năng: Tự động tích hoàn thành công việc bị động/thiết yếu khi qua khung giờ
	Luồng hệ thống (System Flow):
	Tiến trình lập lịch chạy ngầm (Spring Scheduler với @Scheduled) được kích hoạt định kỳ mỗi phút một lần.
	Hệ thống truy vấn CSDL tìm các bản ghi thỏa mãn điều kiện:
	loai_cong_viec = 'THIET_YEU_BI_DONG'.
	trang_thai = 'DANG_CHO'.
	ngay_thuc_hien = Ngày hiện tại.
	gio_ket_thuc <= Giờ hiện tại.
	Nếu tìm thấy danh sách công việc quá hạn:
	Hệ thống duyệt qua từng công việc và cập nhật trang_thai = 'HOAN_THANH'
	Lưu thay đổi vào CSDL MySQL.
	Trình duyệt người dùng khi đang mở sẽ tự động phản ánh trạng thái hoàn thành mới thông qua cơ chế re-fetch dữ liệu định kỳ hoặc WebSocket.
	Quy tắc nghiệp vụ (Business Rules):
	Chỉ áp dụng cơ chế tự động này cho các công việc được gắn nhãn THIET_YEU_BI_DONG. Các công việc CHU_DONG nếu quá giờ vẫn giữ nguyên trạng thái DANG_CHO để người dùng tự xác nhận.
	Sau khi công việc bị động được hệ thống tự động tích hoàn thành, người dùng vẫn có quyền sửa đổi thủ công nếu cần thiết.
3.5. Tính năng: Gửi thông báo nhắc nhở trước 15 phút
	Luồng người dùng & Hệ thống (User & System Flow):
	Cấp quyền: Khi người dùng truy cập ứng dụng lần đầu, trình duyệt hiển thị hộp thoại yêu cầu cấp quyền Notification.requestPermission(). Người dùng chọn "Cho phép".
	Tiến trình quét ngầm:
	Mỗi phút, tiến trình Scheduler của hệ thống quét cơ sở dữ liệu để tìm các công việc thỏa mãn:
	ngay_thuc_hien = Ngày hiện tại.
	gio_bat_dau = Giờ hiện tại + 15 phút.
	Công việc chưa được gửi thông báo trước đó.
	Kiểm tra và gửi:
	Hệ thống kiểm tra xem người dùng có bật nhận thông báo hay không.
	Nếu đang BẬT: Hệ thống kích hoạt Web Push Notification hiển thị trực tiếp lên màn hình máy tính của người dùng với tiêu đề: "Nhắc nhở: [Tên công việc] sẽ bắt đầu sau 15 phút!".
	Hệ thống tạo một bản ghi vào bảng thong_bao với trạng thái da_gui = TRUE và ghi nhận thoi_gian_gui.
	Nếu trạng thái thông báo đang TẮT: Hệ thống ghi nhận bỏ qua lượt gửi cho công việc này.
	Quy tắc nghiệp vụ (Business Rules):
	Mỗi công việc chỉ được kích hoạt gửi thông báo nhắc nhở trước 15 phút đúng một lần để tránh gửi trùng lặp.
	Thông báo đẩy trình duyệt vẫn có thể hiển thị kể cả khi người dùng đang chuyển sang tab khác trên trình duyệt.
4. Yêu cầu Phi chức năng (Non-Functional Requirements - NFR)
	Hiệu năng (Performance): Thời gian phản hồi API < 200ms với các truy vấn thông thường.
	Bảo mật (Security): Mật khẩu mã hóa (Bcrypt). Sử dụng JWT để xác thực phiên đăng nhập, Token hết hạn sau 24 giờ
	Trải nghiệm Ngoại tuyến (Offline-first): Ứng dụng phải lưu trữ đệm (cache) danh sách công việc trên thiết bị. Người dùng vẫn xem được lịch trình hôm nay khi mất kết nối mạng.
	Mở rộng (Scalability): Hệ thống có khả năng chịu tải ban đầu 100 người dùng đồng thời (Concurrent Users).
	Giới hạn tệp tải lên (File Handling): Giới hạn dung lượng tối đa 5MB/ảnh. Kiểm tra định dạng (MIME type) ở cả Frontend lẫn Backend để ngăn chặn mã độc.
	Tối ưu thời gian xử lý (Processing Latency): Thời gian AI phân tích ảnh và trả về danh sách sự kiện ≤ 4–6 giây đối với ảnh chụp bảng biểu thông thường.

	Lưu trữ ảnh tạm thời: Ảnh tải lên chỉ dùng để gửi sang Vision API phân tích, hệ thống không lưu vĩnh viễn file ảnh thô vào Database để tiết kiệm tài nguyên lưu trữ của máy chủ (xóa tệp tạm ngay sau khi xử lý xong).
5. Lựa chọn Công nghệ (Tech Stack)
	Kiến trúc Hệ thống: Client-Server.
	Frontend (Client): : React.js + Tailwind CSS + Thư viện hiển thị lịch (FullCalendar).
	Backend API (Server): Java kết hợp framework Spring Boot. Đây là bộ khung cực kỳ hoàn hảo để tổ chức code theo mô hình MVC, dễ dàng vẽ biểu đồ lớp (Class Diagram) rất chi tiết và chuẩn xác cho môn Phân tích thiết kế.
	Database: MySQL
	DevOps / Deployment: Trịnh Xuân Bắc
6. Liên kết Tài liệu liên quan (Design & Technical Artifacts)
Phần này dẫn link đến các sản phẩm khác đã chuẩn bị ở Giai đoạn 1:
	UI/UX Design: [Chèn link Figma]
	Database Schema (ERD): [Chèn link 4]
	API Docs / Workspace: [Chèn link Postman / Swagger]


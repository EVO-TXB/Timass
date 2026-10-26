# ⏰ Timass - Hệ Thống Quản Lý Thời Gian & Lịch Trình Thông Minh

> **Timass** (Time Assistant) là ứng dụng web quản lý thời gian và lịch trình cá nhân hóa, hỗ trợ đồng bộ thời gian thực (Real-Time Sync), nhận diện thời khóa biểu bằng trí tuệ nhân tạo (AI Gemini), quản lý chuỗi công việc lặp lại và theo dõi tiến độ công việc hàng ngày.

---

## 📑 Mục Lục
1. [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
2. [Yêu Cầu Môi Trường (Prerequisites)](#-yêu-cầu-môi-trường-prerequisites)
3. [⚡ Khởi Chạy Nhanh Bằng 1 Lệnh (One-Command Run)](#-khởi-chạy-nhanh-bằng-1-lệnh-one-command-run)
4. [Hướng Dẫn Cài Đặt & Chạy Từng Bước](#-hướng-dẫn-cài-đặt--chạy-từng-bước)
   - [Bước 1: Khởi tạo Cơ sở dữ liệu MySQL](#bước-1-khởi-tạo-cơ-sở-dữ-liệu-mysql)
   - [Bước 2: Cấu hình Môi trường (.env)](#bước-2-cấu-hình-môi-trường-env)
   - [Bước 3: Khởi chạy Backend (Spring Boot)](#bước-3-khởi-chạy-backend-spring-boot)
   - [Bước 4: Cài đặt và Khởi chạy Frontend (React + Vite)](#bước-4-cài-đặt-và-khởi-chạy-frontend-react--vite)
   - [Bước 5: Truy cập và Sử dụng Ứng dụng](#bước-5-truy-cập-và-sử-dụng-ứng-dụng)
5. [Các Tính Năng Nổi Bật & Hướng Dẫn Kiểm Thử](#-các-tính-năng-nổi-bật--hướng-dẫn-kiểm-thử)
6. [Danh Sách API Chính (Backend REST APIs)](#-danh-sách-api-chính-backend-rest-apis)
7. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
8. [Khắc Phục Lỗi Thường Gặp (Troubleshooting)](#-khắc-phục-lỗi-thường-gặp-troubleshooting)

---

## 🛠 Công Nghệ Sử Dụng

### Backend
- **Ngôn ngữ:** Java 17
- **Framework:** Spring Boot 3.3.5 (Spring Data JPA, Spring Web, Hibernate, Spring Validation)
- **Cơ sở dữ liệu:** MySQL 8.0+
- **Build Tool:** Apache Maven
- **Tích hợp AI:** Google Gemini 1.5 Flash (Trích xuất ảnh Thời khóa biểu)

### Frontend
- **Framework:** React 19 + Vite 8
- **Routing:** React Router DOM 7
- **Styling:** TailwindCSS v4 + Lucide React Icons
- **HTTP Client:** Axios (xử lý interceptor & fallback mượt mà)
- **Động cơ Real-Time:** Custom Hook `useRealTimeSync` cập nhật tọa độ pixel theo thời gian thực

---

## 💻 Yêu Cầu Môi Trường (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

| Công cụ | Phiên bản yêu cầu | Kiểm tra bằng lệnh |
| :--- | :--- | :--- |
| **Java JDK** | 17 trở lên | `java -version` |
| **Apache Maven** | 3.8+ | `mvn -v` |
| **Node.js** | 18.x hoặc 20.x+ | `node -v` |
| **npm** | 9.x+ | `npm -v` |
| **MySQL Server** | 8.0+ | `mysql --version` |

---

## ⚡ Khởi Chạy Nhanh Bằng 1 Lệnh (One-Command Run)

Dự án đã tích hợp sẵn script tự động khởi chạy đồng thời cả **Backend (Spring Boot)** và **Frontend (React)**:

### 🔹 Trên Windows:
Chạy script bằng 1 lệnh duy nhất trong PowerShell hoặc CMD:
```powershell
.\run.bat
```
*(Nếu chưa có file `.env`, script sẽ tự động tạo từ `.env.example` và mở trình duyệt `http://localhost:5173` khi hoàn tất).*

### 🔹 Trên Linux / macOS:
```bash
chmod +x run.sh
./run.sh
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Chi Tiết (Manual Setup)

### Bước 1: Khởi tạo Cơ sở dữ liệu MySQL

1. Mở terminal (CMD, PowerShell) hoặc công cụ quản trị MySQL (MySQL Workbench, DBeaver, HeidiSQL).
2. Chạy lệnh tạo cấu trúc bảng dữ liệu từ file [`schema.sql`](./schema.sql):

```bash
# Thay thế -u root và -P 3307 bằng username và port MySQL của máy bạn (mặc định thường là 3306 hoặc 3307)
mysql -u root -p -P 3307 --default-character-set=utf8mb4 < schema.sql
```

3. Nạp dữ liệu mẫu (Sample Tasks & User) từ file [`seed-data.sql`](./seed-data.sql):

```bash
mysql -u root -p -P 3307 --default-character-set=utf8mb4 < seed-data.sql
```

> **Ghi chú:** Cơ sở dữ liệu được tạo có tên là `timass_db` với bộ mã ký tự `utf8mb4` hiển thị tiếng Việt trọn vẹn.

---

### Bước 2: Cấu hình Môi trường (.env)

Dự án cung cấp file mẫu cấu hình môi trường [`.env.example`](./.env.example). Tạo file `.env` từ file mẫu:

```bash
# Windows
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Điền mật khẩu MySQL và API Key Google Gemini (nếu có) vào `.env`:
```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=timass_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Lưu ý bảo mật:** File `.env` chứa thông tin nhạy cảm đã được cấu hình trong `.gitignore` để **tuyệt đối không bị commit lên GitHub**. Backend sẽ tự động đọc từ biến môi trường của hệ thống hoặc file cấu hình [`backend/src/main/resources/application.yml`](./backend/src/main/resources/application.yml).

---

### Bước 3: Khởi chạy Backend (Spring Boot)

1. Mở cửa sổ Terminal thứ nhất và di chuyển vào thư mục `backend`:
```bash
cd backend
```

2. Build và tải dependencies:
```bash
mvn clean install -DskipTests
```
mvn spring-boot:run
3. Khởi động Spring Boot server:
```bash
mvn spring-boot:run
```

4. Khi màn hình xuất hiện thông báo:
```text
Started TimassApplication in X.XXX seconds (process running for X.XXX)
```
Backend đã sẵn sàng hoạt động tại: **`http://localhost:8080`**.

> **Kiểm tra nhanh API:** Mở trình duyệt truy cập `http://localhost:8080/api/v1/cong-viec` để xem danh sách công việc dạng JSON trả về từ MySQL.

---

### Bước 4: Cài đặt và Khởi chạy Frontend (React + Vite)

1. Mở một cửa sổ Terminal thứ hai và di chuyển vào thư mục `frontend`:
```bash
cd frontend
```

2. Cài đặt các thư viện phụ thuộc:
```bash
npm install
```

3. Khởi động server phát triển Vite:
```bash
npm run dev
```

4. Màn hình console sẽ hiển thị:
```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Bước 5: Truy cập và Sử dụng Ứng dụng

1. Mở trình duyệt Web (Chrome, Edge, Firefox) và truy cập đường dẫn:
   👉 **`http://localhost:5173`**
2. Tại màn hình **Đăng nhập**, bạn có thể:
   - Điền số điện thoại: `0987654321` và mật khẩu: `matkhau123` rồi bấm **"Đăng nhập"**.
   - Hoặc click trực tiếp nút **"Khám phá ngay Dashboard"** để vào thẳng giao diện quản lý lịch tuần.

---

## 🌟 Các Tính Năng Nổi Bật & Hướng Dẫn Kiểm Thử

### 1. Đồng bộ lịch trình với thời gian thực (Real-Time Calendar Sync)
- **Vạch đỏ chỉ giờ thực tế (Current Time Indicator):**
  + Tự động tính toán vị trí theo giờ:phút:giây hiện tại.
  + **Chỉ hiển thị duy nhất trên cột của Thứ trùng với ngày hôm nay** (ví dụ hôm nay là Thứ 6 thì chỉ xuất hiện ở cột Thứ 6).
  + Trên trục thời gian bên trái hiển thị badge đỏ chứa giờ/phút hiện tại (ví dụ: `20:45`).
  + Khi chuyển sang tuần khác, vạch đỏ sẽ tự động ẩn đi.
- **Tự động cuộn (Auto-Scroll):**
  + Khi mở trang hoặc bấm nút **"Hôm nay"**, lưới lịch tự động cuộn mượt mà (`smooth scroll`) đến vị trí cách mốc giờ hiện tại 120px để dễ quan sát cả các sự kiện trước đó.
- **Tự động hoàn thành việc quá hạn (Passive Task Auto-Complete):**
  + Công việc thuộc nhóm **Bị động / Thiết yếu** (`THIET_YEU_BI_DONG`) khi hết giờ (`gioKetThuc <= currentTime`) sẽ tự động chuyển trạng thái sang **Hoàn thành**, tiêu đề gạch ngang, thẻ đổi màu xanh lá và cập nhật ngay thanh tiến độ `%` mà không cần F5 trình duyệt.
- **Thông báo nhắc nhở thông minh theo chu kỳ (Smart Event Toast):**
  + Tự động nhắc nhở khi có sự kiện sắp bắt đầu trong 15 phút tới (`15 phút nữa`).
  + Tự động kích hoạt thông báo khi đúng giờ bắt đầu (`Bắt đầu ngay bây giờ!`).
  + Thanh tiến độ đếm ngược thời gian tự động đóng (Auto-dismiss sau 9s), tự động tạm dừng khi rê chuột lên toast.
  + Nhấp vào chuông thông báo 🔔 trên Header sẽ ngay lập tức mở thông báo cho sự kiện tiếp theo trong ngày.
  + Bấm nút **"Xem chi tiết"** sẽ mở trực tiếp modal thông tin sự kiện đó.

### 2. Quản lý công việc linh hoạt (Task Management)
- **Thêm việc đơn lẻ:** Bấm nút **"+ Thêm việc"** góc phải trên cùng để mở modal tạo việc mới.
- **Tạo & Sửa chuỗi lặp lại:** Cho phép chọn lặp lại vào các Thứ mong muốn (T2, T3, T4, T5, T6, T7, CN). Hỗ trợ lựa chọn: *"Chỉ cập nhật sự kiện này"* hoặc *"Áp dụng cho toàn bộ chuỗi lặp"*.
- **Tương tác nhanh:** Click vào nút tròn checkbox trên thẻ sự kiện để chuyển nhanh trạng thái hoàn thành.

### 3. Quét ảnh Thời khóa biểu bằng AI (AI Scanner Modal)
- Bấm nút **"✨ Quét ảnh TKB (AI)"** trên thanh điều hướng.
- Tải lên ảnh chụp thời khóa biểu (JPG/PNG).
- Hệ thống trích xuất tự động danh sách các môn học, thời gian, phòng học và cho phép xem trước trước khi bấm **"Lưu vào lịch trình"**.

---

## 📡 Danh Sách API Chính (Backend REST APIs)

Base URL: `http://localhost:8080/api/v1`

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/cong-viec` | Lấy danh sách công việc (có thể lọc theo `tuNgay`, `denNgay`) |
| `POST` | `/cong-viec/don-le` | Tạo công việc đơn lẻ |
| `POST` | `/cong-viec/lap-lai` | Tạo chuỗi công việc lặp lại hàng tuần |
| `PUT` | `/cong-viec/{id}` | Cập nhật công việc (hỗ trợ cờ `apDungChoTatCa`) |
| `PATCH` | `/cong-viec/{id}/trang-thai` | Cập nhật nhanh trạng thái (`DANG_CHO` / `HOAN_THANH`) |
| `DELETE`| `/cong-viec/{id}` | Xóa công việc (tham số `xoaCaChuoiLap=true/false`) |
| `POST` | `/cong-viec/luu-hang-loat` | Lưu danh sách môn học từ kết quả quét AI |
| `POST` | `/quet-ai/tkb` | Upload ảnh và trích xuất TKB bằng Google Gemini |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
my-react-app/
├── backend/                               # Mã nguồn Backend Spring Boot
│   ├── src/main/java/com/timass/
│   │   ├── controller/                    # REST API Controllers (CongViecController, QuetAiController, ...)
│   │   ├── dto/                           # Data Transfer Objects
│   │   ├── model/                         # JPA Entities (CongViec, NguoiDung, ThongBao, ...)
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── service/                       # Business Logic Interfaces & Implementations
│   │   └── TimassApplication.java         # File chạy chính của Spring Boot
│   ├── src/main/resources/
│   │   └── application.yml                # Cấu hình Database, Gemini AI, Logging
│   └── pom.xml                            # Quản lý dependencies Maven
│
├── frontend/                              # Mã nguồn Frontend React + Vite
│   ├── src/
│   │   ├── components/                    # Các Component giao diện
│   │   │   ├── WeekCalendarGrid.jsx       # Lưới lịch tuần & vạch đỏ thời gian thực
│   │   │   ├── EventCard.jsx              # Thẻ sự kiện công việc
│   │   │   ├── Header.jsx                 # Thanh tiêu đề, nút điều hướng, chuyển tuần
│   │   │   ├── TaskFormModal.jsx          # Modal thêm & sửa công việc
│   │   │   ├── AiScannerModal.jsx         # Modal quét TKB bằng AI
│   │   │   ├── NotificationToast.jsx      # Toast nhắc nhở trước 15 phút
│   │   │   └── TodayProgressWidget.jsx    # Widget hiển thị % hoàn thành trong ngày
│   │   ├── context/
│   │   │   └── TaskContext.jsx            # Quản lý toàn bộ State công việc & Optimistic UI
│   │   ├── hooks/
│   │   │   └── useRealTimeSync.js         # Custom Hook đồng bộ thời gian thực & auto-scroll
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx          # Màn hình chính Dashboard
│   │   │   └── LoginPage.jsx              # Màn hình Đăng nhập
│   │   ├── services/                      # Axios API Services kết nối backend
│   │   └── utils/
│   │       └── dateUtils.js               # Các hàm tiện ích xử lý ngày tháng tuần
│   ├── package.json                       # Dependencies & Scripts của npm
│   └── vite.config.js                     # Cấu hình Vite Dev Server & Proxy
│
├── schema.sql                             # Script khởi tạo Database MySQL
├── seed-data.sql                          # Dữ liệu mẫu ban đầu (Tuần 42 & Tuần 43)
└── README.md                              # Hướng dẫn chi tiết chạy dự án
```

---

## ❓ Khắc Phục Lỗi Thường Gặp (Troubleshooting)

### 1. Lỗi kết nối MySQL (`Communications link failure` hoặc `Access denied`)
- **Nguyên nhân:** Cổng kết nối hoặc mật khẩu trong `application.yml` không khớp với MySQL trên máy.
- **Cách xử lý:** 
  + Kiểm tra xem cổng MySQL của bạn là `3306` hay `3307`.
  + Mở file [`backend/src/main/resources/application.yml`](./backend/src/main/resources/application.yml) và cập nhật đúng `url`, `username`, và `password`.

### 2. Tiếng Việt bị lỗi font hoặc dấu hỏi chấm (`???`)
- **Cách xử lý:** Khi chạy file `.sql`, hãy luôn truyền cờ `--default-character-set=utf8mb4`:
  ```bash
  mysql -u root -p -P 3307 --default-character-set=utf8mb4 < seed-data.sql
  ```

### 3. Cổng 8080 hoặc 5173 đang bị chiếm dụng (Port already in use)
- **Cách xử lý:**
  + Đổi cổng Backend trong `backend/src/main/resources/application.yml` (`server.port: 8081`).
  + Đổi cổng Frontend trong `frontend/vite.config.js` hoặc chạy Vite sẽ tự động gợi ý cổng tiếp theo (`5174`).

---

**Chúc bạn có trải nghiệm tuyệt vời cùng Timass!** 🚀

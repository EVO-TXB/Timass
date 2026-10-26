@echo off
chcp 65001 >nul
title Timass System Launcher
echo ========================================================
echo       TIMASS - KHỞI ĐỘNG HỆ THỐNG VỚI 1 LỆNH DUY NHẤT
echo ========================================================
echo.

if not exist ".env" (
    echo [INFO] Chưa tìm thấy file .env, đang tự động tạo từ .env.example...
    copy .env.example .env >nul
    echo [OK] Đã tạo file .env thành công!
    echo.
)

echo [1/2] Đang khởi chạy Backend (Spring Boot trên cổng 8080)...
start "Timass Backend" cmd /k "cd backend && mvn spring-boot:run"

echo [2/2] Đang khởi chạy Frontend (React + Vite trên cổng 5173)...
start "Timass Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo [HOÀN TẤT] Hệ thống Timass đang được khởi chạy!
echo  - Frontend Web: http://localhost:5173
echo  - Backend API:  http://localhost:8080
echo ========================================================
echo.
echo Đang mở trình duyệt sau 3 giây...
timeout /t 3 >nul
start http://localhost:5173

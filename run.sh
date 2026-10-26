#!/usr/bin/env bash
# ========================================================
# TIMASS - Khởi động toàn bộ hệ thống bằng 1 lệnh duy nhất
# ========================================================

echo "========================================================"
echo "      TIMASS - KHỞI ĐỘNG HỆ THỐNG VỚI 1 LỆNH DUY NHẤT"
echo "========================================================"

if [ ! -f .env ]; then
  echo "[INFO] Chưa tìm thấy file .env, đang copy từ .env.example..."
  cp .env.example .env
fi

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "[1/2] Đang khởi chạy Backend (Spring Boot)..."
(cd backend && mvn spring-boot:run) &
BACKEND_PID=$!

echo "[2/2] Đang khởi chạy Frontend (React + Vite)..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

echo ""
echo "========================================================"
echo "Hệ thống Timass đang chạy:"
echo " - Frontend: http://localhost:5173"
echo " - Backend:  http://localhost:8080"
echo "Nhấn Ctrl+C để dừng toàn bộ hệ thống."
echo "========================================================"

wait

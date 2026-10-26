@echo off
chcp 65001 >nul
title Timass Live Deploy Tunnel
echo ========================================================
echo       TIMASS - KHỞI TẠO LINK DEPLOY TRỰC TIẾP
echo ========================================================
echo.
echo [1] Đảm bảo hệ thống Timass (Frontend & Backend) đang chạy.
echo [2] Đang kết nối tới Cloudflare Global Network...
echo.
echo Bạn hãy copy đường link "https://...trycloudflare.com" bên dưới để nộp hoặc gửi cho thầy cô:
echo.
.\cloudflared.exe tunnel --url http://localhost:5173

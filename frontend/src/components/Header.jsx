import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Plus,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TodayProgressWidget from './TodayProgressWidget';
import timassLogo from '../assets/timass-logo.png';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const {
    currentWeek,
    currentMonth,
    currentYear,
    goToToday,
    nextWeek,
    prevWeek,
    openCreateModal,
    openAiScanner,
    toggleToast,
  } = useTasks();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentUser = authService.getCurrentUser() || {
    hoTen: 'Nguyễn Văn A',
    soDienThoai: '0912345678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="relative z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="max-w-[1680px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">

        {/* LEFT SECTION: Logo & Week Navigator */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3 sm:gap-4">
          {/* Logo Timass */}
          <div className="flex items-center gap-2.5 shrink-0 select-none">
            <img src={timassLogo} alt="Timass" className="h-8 sm:h-9 w-auto object-contain" />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Hôm nay
            </button>

            {/* Prev / Next buttons */}
            <div className="flex items-center border border-gray-200/90 rounded-xl bg-white shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={prevWeek}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors border-r border-gray-100 cursor-pointer"
                aria-label="Tuần trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextWeek}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Tuần sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Current Month & Week Title */}
            <h2 className="text-sm sm:text-base lg:text-lg font-bold text-[#1e1b4b] whitespace-nowrap ml-1 tracking-tight">
              Tháng {currentMonth}, {currentYear} (Tuần {currentWeek})
            </h2>
          </div>
        </div>

        {/* RIGHT SECTION: Progress Widget, Actions & Avatar */}
        <div className="flex items-center justify-end w-full lg:w-auto gap-2.5 sm:gap-3 flex-wrap">
          {/* Today % Progress Widget with Popover Checklist */}
          <TodayProgressWidget variant="header" align="right" />

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleToast}
              className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              title="Nhắc nhở thông báo sắp đến giờ"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {/* Red dot badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            </button>
          </div>

          {/* AI Schedule Scan Button */}
          <button
            type="button"
            onClick={openAiScanner}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#4f46e5] to-[#6366f1] hover:from-[#4338ca] hover:to-[#4f46e5] shadow-[0_4px_12px_rgba(79,70,229,0.25)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Quét ảnh TKB (AI)</span>
            <span className="hidden sm:inline">🎉</span>
          </button>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#556581] hover:bg-[#475569] shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm việc</span>
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center cursor-pointer rounded-full ring-2 ring-transparent hover:ring-indigo-300 transition-all p-0.5"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.hoTen}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-xs border border-white"
              />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{currentUser.hoTen}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser.soDienThoai}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

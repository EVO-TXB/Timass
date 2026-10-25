import React, { useRef } from 'react';
import EventCard from './EventCard';
import { useTasks } from '../context/TaskContext';
import { useRealTimeSync } from '../hooks/useRealTimeSync';

/**
 * WeekCalendarGrid Component
 * Lưới lịch tuần đồng bộ thời gian thực (Real-Time Calendar Sync) cho hệ thống Timass.
 * - Hiển thị 7 cột thứ tương ứng tuần được chọn
 * - Vạch đỏ chỉ giờ thực tế (Current Time Indicator) hiển thị đúng ngày hôm nay
 * - Tự động cuộn đến giờ hiện tại khi mở ứng dụng hoặc bấm "Hôm nay"
 * - Đồng bộ tự động việc quá hạn và cảnh báo 15 phút
 */
export default function WeekCalendarGrid() {
  const {
    tasks,
    toggleTask,
    filters,
    openEditModal,
    currentWeek,
    currentYear,
    reloadTasks,
    showToast,
    goToTodayTrigger,
    markTaskCompleted,
  } = useTasks();

  // Ref container cuộn của bảng lịch
  const calendarScrollRef = useRef(null);

  // Hook quản lý đồng bộ thời gian thực
  const {
    topPosition,
    isTimeInRange,
    isCurrentWeek,
    formattedTime,
    weekDays,
    START_HOUR,
    END_HOUR,
    HOUR_HEIGHT,
    totalGridHeight,
  } = useRealTimeSync({
    calendarScrollRef,
    currentWeek,
    currentYear,
    tasks,
    reloadTasks,
    showToast,
    goToTodayTrigger,
    markTaskCompleted,
  });

  // Mảng các mốc giờ từ 06:00 đến 22:00
  const hours = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  const formatHour = (h) => `${h < 10 ? '0' : ''}${h}:00`;

  // Bộ lọc công việc theo chú thích
  const isTaskVisible = (task) => {
    if (task.daHoanThanh && !filters.daHoanThanh) return false;
    if (task.loaiCongViec === 'CHỦ_ĐỘNG' && !filters.chuDong) return false;
    if (
      (task.loaiCongViec === 'BỊ_ĐỘNG' ||
        task.loaiCongViec === 'THIẾT_YẾU' ||
        task.loaiCongViec === 'THIET_YEU_BI_DONG') &&
      !filters.biDong
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col overflow-hidden h-[calc(100vh-100px)] min-h-[580px] max-h-[850px] select-none">
      {/* 1. STICKY DAYS HEADER ROW (7 cột từ Thứ 2 đến Chủ nhật) */}
      <div className="grid grid-cols-[68px_repeat(7,1fr)] border-b border-gray-100 bg-white sticky top-0 z-30 shadow-xs">
        {/* Góc trên bên trái trục giờ */}
        <div className="border-r border-gray-100 py-3" />

        {/* 7 Cột Tiêu Đề Thứ & Ngày */}
        {weekDays.map((day) => (
          <div
            key={day.thu}
            className={`py-3 text-center border-r border-gray-100 last:border-r-0 transition-colors ${
              day.isToday ? 'bg-indigo-50/40' : ''
            }`}
          >
            <div className="inline-flex items-center gap-1.5">
              <span
                className={`text-sm sm:text-[15px] font-bold ${
                  day.isToday ? 'text-[#4f46e5]' : 'text-gray-800'
                }`}
              >
                {day.label}
              </span>
              {day.isToday && (
                <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. SCROLLABLE CALENDAR GRID BODY */}
      <div
        ref={calendarScrollRef}
        id="calendar-scroll-container"
        className="relative flex-1 overflow-y-auto scrollbar-thin"
      >
        {/* 3. LƯỚI KHUNG GIỜ VÀ 7 CỘT SỰ KIỆN */}
        <div
          className="grid grid-cols-[68px_repeat(7,1fr)] relative"
          style={{ height: `${totalGridHeight}px` }}
        >
          {/* CỘT TRỤC GIỜ BÊN TRÁI (06:00 đến 22:00) */}
          <div className="border-r border-gray-100 relative bg-white select-none">
            {hours.slice(0, -1).map((hour) => (
              <div
                key={hour}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="pr-2 pt-1 text-right text-xs font-semibold text-gray-400 border-b border-gray-100/80"
              >
                {formatHour(hour)}
              </div>
            ))}

            {/* Badge hiển thị giờ hiện tại trên trục giờ (Chỉ hiện khi ở tuần hiện tại) */}
            {isCurrentWeek && isTimeInRange && (
              <div
                className="absolute right-1 z-20 pointer-events-none transition-all duration-300"
                style={{ top: `${topPosition - 9}px` }}
              >
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm tracking-wider">
                  {formattedTime}
                </span>
              </div>
            )}
          </div>

          {/* 7 CỘT SỰ KIỆN TƯƠNG ỨNG TỪNG NGÀY TRONG TUẦN */}
          {weekDays.map((day) => {
            // Lọc chính xác các sự kiện thuộc ngày của cột này
            const dayTasks = tasks.filter((t) => {
              if (!isTaskVisible(t)) return false;
              if (t.ngay || t.ngayThucHien) {
                return t.ngay === day.fullDate || t.ngayThucHien === day.fullDate;
              }
              return t.thu === day.thu;
            });

            return (
              <div
                key={day.thu}
                data-thu={day.thu}
                data-date={day.fullDate}
                className={`relative border-r border-gray-100 last:border-r-0 transition-colors ${
                  day.isToday ? 'bg-indigo-50/10' : 'bg-white'
                }`}
              >
                {/* Các đường kẻ ngang phân chia từng giờ */}
                {hours.slice(0, -1).map((hour) => (
                  <div
                    key={hour}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                    className="border-b border-gray-100/80 hover:bg-gray-50/40 transition-colors"
                  />
                ))}

                {/* VẠCH KẺ ĐỎ CHỈ GIỜ THỰC TẾ (Current Time Indicator):
                    RÀNG BUỘC: CHỈ HIỂN THỊ DUY NHẤT TRÊN CỘT CỦA THỨ TRÙNG VỚI HÔM NAY (isToday === true) */}
                {day.isToday && isTimeInRange && (
                  <div
                    id="current-time-indicator"
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none flex items-center transition-all duration-500"
                    style={{ top: `${topPosition}px` }}
                  >
                    {/* Chấm tròn nhỏ màu đỏ ở mép trái vạch đỏ */}
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 -mt-[1px] ring-2 ring-white shadow-xs" />
                  </div>
                )}

                {/* Các khối thẻ sự kiện EventCard */}
                {dayTasks.map((task) => (
                  <EventCard
                    key={task.id || task.maCongViec}
                    event={task}
                    hourHeight={HOUR_HEIGHT}
                    startHour={START_HOUR}
                    onToggle={toggleTask}
                    onCardClick={(t) => openEditModal(t)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

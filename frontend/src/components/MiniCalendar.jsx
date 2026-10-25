import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { getMonthMatrix } from '../utils/dateUtils';

/**
 * MiniCalendar Component
 * Lịch tháng mini ở Sidebar:
 * - Hiển thị ma trận ngày động của Tháng & Năm được chọn
 * - Nút < và > chuyển đổi qua lại giữa các Tháng (Tháng 9, 10, 11, 12, ...) và Năm
 * - Click vào một dòng tuần bất kỳ để chuyển nhanh lịch tuần chính sang tuần đó
 */
export default function MiniCalendar() {
  const {
    currentWeek,
    currentMonth,
    currentYear,
    nextMonth,
    prevMonth,
    selectWeek,
  } = useTasks();

  // Ma trận các tuần và 7 ngày được sinh động theo Tháng và Năm hiện tại
  const calendarWeeks = useMemo(() => {
    return getMonthMatrix(currentYear, currentMonth, new Date());
  }, [currentYear, currentMonth]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs select-none">
      {/* Calendar Header: Tháng & Điều hướng tháng */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 tracking-tight">
          Tháng {currentMonth}, {currentYear}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Tháng trước"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Tháng sau"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row: Wk | T2 T3 T4 T5 T6 Sa CN */}
      <div className="grid grid-cols-8 gap-1 text-center text-[11px] font-semibold text-gray-400 mb-2">
        <span className="text-[10px]"></span>
        <span>T2</span>
        <span>T3</span>
        <span>T4</span>
        <span>T5</span>
        <span>T6</span>
        <span>Sa</span>
        <span>CN</span>
      </div>

      {/* Days Rows (Ma trận các tuần) */}
      <div className="space-y-1">
        {calendarWeeks.map((row) => {
          const isSelectedWeek = row.weekNum === currentWeek;
          return (
            <div
              key={`${row.year}-${row.weekNum}`}
              onClick={() => selectWeek(row.weekNum, row.year)}
              className={`grid grid-cols-8 gap-1 items-center text-center text-xs py-0.5 rounded-xl transition-all cursor-pointer ${
                isSelectedWeek
                  ? 'bg-[#eae3fb] font-semibold text-[#4f46e5] shadow-xs'
                  : 'text-gray-700 hover:bg-gray-50/80'
              }`}
              title={`Xem lịch trình tuần ${row.weekNum}`}
            >
              {/* Cột số tuần (Week Number) */}
              <span className="text-[10px] text-gray-400 font-normal">
                {row.weekNum}
              </span>

              {/* 7 Ngày trong tuần */}
              {row.days.map((dayItem, idx) => {
                const isDimmed = dayItem.isPrevMonth || dayItem.isNextMonth;
                const isFirstDayOfCurrentWeek = isSelectedWeek && idx === 0;

                return (
                  <span
                    key={idx}
                    className={`h-6 flex items-center justify-center rounded-lg text-[11px] transition-colors ${
                      isFirstDayOfCurrentWeek
                        ? 'bg-[#556581] text-white font-bold shadow-xs'
                        : dayItem.isToday
                        ? 'font-bold text-[#4f46e5] ring-1.5 ring-[#4f46e5]/40 bg-indigo-50/50'
                        : isDimmed
                        ? 'text-gray-300'
                        : isSelectedWeek
                        ? 'text-[#4f46e5] font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {dayItem.dayNumber}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

/**
 * Circular progress ring component using pure SVG
 */
function CircularProgress({ percent, size = 38, strokeWidth = 3.5, color = '#6366f1' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-gray-100"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  );
}

/**
 * TodayProgressWidget Component
 * - Trạng thái mặc định: Hiển thị thanh tiến độ/vòng tròn % và chữ tóm tắt: "{tiLe}% hoàn thành ({daXong}/{tongCong})".
 * - Khi click vào widget: Mở ra bảng Popover bảng check list.png.
 * - Cho phép tích chọn/bỏ tích checkbox nhanh và cập nhật % tiến độ tức thì.
 * - Tự đóng khi bấm nút "X" hoặc click ra ngoài vùng popover.
 */
export default function TodayProgressWidget({ variant = 'header', align = 'right' }) {
  const { todayTasks, stats, toggleTask } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const { daXong, tongCong, tiLe } = stats;

  return (
    <div className="relative inline-block">
      {/* TRIGGER BUTTON: HEADER VARIANT */}
      {variant === 'header' && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
            isOpen
              ? 'bg-indigo-50/80 border-indigo-200 shadow-sm ring-2 ring-indigo-500/10'
              : 'bg-white hover:bg-gray-50/90 border-gray-200/80 shadow-xs'
          }`}
          title="Xem danh sách công việc hôm nay"
        >
          <CircularProgress percent={tiLe} size={32} strokeWidth={3} color="#4f46e5" />
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-900">{tiLe}% hoàn thành</span>
              <span className="text-[11px] text-gray-500 font-medium">({daXong}/{tongCong})</span>
            </div>
            <p className="text-[10px] text-gray-400 font-normal">Tiến độ hôm nay</p>
          </div>
        </button>
      )}

      {/* TRIGGER BUTTON: SIDEBAR VARIANT (Mirrors exact left-sidebar card from ui-sample) */}
      {variant === 'sidebar' && (
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-white rounded-2xl p-4 border transition-all cursor-pointer select-none flex items-center justify-between shadow-xs hover:shadow-md ${
            isOpen
              ? 'border-indigo-300 ring-2 ring-indigo-500/10 shadow-sm'
              : 'border-gray-100 hover:border-gray-200'
          }`}
        >
          <div className="pr-2">
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              Hôm nay: {daXong}/{tongCong} việc
            </p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              đã xong ({tiLe}%)
            </p>
          </div>
          <CircularProgress percent={tiLe} size={42} strokeWidth={4} color="#6366f1" />
        </div>
      )}

      {/* CHECKLIST POPOVER (bám sát @ui-sample/bảng check list.png) */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-50 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[330px] sm:w-[370px] transition-all animate-in fade-in zoom-in-95 duration-150 ${
            variant === 'header'
              ? align === 'right'
                ? 'right-0 top-full mt-2'
                : 'left-0 top-full mt-2'
              : 'left-full top-0 ml-4 -translate-y-1/4'
          }`}
          style={{ maxWidth: '90vw' }}
        >
          {/* Popover Arrow pointer for sidebar view */}
          {variant === 'sidebar' && (
            <div className="hidden sm:block absolute -left-2 top-10 w-4 h-4 bg-white border-l border-b border-gray-100 transform rotate-45 pointer-events-none" />
          )}

          {/* Header Row */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-base sm:text-[17px] font-bold text-gray-900 tracking-tight">
              Danh sách công việc hôm nay
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition-colors -mr-1"
              aria-label="Đóng popover"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Date subtitle */}
          <p className="text-xs text-gray-500 mb-3">
            Thứ Tư, 21/10/2026
          </p>

          {/* Progress summary & bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#4f46e5] font-bold">
                {daXong}/{tongCong} việc đã hoàn thành
              </span>
              <span className="text-[#4f46e5] font-bold">{tiLe}%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${tiLe}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto overflow-x-hidden pr-1.5 scrollbar-thin">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-start gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer select-none group"
              >
                {/* Round Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border ${
                    task.daHoanThanh
                      ? 'bg-[#10b981] border-[#10b981] text-white shadow-xs'
                      : 'border-gray-300 bg-white group-hover:border-indigo-400'
                  }`}
                  aria-label={task.daHoanThanh ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                >
                  {task.daHoanThanh && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm leading-tight transition-all truncate ${
                        task.daHoanThanh
                          ? 'line-through text-gray-400'
                          : 'font-medium text-gray-800'
                      }`}
                    >
                      {task.tieuDe}
                    </p>

                    {/* Tag Badge */}
                    {task.loaiCongViec === 'CHỦ_ĐỘNG' && !task.daHoanThanh && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-[#e0f2fe] text-[#0284c7] shrink-0">
                        Chủ động
                      </span>
                    )}
                    {task.loaiCongViec === 'BỊ_ĐỘNG' && !task.daHoanThanh && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-[#ffedd5] text-[#ea580c] shrink-0">
                        Bị động
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {task.gioBatDau} - {task.gioKetThuc}
                    {task.diaDiem ? ` | ${task.diaDiem}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Tích vào ô tròn để đánh dấu hoàn thành nhanh
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

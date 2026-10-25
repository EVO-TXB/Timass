import React from 'react';
import { Check, Clock, Utensils, Coffee, MapPin } from 'lucide-react';

/**
 * Parses "HH:mm" string into total minutes from start of day
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * EventCard Component
 * - Tự động tính toán top và height từ gioBatDau và gioKetThuc
 * - Phân loại màu: Chủ động (xanh dương/tím), Bị động/Thiết yếu (cam/pastel), Đã hoàn thành (xanh lá, gạch ngang)
 * - Tương tác e.stopPropagation() trên Checkbox tròn để đổi trạng thái mà không mở modal
 */
export default function EventCard({
  event,
  onToggle,
  onCardClick,
  hourHeight = 60,
  startHour = 6,
}) {
  const {
    id,
    tieuDe,
    gioBatDau,
    gioKetThuc,
    diaDiem,
    loaiCongViec,
    daHoanThanh,
    colorStyle,
  } = event;

  // Calculate coordinates (top, height)
  const startMinutes = parseTimeToMinutes(gioBatDau);
  const endMinutes = parseTimeToMinutes(gioKetThuc);
  const baseMinutes = startHour * 60; // 06:00 = 360 mins

  // top offset from top of grid
  const top = ((startMinutes - baseMinutes) / 60) * hourHeight;
  // duration height with 3px spacing margin
  const durationMinutes = Math.max(endMinutes - startMinutes, 25);
  const height = Math.max(((durationMinutes) / 60) * hourHeight - 3, 30);

  // Determine card style based on state and category
  let cardBgClass = '';
  let borderClass = '';
  let titleColorClass = '';
  let subColorClass = '';

  if (daHoanThanh) {
    // ĐÃ HOÀN THÀNH: Xanh lá, chữ gạch ngang mờ
    cardBgClass = 'bg-[#dcfce7]/90 hover:bg-[#dcfce7]';
    borderClass = 'border-l-4 border-[#10b981]';
    titleColorClass = 'line-through text-gray-500 font-semibold';
    subColorClass = 'text-gray-400';
  } else if (colorStyle === 'purple') {
    // TÍM PASTEL (như thẻ Học TOEIC trong ảnh mẫu)
    cardBgClass = 'bg-[#ddd6fe]/90 hover:bg-[#ddd6fe]';
    borderClass = 'border-l-4 border-[#7c3aed]';
    titleColorClass = 'text-[#2e1065] font-bold';
    subColorClass = 'text-[#5b21b6]';
  } else if (loaiCongViec === 'CHỦ_ĐỘNG') {
    // VIỆC CHỦ ĐỘNG: Xanh dương
    cardBgClass = 'bg-[#bae6fd]/85 hover:bg-[#bae6fd]';
    borderClass = 'border-l-4 border-[#0284c7]';
    titleColorClass = 'text-[#0f172a] font-bold';
    subColorClass = 'text-gray-600';
  } else {
    // VIỆC BỊ ĐỘNG / THIẾT YẾU: Màu cam/pastel
    cardBgClass = 'bg-[#fed7aa]/90 hover:bg-[#fed7aa]';
    borderClass = 'border-l-4 border-[#f97316]';
    titleColorClass = 'text-[#431407] font-bold';
    subColorClass = 'text-[#7c2d12]';
  }

  // Handle click on round checkbox with e.stopPropagation()
  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // KHÔNG kích hoạt sự kiện click mở modal sửa của thẻ cha
    if (onToggle) {
      onToggle(id);
    }
  };

  return (
    <div
      onClick={() => onCardClick && onCardClick(event)}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
      className={`absolute inset-x-1.5 z-10 rounded-xl p-2 sm:p-2.5 transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md select-none flex flex-col justify-between overflow-hidden group ${cardBgClass} ${borderClass}`}
      title={`${tieuDe} (${gioBatDau} - ${gioKetThuc}) - Click để xem chi tiết / sửa`}
    >
      {/* Top Header: Time range + Checkbox/Icon */}
      <div className="flex items-center justify-between gap-1">
        <span className={`text-[11px] font-semibold tracking-tight ${subColorClass}`}>
          {gioBatDau} - {gioKetThuc}
        </span>

        {/* Checkbox Tròn (e.stopPropagation) */}
        <button
          type="button"
          onClick={handleCheckboxClick}
          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
            daHoanThanh
              ? 'bg-[#10b981] text-white shadow-xs'
              : loaiCongViec === 'CHỦ_ĐỘNG'
              ? 'border-2 border-[#0284c7]/60 bg-white/80 hover:border-[#0284c7] hover:bg-white'
              : 'border-2 border-[#ea580c]/60 bg-white/80 hover:border-[#ea580c] hover:bg-white'
          }`}
          aria-label={daHoanThanh ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
        >
          {daHoanThanh && <Check className="w-3 h-3 stroke-[3]" />}
          {!daHoanThanh && loaiCongViec === 'BỊ_ĐỘNG' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
          )}
        </button>
      </div>

      {/* Main Content: Title & Location */}
      <div className="flex-1 my-0.5 min-w-0">
        <h4 className={`text-xs sm:text-[13px] leading-tight line-clamp-2 ${titleColorClass}`}>
          {tieuDe}
        </h4>
        {diaDiem && (
          <p className={`text-[10px] sm:text-[11px] mt-0.5 truncate flex items-center gap-1 ${subColorClass}`}>
            <span className="truncate">{diaDiem}</span>
          </p>
        )}
      </div>

      {/* Subtle indicator for very compact cards */}
      {height < 45 && diaDiem && (
        <div className="text-[10px] text-gray-500 truncate hidden">
          {diaDiem}
        </div>
      )}
    </div>
  );
}

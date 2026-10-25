import React, { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';

/**
 * Component Toast Thông báo sự kiện / Nhắc việc sắp đến giờ
 * Bám sát thiết kế pixel-perfect từ @ui-sample/Thông báo sự kiện.png
 * 
 * Props:
 * - isOpen: boolean - trạng thái hiển thị
 * - onClose: function - callback khi tắt toast
 * - onViewDetail: function - callback khi bấm "Xem chi tiết"
 * - notification: object { id, maCongViec, tieuDe, thoiGian, diaDiem, nhacNhoTruoc }
 * - autoClose: boolean - tự động ẩn sau khoảng thời gian (mặc định true)
 * - duration: number - thời gian hiển thị (mặc định 9000ms = 9 giây)
 */
export default function NotificationToast({
  isOpen = false,
  onClose,
  onViewDetail,
  notification = {},
  autoClose = true,
  duration = 9000,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Auto-dismiss timer: tự động đóng sau duration ms, tạm dừng khi người dùng hover chuột
  useEffect(() => {
    if (!isOpen || !autoClose || isHovered) return;

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, autoClose, duration, onClose, isHovered, notification?.tieuDe, notification?.thoiGian, notification?.id]);

  if (!isOpen) return null;

  const {
    tieuDe = 'Công việc sắp tới',
    thoiGian = '08:00',
    diaDiem = 'Theo lịch trình',
    nhacNhoTruoc = '15 phút nữa',
  } = notification || {};

  return (
    <div 
      className="fixed top-18 sm:top-20 right-4 sm:right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-300"
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-gray-100 p-4 sm:p-4.5 w-[330px] sm:w-[370px] select-none hover:shadow-[0_20px_48px_rgba(0,0,0,0.18)] transition-all overflow-hidden relative">
        <div className="flex items-start gap-3.5">
          {/* Cột trái: Icon đồng hồ chuông màu cam trên nền cam pastel (peach/coral) */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#ffedd5] text-[#f97316] flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>

          {/* Cột phải: Thông tin nhắc việc */}
          <div className="flex-1 min-w-0 pr-0.5">
            {/* Dòng tiêu đề nhỏ kèm chấm cam + Nút đóng */}
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shrink-0 animate-pulse" />
                <span>Timass • Nhắc nhở sắp đến giờ</span>
              </p>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition-colors cursor-pointer"
                aria-label="Đóng thông báo"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Tên môn học / sự kiện nổi bật */}
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mt-1 truncate tracking-tight" title={tieuDe}>
              {tieuDe}
            </h4>

            {/* Chi tiết thời gian và địa điểm */}
            <p className="text-xs sm:text-[13px] text-gray-600 mt-0.5 leading-snug">
              {nhacNhoTruoc.includes('Bắt đầu') ? (
                <span className="text-emerald-600 font-semibold">{nhacNhoTruoc}</span>
              ) : (
                <>Bắt đầu sau <span className="font-semibold text-amber-600">{nhacNhoTruoc}</span></>
              )}{' '}
              ({thoiGian}{diaDiem ? ` tại ${diaDiem}` : ''})
            </p>

            {/* Nút Xem chi tiết ở góc dưới phải */}
            <div className="mt-2.5 text-right">
              <button
                type="button"
                onClick={onViewDetail}
                className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        {/* Thanh đếm ngược thời gian tự đóng (Progress bar) */}
        {autoClose && !isHovered && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-[#f97316] w-full"
            style={{
              animation: `shrinkWidth ${duration}ms linear forwards`,
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

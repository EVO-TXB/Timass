import React from 'react';
import { X, CalendarSync } from 'lucide-react';

/**
 * RecurringConfirmDialog Component
 * Bám sát thiết kế @ui-sample/Thông báo lựa chọn chỉnh sửa.png
 * 
 * Quy trình xử lý (State Machine Flow):
 * - Lựa chọn A ("Chỉ sự kiện này"): Cập nhật riêng bản ghi hiện tại, gán cờ tách chuỗi (apDungTatCa: false, tachChuoi: true).
 * - Lựa chọn B ("Tất cả sự kiện trong chuỗi"): Gửi kèm maNhomLapLai và cập nhật đồng loạt toàn bộ chuỗi (apDungTatCa: true).
 */
export default function RecurringConfirmDialog({
  isOpen,
  onClose,
  onApplySingle,
  onApplySeries,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[460px] p-6 sm:p-7 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#eff1fe] text-[#3b43c6] flex items-center justify-center shrink-0">
              <CalendarSync className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Chỉnh sửa công việc lặp lại
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer"
            aria-label="Đóng thông báo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description Text */}
        <p className="text-sm text-gray-600 mt-3.5 mb-6 leading-relaxed">
          Công việc này nằm trong một chuỗi lịch trình lặp lại hàng tuần. Bạn muốn áp dụng thay đổi này như thế nào?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Lựa chọn A: Chỉ sự kiện này */}
          <button
            type="button"
            onClick={onApplySingle}
            className="flex-1 py-3 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold text-[#3b43c6] hover:bg-gray-50 active:bg-gray-100 transition-colors text-center cursor-pointer shadow-xs"
          >
            Chỉ sự kiện này
          </button>

          {/* Lựa chọn B: Tất cả sự kiện trong chuỗi */}
          <button
            type="button"
            onClick={onApplySeries}
            className="flex-1 py-3 px-3.5 rounded-xl bg-[#3b43c6] hover:bg-[#3138b6] active:bg-[#282d96] text-white text-sm font-semibold shadow-xs transition-colors text-center cursor-pointer"
          >
            Tất cả sự kiện trong chuỗi
          </button>
        </div>
      </div>
    </div>
  );
}

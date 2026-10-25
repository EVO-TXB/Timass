import React from 'react';
import { X, Trash2 } from 'lucide-react';

/**
 * RecurringDeleteDialog Component
 * Bám sát thiết kế @ui-sample/Thông báo lựa chọn chỉnh sửa.png
 * Dành riêng cho nghiệp vụ xóa công việc lặp lại:
 * - Lựa chọn 1: "Chỉ xóa công việc này" (giữ nguyên các tuần/ngày khác trong chuỗi)
 * - Lựa chọn 2: "Xóa toàn bộ chuỗi lặp lại" (xóa tất cả công việc có chung maNhomLapLai / recurringGroupId)
 */
export default function RecurringDeleteDialog({
  isOpen,
  onClose,
  onDeleteSingle,
  onDeleteSeries,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[460px] p-6 sm:p-7 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Xóa công việc lặp lại
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
          Công việc này nằm trong một chuỗi lịch trình lặp lại hàng tuần. Bạn muốn thực hiện xóa như thế nào?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Lựa chọn 1: Chỉ xóa công việc này */}
          <button
            type="button"
            onClick={() => {
              onDeleteSingle();
              onClose();
            }}
            className="flex-1 py-3 px-3.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-center cursor-pointer"
          >
            Chỉ xóa công việc này
          </button>

          {/* Lựa chọn 2: Xóa toàn bộ chuỗi lặp lại */}
          <button
            type="button"
            onClick={() => {
              onDeleteSeries();
              onClose();
            }}
            className="flex-1 py-3 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold shadow-xs transition-colors text-center cursor-pointer"
          >
            Xóa toàn bộ chuỗi lặp lại
          </button>
        </div>
      </div>
    </div>
  );
}

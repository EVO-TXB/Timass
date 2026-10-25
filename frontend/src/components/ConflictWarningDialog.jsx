import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ConflictWarningDialog Component
 * Hiển thị popup cảnh báo xác nhận khi người dùng bấm Lưu công việc trong trạng thái trùng lịch.
 * 
 * Nghiệp vụ:
 * - Thông báo: "Lịch trình này đang bị trùng khung giờ với [Tên công việc] ([Giờ bắt đầu] - [Giờ kết thúc]). Bạn có chắc chắn vẫn muốn lưu không?"
 * - Nút 1: "Xem lại khung giờ" (đóng popup, người dùng tiếp tục chỉnh sửa)
 * - Nút 2: "Vẫn tiếp tục lưu" (bỏ qua cảnh báo, tiến hành lưu công việc)
 */
export default function ConflictWarningDialog({
  isOpen,
  conflictingTask = null,
  onClose,
  onProceedSave,
}) {
  if (!isOpen) return null;

  const taskTitle = conflictingTask?.tieuDe || 'công việc khác';
  const taskTime =
    conflictingTask?.gioBatDau && conflictingTask?.gioKetThuc
      ? `${conflictingTask.gioBatDau} - ${conflictingTask.gioKetThuc}`
      : '';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[460px] p-6 sm:p-7 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with warning icon & Close button */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer"
            aria-label="Đóng cảnh báo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mt-4">
          Cảnh báo trùng lịch trình
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          Lịch trình này đang bị trùng khung giờ với{' '}
          <span className="font-semibold text-gray-900">"{taskTitle}"</span>
          {taskTime && (
            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md ml-1 inline-block">
              {taskTime}
            </span>
          )}
          . Bạn có chắc chắn vẫn muốn lưu không?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Nút 1: Xem lại khung giờ */}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-center cursor-pointer"
          >
            Xem lại khung giờ
          </button>

          {/* Nút 2: Vẫn tiếp tục lưu */}
          <button
            type="button"
            onClick={() => {
              onProceedSave();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold shadow-xs transition-colors text-center cursor-pointer"
          >
            Vẫn tiếp tục lưu
          </button>
        </div>
      </div>
    </div>
  );
}

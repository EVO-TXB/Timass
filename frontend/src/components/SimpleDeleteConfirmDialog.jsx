import React from 'react';
import { X, AlertCircle } from 'lucide-react';

/**
 * SimpleDeleteConfirmDialog Component
 * Dialog xác nhận xóa cho công việc đơn lẻ.
 */
export default function SimpleDeleteConfirmDialog({
  isOpen,
  taskTitle = '',
  onClose,
  onConfirmDelete,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[420px] p-6 sm:p-7 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mt-4">
          Xác nhận xóa công việc
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          Bạn có chắc chắn muốn xóa công việc{' '}
          {taskTitle && (
            <span className="font-semibold text-gray-900">"{taskTitle}"</span>
          )}{' '}
          này không? Hành động này không thể hoàn tác.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors text-center cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold shadow-xs transition-colors text-center cursor-pointer"
          >
            Xóa công việc
          </button>
        </div>
      </div>
    </div>
  );
}

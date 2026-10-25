import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Clock, MapPin, Tag } from 'lucide-react';

export default function TaskModal({ task, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    tieuDe: '',
    gioBatDau: '08:00',
    gioKetThuc: '10:00',
    diaDiem: '',
    loaiCongViec: 'CHỦ_ĐỘNG',
    thu: 'T2',
    daHoanThanh: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        tieuDe: task.tieuDe || '',
        gioBatDau: task.gioBatDau || '08:00',
        gioKetThuc: task.gioKetThuc || '10:00',
        diaDiem: task.diaDiem || '',
        loaiCongViec: task.loaiCongViec || 'CHỦ_ĐỘNG',
        thu: task.thu || 'T2',
        daHoanThanh: Boolean(task.daHoanThanh),
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tieuDe.trim()) {
      alert('Vui lòng nhập tiêu đề công việc');
      return;
    }
    onSave({
      ...task,
      ...formData,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc muốn xóa công việc "${task.tieuDe}"?`)) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]" />
            <h3 className="text-base font-bold text-gray-900">
              Chi tiết công việc
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tiêu đề */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Tiêu đề công việc
            </label>
            <input
              type="text"
              value={formData.tieuDe}
              onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder="Nhập tên công việc..."
              required
            />
          </div>

          {/* Thời gian: Bắt đầu & Kết thúc */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={formData.gioBatDau}
                onChange={(e) => setFormData({ ...formData, gioBatDau: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={formData.gioKetThuc}
                onChange={(e) => setFormData({ ...formData, gioKetThuc: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                required
              />
            </div>
          </div>

          {/* Thứ trong tuần & Địa điểm */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Thứ trong tuần
              </label>
              <select
                value={formData.thu}
                onChange={(e) => setFormData({ ...formData, thu: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
              >
                <option value="T2">Thứ 2 (12/10)</option>
                <option value="T3">Thứ 3 (13/10)</option>
                <option value="T4">Thứ 4 (14/10)</option>
                <option value="T5">Thứ 5 (15/10)</option>
                <option value="T6">Thứ 6 (16/10)</option>
                <option value="T7">Thứ 7 (17/10)</option>
                <option value="CN">Chủ nhật (18/10)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                Địa điểm
              </label>
              <input
                type="text"
                value={formData.diaDiem}
                onChange={(e) => setFormData({ ...formData, diaDiem: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Phòng học, Online..."
              />
            </div>
          </div>

          {/* Phân loại công việc */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              Phân loại công việc
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, loaiCongViec: 'CHỦ_ĐỘNG' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  formData.loaiCongViec === 'CHỦ_ĐỘNG'
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ● Việc Chủ động (Xanh)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, loaiCongViec: 'BỊ_ĐỘNG' })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  formData.loaiCongViec === 'BỊ_ĐỘNG'
                    ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ● Thiết yếu / Bị động (Cam)
              </button>
            </div>
          </div>

          {/* Trạng thái hoàn thành */}
          <div className="pt-1">
            <label 
              onClick={() => setFormData({ ...formData, daHoanThanh: !formData.daHoanThanh })}
              className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  formData.daHoanThanh
                    ? 'bg-emerald-500 text-white'
                    : 'border-2 border-gray-300 bg-white'
                }`}
              >
                {formData.daHoanThanh && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-gray-700">
                Đánh dấu đã hoàn thành
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa việc</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

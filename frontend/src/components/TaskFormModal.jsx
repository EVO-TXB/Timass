import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, MapPin, Calendar, Check, Trash2 } from 'lucide-react';
import RecurringConfirmDialog from './RecurringConfirmDialog';
import RecurringDeleteDialog from './RecurringDeleteDialog';
import SimpleDeleteConfirmDialog from './SimpleDeleteConfirmDialog';
import { checkTimeConflict } from '../utils/timeConflict';
import { useTasks, NORMALIZE_TO_UI_DAY } from '../context/TaskContext';
import { getDateForWeekday, parseDateYMD, getMondayOfWeek, formatDateYMD } from '../utils/dateUtils';
import congViecService from '../services/congViecService';

const WEEKDAYS = [
  { key: 'T2', label: 'T2' },
  { key: 'T3', label: 'T3' },
  { key: 'T4', label: 'T4' },
  { key: 'T5', label: 'T5' },
  { key: 'T6', label: 'T6' },
  { key: 'T7', label: 'T7' },
  { key: 'CN', label: 'CN' },
];

/**
 * TaskFormModal Component
 * Bám sát thiết kế @ui-sample/MODAL THÊM & CHỈNH SỬA CÔNG VIỆC (TASK MODAL).png
 * 
 * VẤN ĐỀ 1: Đồng bộ hóa chuẩn form state khi mở modal sửa chuỗi lặp.
 * VẤN ĐỀ 2: Chuẩn hóa payload, cập nhật phản ứng nhanh (reactivity) và gọi onDataReload()
 *           để các thứ mới thêm vào chuỗi (VD: Thứ 6) hiển thị tức thì trên lưới lịch.
 */
export default function TaskFormModal({
  isOpen,
  mode = 'create',
  task = null,
  congViecDangSua: propCongViecDangSua = null,
  tasks: propTasks,
  onClose,
  onCreate,
  onUpdateSingle,
  onUpdateSeries,
  onDelete,
  onDeleteSeries,
  onDataReload,
}) {
  const taskContext = useTasks();
  const existingTasks = propTasks || taskContext?.tasks || [];
  const currentWeek = taskContext?.currentWeek;
  const currentYear = taskContext?.currentYear;

  // Đối tượng công việc đang được thao tác (hỗ trợ cả prop task và congViecDangSua)
  const congViecDangSua = propCongViecDangSua || task;

  // Form states
  const [tieuDe, setTieuDe] = useState('');
  const [loaiCongViec, setLoaiCongViec] = useState('CHỦ_ĐỘNG'); // 'CHỦ_ĐỘNG' | 'BỊ_ĐỘNG'
  const [gioBatDau, setGioBatDau] = useState('08:00');
  const [gioKetThuc, setGioKetThuc] = useState('10:00');
  const [diaDiem, setDiaDiem] = useState('');
  const [thu, setThu] = useState('T4'); // Mặc định Thứ 4 (Hôm nay)

  // Lặp lại hàng tuần (coLapLai, danhSachThu, ngayBatDauLap, ngayKetThucLap)
  const [coLapLai, setCoLapLai] = useState(false);
  const [danhSachThu, setDanhSachThu] = useState(['T2', 'T4', 'T6']);
  const [ngayBatDauLap, setNgayBatDauLap] = useState('2026-10-12');
  const [ngayKetThucLap, setNgayKetThucLap] = useState('2026-12-30');

  // Dialog states
  const [showRecurringEditDialog, setShowRecurringEditDialog] = useState(false);
  const [showRecurringDeleteDialog, setShowRecurringDeleteDialog] = useState(false);
  const [showSimpleDeleteDialog, setShowSimpleDeleteDialog] = useState(false);

  // Lưu tạm payload khi cần xác nhận qua dialog (State Machine Flow)
  const [pendingFormData, setPendingFormData] = useState(null);

  // VẤN ĐỀ 1: Khởi tạo và khôi phục State từ congViecDangSua
  useEffect(() => {
    if (congViecDangSua && mode === 'edit') {
      setTieuDe(congViecDangSua.tieuDe || '');
      setLoaiCongViec(congViecDangSua.loaiCongViec || 'CHỦ_ĐỘNG');
      setGioBatDau(congViecDangSua.gioBatDau || '08:00');
      setGioKetThuc(congViecDangSua.gioKetThuc || '10:00');
      setDiaDiem(congViecDangSua.diaDiem || '');
      setThu(congViecDangSua.thu || 'T4');

      // 1. Nhận diện chuỗi lặp nếu có cờ coLapLai hoặc có mã nhóm lặp
      const isRecurring = Boolean(
        congViecDangSua.coLapLai ||
        congViecDangSua.maNhomLapLai ||
        congViecDangSua.isRecurring ||
        congViecDangSua.recurringGroupId
      );
      setCoLapLai(isRecurring);

      // 2. Khôi phục mảng các thứ trong tuần đã chọn (VD: ['T2', 'T4'] hoặc ['THU_2', 'THU_4'])
      // Nếu chưa có danhSachThu, tự suy luận thứ từ ngày hiện tại của công việc
      let initialDays = [];
      if (congViecDangSua.danhSachThu && congViecDangSua.danhSachThu.length > 0) {
        initialDays = congViecDangSua.danhSachThu.map((d) => NORMALIZE_TO_UI_DAY[d] || d);
      } else if (congViecDangSua.recurringDays && congViecDangSua.recurringDays.length > 0) {
        initialDays = congViecDangSua.recurringDays.map((d) => NORMALIZE_TO_UI_DAY[d] || d);
      } else {
        const dayOfWeekMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const dateVal = congViecDangSua.ngayThucHien || congViecDangSua.ngay;
        const currentDayOfWeek = dateVal
          ? dayOfWeekMap[new Date(dateVal).getDay()]
          : (congViecDangSua.thu || 'T4');
        initialDays = [currentDayOfWeek];
      }
      setDanhSachThu(initialDays);

      // 3. Khôi phục khoảng ngày áp dụng
      const currentMondayStr = formatDateYMD(getMondayOfWeek(currentWeek, currentYear));
      setNgayBatDauLap(
        congViecDangSua.ngayBatDauLap ||
        congViecDangSua.ngayBatDau ||
        congViecDangSua.startDate ||
        currentMondayStr ||
        '2026-10-12'
      );
      setNgayKetThucLap(
        congViecDangSua.ngayKetThucLap ||
        congViecDangSua.ngayKetThuc ||
        congViecDangSua.endDate ||
        '2026-12-30'
      );
    } else {
      // Giá trị mặc định khi tạo mới
      setTieuDe('');
      setLoaiCongViec('CHỦ_ĐỘNG');
      setGioBatDau('08:00');
      setGioKetThuc('10:00');
      setDiaDiem('');
      setThu('T4');
      setCoLapLai(false);
      setDanhSachThu(['T2', 'T4', 'T6']);
      setNgayBatDauLap('2026-10-12');
      setNgayKetThucLap('2026-12-30');
    }

    // Reset các dialog con
    setShowRecurringEditDialog(false);
    setShowRecurringDeleteDialog(false);
    setShowSimpleDeleteDialog(false);
    setPendingFormData(null);
  }, [congViecDangSua, task, mode, isOpen]);

  // Kiểm tra trùng lịch real-time (Time Conflict Detection)
  const conflictResult = useMemo(() => {
    if (!isOpen) return { hasConflict: false, isInvalidTime: false, conflictingTask: null, conflictMessage: '' };

    const currentEvent = {
      id: mode === 'edit' ? (congViecDangSua?.id ?? congViecDangSua?.maCongViec) : null,
      maCongViec: mode === 'edit' ? (congViecDangSua?.maCongViec ?? congViecDangSua?.id) : null,
      recurringGroupId: mode === 'edit' ? (congViecDangSua?.recurringGroupId ?? congViecDangSua?.maNhomLapLai) : null,
      maNhomLapLai: mode === 'edit' ? (congViecDangSua?.maNhomLapLai ?? congViecDangSua?.recurringGroupId) : null,
      tieuDe,
      gioBatDau,
      gioKetThuc,
      thu,
      isRecurring: coLapLai,
      coLapLai,
      recurringDays: coLapLai ? danhSachThu : [thu],
      danhSachThu: coLapLai ? danhSachThu : [thu],
    };

    return checkTimeConflict(currentEvent, existingTasks);
  }, [isOpen, mode, congViecDangSua, tieuDe, gioBatDau, gioKetThuc, thu, coLapLai, danhSachThu, existingTasks]);

  if (!isOpen) return null;

  // Toggle thứ trong mảng danhSachThu
  const toggleWeekday = (dayKey) => {
    setDanhSachThu((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  // VẤN ĐỀ 2: Chuẩn hóa payload gửi đi (Tính toán chính xác ngày thực hiện khi đổi thứ)
  const buildPayload = () => {
    const baseDate = congViecDangSua?.ngayThucHien || congViecDangSua?.ngay;
    const computedNgayThucHien = getDateForWeekday(thu, baseDate, currentWeek, currentYear);

    return {
      id: congViecDangSua?.id,
      maCongViec: congViecDangSua?.maCongViec || congViecDangSua?.id,
      tieuDe: tieuDe.trim(),
      gioBatDau,
      gioKetThuc,
      diaDiem: diaDiem.trim(),
      loaiCongViec,
      thu,
      ngayThucHien: computedNgayThucHien,
      ngay: computedNgayThucHien,
      coLapLai,
      isRecurring: coLapLai,
      danhSachThu: coLapLai ? danhSachThu : [thu],
      recurringDays: coLapLai ? danhSachThu : [thu],
      ngayBatDau: coLapLai ? ngayBatDauLap : computedNgayThucHien,
      ngayKetThuc: coLapLai ? ngayKetThucLap : computedNgayThucHien,
      ngayBatDauLap: coLapLai ? ngayBatDauLap : computedNgayThucHien,
      ngayKetThucLap: coLapLai ? ngayKetThucLap : computedNgayThucHien,
      startDate: coLapLai ? ngayBatDauLap : computedNgayThucHien,
      endDate: coLapLai ? ngayKetThucLap : computedNgayThucHien,
      maNhomLapLai: congViecDangSua?.maNhomLapLai || congViecDangSua?.recurringGroupId || null,
      recurringGroupId: congViecDangSua?.recurringGroupId || congViecDangSua?.maNhomLapLai || null,
    };
  };

  // Submit form chính
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Chặn cứng nếu trùng lịch hoặc giờ không hợp lệ
    if (conflictResult.hasConflict || conflictResult.isInvalidTime) {
      return;
    }

    if (!tieuDe.trim()) {
      alert('Vui lòng nhập tiêu đề công việc');
      return;
    }

    const payload = buildPayload();
    const isTaskRecurring = Boolean(
      congViecDangSua?.coLapLai ||
      congViecDangSua?.maNhomLapLai ||
      congViecDangSua?.isRecurring ||
      congViecDangSua?.recurringGroupId
    );

    // 2. Nếu chuyển từ đơn lẻ -> chuỗi lặp lại hàng tuần (người dùng bật lặp lại và chọn thứ)
    if (mode === 'edit' && !isTaskRecurring && payload.coLapLai) {
      if (onUpdateSeries) {
        const newGroupId = `rec_${Date.now()}`;
        await onUpdateSeries(newGroupId, {
          ...congViecDangSua,
          ...payload,
          isConvertingFromSingle: true,
          originalSingleId: congViecDangSua?.id || congViecDangSua?.maCongViec,
          maNhomLapLai: newGroupId,
          recurringGroupId: newGroupId,
          apDungChoTatCa: true,
          apDungTatCa: true,
        });
      }
      if (onDataReload) {
        await onDataReload(true);
      }
      onClose();
      return;
    }

    // 3. Nếu là sự kiện chuỗi lặp từ trước
    if (mode === 'edit' && isTaskRecurring) {
      // Nếu tắt lặp lại -> chuyển thành đơn lẻ
      if (!payload.coLapLai) {
        const singlePayload = {
          ...congViecDangSua,
          ...payload,
          thu: payload.thu,
          ngayThucHien: payload.ngayThucHien,
          ngay: payload.ngay,
          coLapLai: false,
          isRecurring: false,
          maNhomLapLai: null,
          recurringGroupId: null,
          tachChuoi: true,
          apDungChoTatCa: false,
        };
        if (onUpdateSingle) {
          await onUpdateSingle(singlePayload);
        }
        if (onDataReload) {
          await onDataReload(true);
        }
        onClose();
        return;
      }

      // Giữ nguyên chuỗi lặp -> mở RecurringConfirmDialog hỏi áp dụng cho sự kiện này hay cả chuỗi
      setPendingFormData(payload);
      setShowRecurringEditDialog(true);
      return;
    }

    // 4. Nếu là sửa sự kiện đơn lẻ
    if (mode === 'edit') {
      const singlePayload = {
        ...congViecDangSua,
        ...payload,
        thu: payload.thu,
        ngayThucHien: payload.ngayThucHien,
        ngay: payload.ngay,
        apDungChoTatCa: false,
        apDungTatCa: false,
      };

      if (onUpdateSingle) {
        await onUpdateSingle(singlePayload);
      }

      if (onDataReload) {
        await onDataReload(true);
      }

      onClose();
      return;
    }

    // 4. Nếu là thêm mới
    if (onCreate) {
      await onCreate(payload);
    }

    if (onDataReload) {
      await onDataReload(true);
    }

    onClose();
  };

  // VẤN ĐỀ 2 - Bước 2: Xử lý lựa chọn trong RecurringConfirmDialog
  // Lựa chọn A: "Chỉ sự kiện này"
  const handleApplySingleEdit = async () => {
    if (congViecDangSua && pendingFormData) {
      const singlePayload = {
        ...congViecDangSua,
        ...pendingFormData,
        thu: pendingFormData.thu,
        ngayThucHien: pendingFormData.ngayThucHien,
        ngay: pendingFormData.ngay,
        apDungChoTatCa: false,
        apDungTatCa: false,
        tachChuoi: true,
        coLapLai: false,
        isRecurring: false,
        maNhomLapLai: null,
        recurringGroupId: null,
      };

      if (onUpdateSingle) {
        await onUpdateSingle(singlePayload);
      }

      if (onDataReload) {
        await onDataReload(true);
      }

      setShowRecurringEditDialog(false);
      onClose();
      setPendingFormData(null);
    }
  };

  // Lựa chọn B: "Tất cả sự kiện trong chuỗi"
  const handleApplySeriesEdit = async () => {
    const groupId =
      congViecDangSua?.maNhomLapLai ??
      congViecDangSua?.recurringGroupId ??
      pendingFormData?.maNhomLapLai ??
      pendingFormData?.recurringGroupId;

    if (groupId && pendingFormData) {
      const seriesPayload = {
        ...pendingFormData,
        maNhomLapLai: groupId,
        recurringGroupId: groupId,
        apDungChoTatCa: true,
        apDungTatCa: true,
      };

      if (onUpdateSeries) {
        await onUpdateSeries(groupId, seriesPayload);
      }

      if (onDataReload) {
        await onDataReload(true);
      }

      setShowRecurringEditDialog(false);
      onClose();
      setPendingFormData(null);
    }
  };

  // Xử lý sự kiện bấm nút "Xóa công việc"
  const handleDeleteClick = () => {
    const isTaskRecurring = Boolean(
      congViecDangSua?.coLapLai ||
      congViecDangSua?.maNhomLapLai ||
      congViecDangSua?.isRecurring ||
      congViecDangSua?.recurringGroupId
    );

    if (isTaskRecurring) {
      setShowRecurringDeleteDialog(true);
    } else {
      setShowSimpleDeleteDialog(true);
    }
  };

  // Xác nhận xóa sự kiện đơn lẻ
  const handleConfirmSimpleDelete = async () => {
    const taskId = congViecDangSua?.id ?? congViecDangSua?.maCongViec;
    setShowSimpleDeleteDialog(false);
    onClose();

    if (taskId && onDelete) {
      await onDelete(taskId);
    }

    if (onDataReload) {
      await onDataReload(true);
    }
  };

  // Xác nhận: "Chỉ xóa công việc này" (thuộc chuỗi lặp)
  const handleDeleteSingleInstance = async () => {
    const taskId = congViecDangSua?.id ?? congViecDangSua?.maCongViec;
    setShowRecurringDeleteDialog(false);
    onClose();

    if (taskId && onDelete) {
      await onDelete(taskId);
    }

    if (onDataReload) {
      await onDataReload(true);
    }
  };

  // Xác nhận: "Xóa toàn bộ chuỗi lặp lại"
  const handleDeleteEntireSeries = async () => {
    const groupId = congViecDangSua?.maNhomLapLai ?? congViecDangSua?.recurringGroupId;
    const taskId = congViecDangSua?.id ?? congViecDangSua?.maCongViec;

    setShowRecurringDeleteDialog(false);
    onClose();

    if (onDeleteSeries) {
      await onDeleteSeries(groupId, taskId);
    } else if (taskId && onDelete) {
      await onDelete(taskId);
    }

    if (onDataReload) {
      await onDataReload(true);
    }
  };

  const isSaveDisabled = conflictResult.hasConflict || conflictResult.isInvalidTime;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-[530px] p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto scrollbar-thin animate-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Row: Title & Close Button */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#181848] tracking-tight">
              {mode === 'edit' ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Đóng modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 1. Tiêu đề công việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Tiêu đề công việc
              </label>
              <input
                type="text"
                value={tieuDe}
                onChange={(e) => setTieuDe(e.target.value)}
                placeholder="Nhập tên công việc hoặc môn học..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all"
                required
              />
            </div>

            {/* 2. Loại công việc (Radio cards: Chủ động vs Thiết yếu / Bị động) */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Loại công việc
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Option: Chủ động */}
                <div
                  onClick={() => setLoaiCongViec('CHỦ_ĐỘNG')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    loaiCongViec === 'CHỦ_ĐỘNG'
                      ? 'bg-[#dbeafe]/70 border-[#60a5fa] text-[#1e3a8a] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      loaiCongViec === 'CHỦ_ĐỘNG'
                        ? 'bg-[#3b82f6] text-white shadow-xs'
                        : 'border border-gray-300'
                    }`}
                  >
                    {loaiCongViec === 'CHỦ_ĐỘNG' && (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-sm font-semibold">Chủ động</span>
                </div>

                {/* Option: Thiết yếu / Bị động */}
                <div
                  onClick={() => setLoaiCongViec('BỊ_ĐỘNG')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    loaiCongViec === 'BỊ_ĐỘNG'
                      ? 'bg-[#ffedd5] border-[#fb923c] text-[#7c2d12] shadow-xs'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      loaiCongViec === 'BỊ_ĐỘNG'
                        ? 'bg-[#ea580c]'
                        : 'bg-[#f97316]'
                    }`}
                  />
                  <span className="text-sm font-semibold">Thiết yếu / Bị động</span>
                </div>
              </div>
            </div>

            {/* 3. Thứ trong tuần (nếu không lặp lại) */}
            {!coLapLai && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Thứ trong tuần
                </label>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {WEEKDAYS.map((w) => {
                    const isSelected = thu === w.key;
                    return (
                      <button
                        key={w.key}
                        type="button"
                        onClick={() => setThu(w.key)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#5046e5] text-white shadow-xs scale-105'
                            : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Thời gian: Bắt đầu & Kết thúc */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Thời gian
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Giờ bắt đầu */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#4f46e5] focus-within:ring-2 focus-within:ring-[#4f46e5]/15 transition-all bg-white">
                  <span className="px-3 py-2.5 bg-gray-50/80 border-r border-gray-200 text-xs font-medium text-gray-600 select-none">
                    Bắt đầu
                  </span>
                  <input
                    type="time"
                    value={gioBatDau}
                    onChange={(e) => setGioBatDau(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm text-gray-900 outline-none bg-transparent"
                    required
                  />
                  <Clock className="w-4 h-4 text-gray-400 mr-3 shrink-0 pointer-events-none" />
                </div>

                {/* Giờ kết thúc */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#4f46e5] focus-within:ring-2 focus-within:ring-[#4f46e5]/15 transition-all bg-white">
                  <span className="px-3 py-2.5 bg-gray-50/80 border-r border-gray-200 text-xs font-medium text-gray-600 select-none">
                    Kết thúc
                  </span>
                  <input
                    type="time"
                    value={gioKetThuc}
                    onChange={(e) => setGioKetThuc(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm text-gray-900 outline-none bg-transparent"
                    required
                  />
                  <Clock className="w-4 h-4 text-gray-400 mr-3 shrink-0 pointer-events-none" />
                </div>
              </div>

              {/* HỘP CẢNH BÁO LỖI TRÙNG LỊCH MÀU ĐỎ (HARD CONFLICT PREVENTION) */}
              {conflictResult.hasConflict && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm flex gap-2 items-start mt-2.5 animate-in fade-in duration-200">
                  <div className="flex-1 font-medium leading-relaxed">
                    {conflictResult.conflictMessage}
                  </div>
                </div>
              )}

              {/* Cảnh báo giờ không hợp lệ */}
              {conflictResult.isInvalidTime && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm flex gap-2 items-start mt-2.5 animate-in fade-in duration-200">
                  <div className="flex-1 font-medium leading-relaxed">
                    ⚠️ {conflictResult.conflictMessage}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Địa điểm / Phòng học */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Địa điểm / Phòng học
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={diaDiem}
                  onChange={(e) => setDiaDiem(e.target.value)}
                  placeholder="Nhập địa điểm, phòng học (Ví dụ: A3-402)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 bg-white focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 outline-none transition-all"
                />
              </div>
            </div>

            {/* 6. Lặp lại hàng tuần (Switch toggle & Weekday buttons & Date range) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-3">
                <label
                  onClick={() => setCoLapLai(!coLapLai)}
                  className="text-sm font-semibold text-gray-800 cursor-pointer select-none"
                >
                  Lặp lại hàng tuần
                </label>
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setCoLapLai(!coLapLai)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 focus:outline-none ${
                    coLapLai ? 'bg-[#5046e5]' : 'bg-gray-200'
                  }`}
                  aria-label="Bật tắt lặp lại hàng tuần"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      coLapLai ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sub-section: Chỉ hiện khi toggle bật ON */}
              {coLapLai && (
                <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                  {/* Round weekday buttons: [T2] [T3] [T4] [T5] [T6] [T7] [CN] */}
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {WEEKDAYS.map((w) => {
                      const isSelected = danhSachThu.includes(w.key);
                      return (
                        <button
                          key={w.key}
                          type="button"
                          onClick={() => toggleWeekday(w.key)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#5046e5] text-white shadow-xs scale-105'
                              : 'border border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Khoảng ngày lặp lại (Bắt đầu - Đến ngày) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-semibold text-gray-700 mb-1">
                        Thời gian lặp lại
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="date"
                          value={ngayBatDauLap}
                          onChange={(e) => setNgayBatDauLap(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 bg-white focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] outline-none"
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-gray-700 mb-1">
                        Đến ngày
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="date"
                          value={ngayKetThucLap}
                          onChange={(e) => setNgayKetThucLap(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 bg-white focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] outline-none"
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
              {/* Nút Xóa công việc nếu ở chế độ Edit */}
              {mode === 'edit' ? (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa công việc</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>

                {/* NÚT LƯU CÔNG VIỆC: BỊ KHÓA CỨNG KHI TRÙNG LỊCH */}
                <button
                  type="submit"
                  disabled={isSaveDisabled}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold shadow-xs transition-all ${
                    isSaveDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300 shadow-none'
                      : 'bg-[#fa8b8b] hover:bg-[#f87171] active:bg-[#ef4444] text-white cursor-pointer'
                  }`}
                  title={isSaveDisabled ? 'Vui lòng chọn khung giờ không bị trùng lịch' : ''}
                >
                  {mode === 'edit' ? 'Lưu thay đổi' : 'Lưu công việc'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 1. Dialog xác nhận sửa chuỗi lặp lại */}
      <RecurringConfirmDialog
        isOpen={showRecurringEditDialog}
        onClose={() => {
          setShowRecurringEditDialog(false);
          setPendingFormData(null);
        }}
        onApplySingle={handleApplySingleEdit}
        onApplySeries={handleApplySeriesEdit}
      />

      {/* 2. Dialog xác nhận xóa chuỗi lặp lại (Chỉ xóa công việc này vs Xóa toàn bộ chuỗi) */}
      <RecurringDeleteDialog
        isOpen={showRecurringDeleteDialog}
        onClose={() => setShowRecurringDeleteDialog(false)}
        onDeleteSingle={handleDeleteSingleInstance}
        onDeleteSeries={handleDeleteEntireSeries}
      />

      {/* 3. Dialog xác nhận xóa sự kiện đơn lẻ */}
      <SimpleDeleteConfirmDialog
        isOpen={showSimpleDeleteDialog}
        taskTitle={congViecDangSua?.tieuDe}
        onClose={() => setShowSimpleDeleteDialog(false)}
        onConfirmDelete={handleConfirmSimpleDelete}
      />
    </>
  );
}

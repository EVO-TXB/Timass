/**
 * Tiện ích kiểm tra xung đột thời gian (Time Conflict Detection)
 * Cho hệ thống quản lý lịch trình Timass.
 */

/**
 * Chuyển đổi định dạng thời gian "HH:mm" thành số phút trong ngày (0 - 1439).
 * @param {string} timeStr - Ví dụ "08:30"
 * @returns {number} Số phút từ 00:00
 */
export function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Kiểm tra xung đột thời gian giữa sự kiện đang chọn và các sự kiện đã có cùng ngày.
 * 
 * Công thức chuẩn:
 * isConflict = (gioBatDauMoi < gioKetThucCu) && (gioKetThucMoi > gioBatDauCu)
 * 
 * Lưu ý:
 * - Khi chỉnh sửa một sự kiện đã có: Loại trừ chính sự kiện đó (dựa vào maCongViec / id)
 *   ra khỏi danh sách kiểm tra để không tự báo trùng với chính mình.
 * - Bỏ qua các sự kiện thuộc cùng một chuỗi lặp lại nếu đang chỉnh sửa chuỗi (theo maNhomLapLai / recurringGroupId).
 * 
 * @param {Object} newEvent - Sự kiện đang thao tác trên Form
 * @param {Array} existingEvents - Danh sách các công việc đã có
 * @returns {Object} {
 *   hasConflict: boolean,
 *   isInvalidTime: boolean,
 *   conflictingTask: Object | null,
 *   conflictingTasks: Array<Object>,
 *   conflictMessage: string
 * }
 */
export function checkTimeConflict(newEvent, existingEvents = []) {
  if (
    !newEvent ||
    !newEvent.gioBatDau ||
    !newEvent.gioKetThuc ||
    !Array.isArray(existingEvents) ||
    existingEvents.length === 0
  ) {
    return {
      hasConflict: false,
      isInvalidTime: false,
      conflictingTask: null,
      conflictingTasks: [],
      conflictMessage: '',
    };
  }

  const startNew = timeToMinutes(newEvent.gioBatDau);
  const endNew = timeToMinutes(newEvent.gioKetThuc);

  // Nếu khung giờ không hợp lệ (giờ bắt đầu >= giờ kết thúc)
  if (startNew >= endNew) {
    return {
      hasConflict: false,
      isInvalidTime: true,
      conflictingTask: null,
      conflictingTasks: [],
      conflictMessage: 'Giờ bắt đầu phải sớm hơn giờ kết thúc.',
    };
  }

  // Xác định các thứ trong tuần mà sự kiện này diễn ra
  const isRecurring = Boolean(newEvent.isRecurring ?? newEvent.coLapLai);
  const targetDays =
    isRecurring && Array.isArray(newEvent.recurringDays) && newEvent.recurringDays.length > 0
      ? newEvent.recurringDays
      : [newEvent.thu || 'T2'];

  const conflictingTasks = [];

  const currentId = newEvent.id ?? newEvent.maCongViec;
  const currentGroupId = newEvent.recurringGroupId ?? newEvent.maNhomLapLai;

  for (const existing of existingEvents) {
    const existingId = existing.id ?? existing.maCongViec;
    const existingGroupId = existing.recurringGroupId ?? existing.maNhomLapLai;

    // 1. Loại trừ chính sự kiện đang chỉnh sửa (dựa vào maCongViec / id)
    if (currentId && existingId && String(currentId) === String(existingId)) {
      continue;
    }

    // 2. Bỏ qua các sự kiện thuộc cùng một chuỗi lặp lại nếu đang chỉnh sửa
    if (currentGroupId && existingGroupId && currentGroupId === existingGroupId) {
      continue;
    }

    // 3. Kiểm tra xem sự kiện có diễn ra cùng ngày/thứ không
    const isSameDay = targetDays.includes(existing.thu);
    if (!isSameDay) {
      continue;
    }

    // 4. Công thức kiểm tra: (gioBatDauMoi < gioKetThucCu) && (gioKetThucMoi > gioBatDauCu)
    const startOld = timeToMinutes(existing.gioBatDau);
    const endOld = timeToMinutes(existing.gioKetThuc);

    const isConflict = startNew < endOld && endNew > startOld;

    if (isConflict) {
      conflictingTasks.push(existing);
    }
  }

  if (conflictingTasks.length > 0) {
    const first = conflictingTasks[0];
    const conflictMessage = `❌ Khung giờ bị trùng với công việc: ${first.tieuDe} (${first.gioBatDau} - ${first.gioKetThuc}). Vui lòng chọn khung giờ khác.`;
    return {
      hasConflict: true,
      isInvalidTime: false,
      conflictingTask: first,
      conflictingTasks,
      conflictMessage,
    };
  }

  return {
    hasConflict: false,
    isInvalidTime: false,
    conflictingTask: null,
    conflictingTasks: [],
    conflictMessage: '',
  };
}

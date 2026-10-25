import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import congViecService from '../services/congViecService';
import { getWeekNumber, getMondayOfWeek, getMonthAndYearOfWeek, formatDateYMD, getDateForWeekday } from '../utils/dateUtils';

const TaskContext = createContext();

export const formatTaskFromBackend = (item) => {
  const dateVal = item.ngayThucHien;
  const dayOfWeekMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const d = new Date(dateVal);
  const thu = dayOfWeekMap[d.getDay()] || 'T4';
  const todayYMD = formatDateYMD(new Date());
  const isToday = dateVal === todayYMD;

  return {
    id: item.maCongViec,
    maCongViec: item.maCongViec,
    tieuDe: item.tieuDe,
    gioBatDau: item.gioBatDau ? item.gioBatDau.substring(0, 5) : '08:00',
    gioKetThuc: item.gioKetThuc ? item.gioKetThuc.substring(0, 5) : '10:00',
    diaDiem: item.diaDiem || '',
    loaiCongViec: item.loaiCongViec === 'THIET_YEU_BI_DONG' ? 'BỊ_ĐỘNG' : 'CHỦ_ĐỘNG',
    ngay: dateVal,
    ngayThucHien: dateVal,
    thu,
    daHoanThanh: item.trangThai === 'HOAN_THANH',
    trangThai: item.trangThai,
    isToday,
    coLapLai: Boolean(item.coLapLai),
    isRecurring: Boolean(item.coLapLai),
    maNhomLapLai: item.maNhomLapLai,
    recurringGroupId: item.maNhomLapLai,
    danhSachThu: [thu],
    recurringDays: [thu],
    startDate: '2026-10-12',
    endDate: '2026-12-30',
  };
};

export const NORMALIZE_TO_UI_DAY = {
  THU_2: 'T2',
  THU_3: 'T3',
  THU_4: 'T4',
  THU_5: 'T5',
  THU_6: 'T6',
  THU_7: 'T7',
  CHU_NHAT: 'CN',
  T2: 'T2',
  T3: 'T3',
  T4: 'T4',
  T5: 'T5',
  T6: 'T6',
  T7: 'T7',
  CN: 'CN',
};

export const UI_TO_BACKEND_DAY = {
  T2: 'THU_2',
  T3: 'THU_3',
  T4: 'THU_4',
  T5: 'THU_5',
  T6: 'THU_6',
  T7: 'THU_7',
  CN: 'CHU_NHAT',
};

// Mapping helper for days to date strings in Week 42 (12/10/2026 - 18/10/2026)
export const DAY_DATE_MAP = {
  T2: '2026-10-12',
  T3: '2026-10-13',
  T4: '2026-10-14',
  T5: '2026-10-15',
  T6: '2026-10-16',
  T7: '2026-10-17',
  CN: '2026-10-18',
};

// Mock initial tasks spanning across 7 days of Week 42
// Accurately matches @ui-sample/lịch tuần.png, @ui-sample/bảng check list.png, and task modal samples
const INITIAL_TASKS = [
  // --- THỨ 2 (12/10) ---
  {
    id: 101,
    maCongViec: 101,
    tieuDe: 'Học Lập trình Web',
    gioBatDau: '08:00',
    gioKetThuc: '11:00',
    diaDiem: 'A3-402',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-12',
    ngayThucHien: '2026-10-12',
    thu: 'T2',
    daHoanThanh: false,
    ghiChu: 'Thực hành React Router & Context API',
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_web_dev',
    recurringGroupId: 'rec_web_dev',
    danhSachThu: ['T2', 'T4'],
    recurringDays: ['T2', 'T4'],
    ngayBatDauLap: '2026-10-12',
    ngayKetThucLap: '2026-12-30',
    startDate: '2026-10-12',
    endDate: '2026-12-30',
  },

  // --- THỨ 3 (13/10) ---
  {
    id: 102,
    maCongViec: 102,
    tieuDe: 'Họp nhóm đồ án Web',
    gioBatDau: '09:30',
    gioKetThuc: '11:30',
    diaDiem: 'Google Meet',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-13',
    ngayThucHien: '2026-10-13',
    thu: 'T3',
    daHoanThanh: false,
    ghiChu: 'Thống nhất cấu trúc cơ sở dữ liệu và API',
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 103,
    maCongViec: 103,
    tieuDe: 'Thực hành CSDL nâng cao',
    gioBatDau: '14:00',
    gioKetThuc: '16:30',
    diaDiem: 'Lab 2 - B2',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-13',
    ngayThucHien: '2026-10-13',
    thu: 'T3',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },

  // --- THỨ 4 (14/10) - HÔM NAY (Đồng bộ với bảng check list.png) ---
  {
    id: 1,
    maCongViec: 1,
    tieuDe: 'Học Lập trình Web',
    gioBatDau: '07:30',
    gioKetThuc: '09:30',
    diaDiem: 'A3-402',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: true,
    isToday: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_web_dev',
    recurringGroupId: 'rec_web_dev',
    danhSachThu: ['T2', 'T4'],
    recurringDays: ['T2', 'T4'],
    ngayBatDauLap: '2026-10-12',
    ngayKetThucLap: '2026-12-30',
    startDate: '2026-10-12',
    endDate: '2026-12-30',
  },
  {
    id: 2,
    maCongViec: 2,
    tieuDe: 'Họp nhóm FootyBook',
    gioBatDau: '10:00',
    gioKetThuc: '11:30',
    diaDiem: 'Online Google Meet',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: false,
    isToday: true,
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 3,
    maCongViec: 3,
    tieuDe: 'Nghỉ trưa & Ăn cơm',
    gioBatDau: '11:30',
    gioKetThuc: '13:00',
    diaDiem: 'Căn tin trường',
    loaiCongViec: 'BỊ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: true,
    isToday: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_lunch',
    recurringGroupId: 'rec_lunch',
    danhSachThu: ['T2', 'T3', 'T4', 'T5', 'T6'],
    recurringDays: ['T2', 'T3', 'T4', 'T5', 'T6'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-12-31',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
  },
  {
    id: 4,
    maCongViec: 4,
    tieuDe: 'Tự học TOEIC Listening',
    gioBatDau: '15:00',
    gioKetThuc: '17:00',
    diaDiem: 'Thư viện tầng 3',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: false,
    isToday: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_toeic',
    recurringGroupId: 'rec_toeic',
    danhSachThu: ['T4', 'T5'],
    recurringDays: ['T4', 'T5'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-11-30',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
  },
  {
    id: 5,
    maCongViec: 5,
    tieuDe: 'Tập Gym',
    gioBatDau: '19:30',
    gioKetThuc: '21:00',
    diaDiem: 'Fitness Center',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: false,
    isToday: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_gym',
    recurringGroupId: 'rec_gym',
    danhSachThu: ['T2', 'T4', 'T6'],
    recurringDays: ['T2', 'T4', 'T6'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-12-31',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
  },
  {
    id: 6,
    maCongViec: 6,
    tieuDe: 'Đọc sách Clean Code',
    gioBatDau: '06:15',
    gioKetThuc: '07:00',
    diaDiem: 'Phòng học',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: true,
    isToday: true,
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 7,
    maCongViec: 7,
    tieuDe: 'Nấu bữa tối',
    gioBatDau: '18:00',
    gioKetThuc: '19:00',
    diaDiem: 'Nhà bếp',
    loaiCongViec: 'BỊ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: true,
    isToday: true,
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 8,
    maCongViec: 8,
    tieuDe: 'Lên kế hoạch tuần mới',
    gioBatDau: '21:30',
    gioKetThuc: '22:00',
    diaDiem: 'Bàn làm việc',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-14',
    ngayThucHien: '2026-10-14',
    thu: 'T4',
    daHoanThanh: true,
    isToday: true,
    coLapLai: false,
    isRecurring: false,
  },

  // --- THỨ 5 (15/10) - (Theo @ui-sample/lịch tuần.png) ---
  {
    id: 104,
    maCongViec: 104,
    tieuDe: 'Nghỉ trưa & Ăn cơm',
    gioBatDau: '12:00',
    gioKetThuc: '13:30',
    diaDiem: 'Căn tin trường',
    loaiCongViec: 'BỊ_ĐỘNG',
    ngay: '2026-10-15',
    ngayThucHien: '2026-10-15',
    thu: 'T5',
    daHoanThanh: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_lunch',
    recurringGroupId: 'rec_lunch',
    danhSachThu: ['T2', 'T3', 'T4', 'T5', 'T6'],
    recurringDays: ['T2', 'T3', 'T4', 'T5', 'T6'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-12-31',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
  },
  {
    id: 105,
    maCongViec: 105,
    tieuDe: 'Học TOEIC',
    gioBatDau: '18:00',
    gioKetThuc: '20:00',
    diaDiem: 'Trung tâm ngoại ngữ',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-15',
    ngayThucHien: '2026-10-15',
    thu: 'T5',
    daHoanThanh: false,
    colorStyle: 'purple',
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_toeic',
    recurringGroupId: 'rec_toeic',
    danhSachThu: ['T4', 'T5'],
    recurringDays: ['T4', 'T5'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-11-30',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
  },

  // --- THỨ 6 (16/10) ---
  {
    id: 106,
    maCongViec: 106,
    tieuDe: 'Kiến trúc phần mềm',
    gioBatDau: '08:30',
    gioKetThuc: '11:00',
    diaDiem: 'B1-201',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-16',
    ngayThucHien: '2026-10-16',
    thu: 'T6',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 107,
    maCongViec: 107,
    tieuDe: 'Chạy bộ thể dục',
    gioBatDau: '16:30',
    gioKetThuc: '17:30',
    diaDiem: 'Công viên Thống Nhất',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-16',
    ngayThucHien: '2026-10-16',
    thu: 'T6',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },

  // --- THỨ 7 (17/10) ---
  {
    id: 108,
    maCongViec: 108,
    tieuDe: 'Workshop AI & Tech Trends',
    gioBatDau: '09:00',
    gioKetThuc: '11:30',
    diaDiem: 'Hội trường C',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-17',
    ngayThucHien: '2026-10-17',
    thu: 'T7',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },
  {
    id: 109,
    maCongViec: 109,
    tieuDe: 'Gặp gỡ bạn bè cuối tuần',
    gioBatDau: '19:00',
    gioKetThuc: '21:30',
    diaDiem: 'The Coffee House',
    loaiCongViec: 'BỊ_ĐỘNG',
    ngay: '2026-10-17',
    ngayThucHien: '2026-10-17',
    thu: 'T7',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },

  // --- CHỦ NHẬT (18/10) ---
  {
    id: 110,
    maCongViec: 110,
    tieuDe: 'Dọn dẹp phòng & Giặt đồ',
    gioBatDau: '08:00',
    gioKetThuc: '09:30',
    diaDiem: 'Tại nhà',
    loaiCongViec: 'THIẾT_YẾU',
    ngay: '2026-10-18',
    ngayThucHien: '2026-10-18',
    thu: 'CN',
    daHoanThanh: true,
    coLapLai: true,
    isRecurring: true,
    maNhomLapLai: 'rec_cleaning',
    recurringGroupId: 'rec_cleaning',
    danhSachThu: ['CN'],
    recurringDays: ['CN'],
    ngayBatDauLap: '2026-10-01',
    ngayKetThucLap: '2026-12-31',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
  },
  {
    id: 111,
    maCongViec: 111,
    tieuDe: 'Ôn tập tuần & Thư giãn',
    gioBatDau: '15:00',
    gioKetThuc: '17:30',
    diaDiem: 'Góc học tập',
    loaiCongViec: 'CHỦ_ĐỘNG',
    ngay: '2026-10-18',
    ngayThucHien: '2026-10-18',
    thu: 'CN',
    daHoanThanh: false,
    coLapLai: false,
    isRecurring: false,
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const userRaw = localStorage.getItem('timass_user');
    if (!userRaw) return INITIAL_TASKS;
    try {
      const user = JSON.parse(userRaw);
      // Chỉ hiển thị dữ liệu mẫu ban đầu cho tài khoản mẫu (ID 1 hoặc 0912345678)
      if (user?.id === 1 || user?.soDienThoai === '0912345678') {
        return INITIAL_TASKS;
      }
      return [];
    } catch {
      return INITIAL_TASKS;
    }
  });
  const [activeView, setActiveView] = useState('tuan'); // 'ngay' | 'tuan' | 'thang'
  const [currentWeek, setCurrentWeek] = useState(() => getWeekNumber(new Date()));
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [goToTodayTrigger, setGoToTodayTrigger] = useState(0);

  // Modal control states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null means create mode

  // AI Scanner Modal states
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const openAiScanner = () => setIsAiScannerOpen(true);
  const closeAiScanner = () => setIsAiScannerOpen(false);

  // Notification Toast states (bám sát @ui-sample/Thông báo sự kiện.png)
  const [notificationToast, setNotificationToast] = useState({
    isOpen: false,
    id: null,
    maCongViec: null,
    tieuDe: '',
    thoiGian: '',
    diaDiem: '',
    nhacNhoTruoc: '',
  });

  const showToast = (toastData) => {
    setNotificationToast({
      isOpen: true,
      id: toastData.id || toastData.maCongViec || null,
      maCongViec: toastData.maCongViec || toastData.id || null,
      tieuDe: toastData.tieuDe || 'Công việc sắp tới',
      thoiGian: toastData.thoiGian || '',
      diaDiem: toastData.diaDiem || '',
      nhacNhoTruoc: toastData.nhacNhoTruoc || 'Sắp bắt đầu',
    });
  };

  const closeToast = () => {
    setNotificationToast((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const toggleToast = () => {
    setNotificationToast((prev) => {
      if (prev.isOpen) {
        return { ...prev, isOpen: false };
      }
      // Khi người dùng bấm vào chuông thông báo, hiển thị sự kiện tiếp theo trong ngày
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const nextTask = todayTasks.find((t) => {
        if (t.daHoanThanh || t.trangThai === 'HOAN_THANH') return false;
        const [h, m] = (t.gioBatDau || '00:00').split(':').map(Number);
        return (h * 60 + m) >= currentMinutes - 60;
      }) || todayTasks.find((t) => !t.daHoanThanh) || todayTasks[0];

      if (nextTask) {
        const [h, m] = (nextTask.gioBatDau || '00:00').split(':').map(Number);
        const diff = (h * 60 + m) - currentMinutes;
        let nhacNhoTruoc = `${diff} phút nữa`;
        if (diff <= 0) nhacNhoTruoc = 'Bắt đầu ngay bây giờ';

        return {
          isOpen: true,
          id: nextTask.id || nextTask.maCongViec,
          maCongViec: nextTask.maCongViec || nextTask.id,
          tieuDe: nextTask.tieuDe,
          thoiGian: nextTask.gioBatDau?.substring(0, 5) || '08:00',
          diaDiem: nextTask.diaDiem ? `Phòng ${nextTask.diaDiem}` : 'Theo lịch trình',
          nhacNhoTruoc,
        };
      }

      return {
        ...prev,
        isOpen: true,
      };
    });
  };

  // Filters for calendar legend
  const [filters, setFilters] = useState({
    chuDong: true,
    biDong: true,
    daHoanThanh: true,
  });

  // Toggle filter
  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle completion of a specific task
  const toggleTask = async (taskId) => {
    const task = tasks.find(
      (t) => String(t.id) === String(taskId) || String(t.maCongViec) === String(taskId)
    );
    const nextStatus = task && task.daHoanThanh ? 'DANG_CHO' : 'HOAN_THANH';

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        String(t.id) === String(taskId) || String(t.maCongViec) === String(taskId)
          ? { ...t, daHoanThanh: !t.daHoanThanh, trangThai: nextStatus }
          : t
      )
    );

    try {
      await congViecService.capNhatTrangThai(task?.maCongViec || taskId, nextStatus);
    } catch (e) {
      console.warn('Lỗi đồng bộ trạng thái công việc lên MySQL:', e);
    }
  };

  // Mark task completed optimistically (used by real-time sync engine)
  const markTaskCompleted = async (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        String(t.id) === String(taskId) || String(t.maCongViec) === String(taskId)
          ? { ...t, daHoanThanh: true, trangThai: 'HOAN_THANH' }
          : t
      )
    );

    try {
      await congViecService.capNhatTrangThai(taskId, 'HOAN_THANH');
    } catch (e) {
      console.warn('Lỗi đồng bộ trạng thái tự động lên MySQL:', e);
    }
  };

  // Update a single task instance ("Chỉ sự kiện này")
  const updateTaskInstance = async (updatedTask) => {
    const targetThu = updatedTask.thu;
    const baseDate = updatedTask.ngayThucHien || updatedTask.ngay;
    const targetDate = getDateForWeekday(targetThu, baseDate, currentWeek, currentYear);

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        const isMatch =
          String(t.id) === String(updatedTask.id) ||
          (t.maCongViec && updatedTask.maCongViec && String(t.maCongViec) === String(updatedTask.maCongViec));

        if (isMatch) {
          return {
            ...t,
            ...updatedTask,
            thu: targetThu,
            ngay: targetDate,
            ngayThucHien: targetDate,
            // Tách khỏi chuỗi lặp
            isRecurring: false,
            coLapLai: false,
            recurringGroupId: null,
            maNhomLapLai: null,
            tachChuoi: true,
            apDungTatCa: false,
            apDungChoTatCa: false,
          };
        }
        return t;
      })
    );

    try {
      const loaiBackend =
        updatedTask.loaiCongViec === 'BỊ_ĐỘNG' ||
        updatedTask.loaiCongViec === 'THIẾT_YẾU' ||
        updatedTask.loaiCongViec === 'THIET_YEU_BI_DONG'
          ? 'THIET_YEU_BI_DONG'
          : 'CHU_DONG';

      const payload = {
        tieuDe: updatedTask.tieuDe,
        gioBatDau: updatedTask.gioBatDau?.length === 5 ? `${updatedTask.gioBatDau}:00` : updatedTask.gioBatDau,
        gioKetThuc: updatedTask.gioKetThuc?.length === 5 ? `${updatedTask.gioKetThuc}:00` : updatedTask.gioKetThuc,
        diaDiem: updatedTask.diaDiem || '',
        loaiCongViec: loaiBackend,
        ngayThucHien: targetDate,
        apDungChoTatCa: false,
      };
      await congViecService.capNhatCongViec(updatedTask.maCongViec || updatedTask.id, payload);
    } catch (e) {
      console.warn('Lỗi cập nhật công việc lên MySQL:', e);
    }
  };

  // Update all tasks in a recurring series ("Tất cả sự kiện trong chuỗi")
  // Xử lý triệt để: cập nhật ngày cũ, tự động sinh mới sự kiện cho thứ được thêm (VD: T6), và xóa thứ bị bỏ
  const updateTaskSeries = async (recurringGroupId, updatedFields) => {
    if (!recurringGroupId) return;

    // 1. Chuẩn hóa danh sách các thứ (danhSachThu hoặc recurringDays)
    const rawDays =
      updatedFields.danhSachThu ||
      updatedFields.recurringDays ||
      [];
    const targetDays = rawDays.map((d) => NORMALIZE_TO_UI_DAY[d] || d);

    setTasks((prevTasks) => {
      // Giữ nguyên các task không thuộc chuỗi này
      const otherTasks = prevTasks.filter((t) => {
        if (updatedFields.isConvertingFromSingle && updatedFields.originalSingleId) {
          return (
            String(t.id) !== String(updatedFields.originalSingleId) &&
            String(t.maCongViec) !== String(updatedFields.originalSingleId)
          );
        }
        return (t.recurringGroupId ?? t.maNhomLapLai) !== recurringGroupId;
      });

      // Lấy các task hiện tại của chuỗi này
      const currentSeriesTasks = prevTasks.filter(
        (t) => (t.recurringGroupId ?? t.maNhomLapLai) === recurringGroupId
      );

      // Nếu không còn thứ nào được chọn (rỗng) -> xem như xóa toàn bộ chuỗi
      if (targetDays.length === 0) {
        return otherTasks;
      }

      // Thông tin chung cập nhật
      const tieuDe = updatedFields.tieuDe ?? currentSeriesTasks[0]?.tieuDe ?? 'Công việc';
      const gioBatDau = updatedFields.gioBatDau ?? currentSeriesTasks[0]?.gioBatDau ?? '08:00';
      const gioKetThuc = updatedFields.gioKetThuc ?? currentSeriesTasks[0]?.gioKetThuc ?? '10:00';
      const diaDiem = updatedFields.diaDiem ?? currentSeriesTasks[0]?.diaDiem ?? '';
      const loaiCongViec = updatedFields.loaiCongViec ?? currentSeriesTasks[0]?.loaiCongViec ?? 'CHỦ_ĐỘNG';
      const startDate =
        updatedFields.ngayBatDau ??
        updatedFields.startDate ??
        updatedFields.ngayBatDauLap ??
        currentSeriesTasks[0]?.startDate ??
        currentSeriesTasks[0]?.ngayBatDauLap ??
        '2026-10-12';
      const endDate =
        updatedFields.ngayKetThuc ??
        updatedFields.endDate ??
        updatedFields.ngayKetThucLap ??
        currentSeriesTasks[0]?.endDate ??
        currentSeriesTasks[0]?.ngayKetThucLap ??
        '2026-12-30';

      // Sinh / Cập nhật bản ghi cho từng thứ trong targetDays
      const updatedSeriesTasks = targetDays.map((day, idx) => {
        const existingInstance = currentSeriesTasks.find((t) => t.thu === day);
        const dayDate = getDateForWeekday(day, existingInstance?.ngayThucHien, currentWeek, currentYear);
        const newId = existingInstance ? existingInstance.id : Date.now() + idx + Math.floor(Math.random() * 1000);

        return {
          ...(existingInstance || {}),
          ...updatedFields,
          id: newId,
          maCongViec: newId,
          tieuDe,
          gioBatDau,
          gioKetThuc,
          diaDiem,
          loaiCongViec,
          thu: day,
          ngay: dayDate,
          ngayThucHien: dayDate,
          daHoanThanh: existingInstance ? existingInstance.daHoanThanh : false,
          trangThai: existingInstance ? existingInstance.trangThai : 'DANG_CHO',
          isToday: dayDate === formatDateYMD(new Date()),
          isRecurring: true,
          coLapLai: true,
          recurringGroupId,
          maNhomLapLai: recurringGroupId,
          recurringDays: targetDays,
          danhSachThu: targetDays,
          startDate,
          endDate,
          ngayBatDauLap: startDate,
          ngayKetThucLap: endDate,
          apDungTatCa: true,
          apDungChoTatCa: true,
        };
      });

      return [...otherTasks, ...updatedSeriesTasks];
    });

    // Đồng bộ triệt để với MySQL Database
    try {
      // 1. Xóa bản ghi / chuỗi cũ trên MySQL
      if (updatedFields.isConvertingFromSingle && updatedFields.originalSingleId) {
        await congViecService.xoaCongViec(updatedFields.originalSingleId, false);
      } else {
        const targetId =
          updatedFields.maCongViec ||
          updatedFields.id ||
          tasks.find((t) => (t.recurringGroupId ?? t.maNhomLapLai) === recurringGroupId)?.maCongViec ||
          tasks.find((t) => (t.recurringGroupId ?? t.maNhomLapLai) === recurringGroupId)?.id;
        if (targetId) {
          await congViecService.xoaCongViec(targetId, true);
        }
      }

      // 2. Tạo lại chuỗi công việc mới trên MySQL theo toàn bộ thứ đã chọn
      if (targetDays.length > 0) {
        const loaiBackend =
          updatedFields.loaiCongViec === 'BỊ_ĐỘNG' ||
          updatedFields.loaiCongViec === 'THIẾT_YẾU' ||
          updatedFields.loaiCongViec === 'THIET_YEU_BI_DONG'
            ? 'THIET_YEU_BI_DONG'
            : 'CHU_DONG';

        const dayToNumberMap = { T2: 2, T3: 3, T4: 4, T5: 5, T6: 6, T7: 7, CN: 8 };
        const numericDays = targetDays.map((d) => dayToNumberMap[d] || 2);

        const currentMonday = getMondayOfWeek(currentWeek, currentYear);
        const sDate =
          updatedFields.ngayBatDau ||
          updatedFields.startDate ||
          updatedFields.ngayBatDauLap ||
          formatDateYMD(currentMonday) ||
          '2026-10-12';
        const eDate =
          updatedFields.ngayKetThuc ||
          updatedFields.endDate ||
          updatedFields.ngayKetThucLap ||
          '2026-12-30';

        const createPayload = {
          tieuDe: updatedFields.tieuDe || 'Công việc lặp lại',
          gioBatDau: updatedFields.gioBatDau?.length === 5 ? `${updatedFields.gioBatDau}:00` : updatedFields.gioBatDau,
          gioKetThuc: updatedFields.gioKetThuc?.length === 5 ? `${updatedFields.gioKetThuc}:00` : updatedFields.gioKetThuc,
          diaDiem: updatedFields.diaDiem || '',
          loaiCongViec: loaiBackend,
          danhSachThu: numericDays,
          ngayBatDau: sDate,
          ngayKetThuc: eDate,
        };

        await congViecService.taoCongViecLapLai(createPayload);
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ chuỗi công việc lên MySQL:', e);
    }
  };

  // Delete a task ("Chỉ xóa công việc này")
  const deleteTask = async (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((t) => String(t.id) !== String(taskId) && String(t.maCongViec) !== String(taskId))
    );
    try {
      await congViecService.xoaCongViec(taskId, false);
    } catch (e) {
      console.warn('Lỗi xóa công việc trên MySQL:', e);
    }
  };

  // Delete all tasks in a recurring series ("Xóa toàn bộ chuỗi lặp lại")
  const deleteTaskSeries = async (recurringGroupId, taskId = null) => {
    // 1. Tìm bản ghi mục tiêu trong danh sách tasks
    const target = tasks.find((t) => {
      const gId = t.recurringGroupId || t.maNhomLapLai;
      if (recurringGroupId && gId && String(gId) === String(recurringGroupId)) return true;
      if (taskId && (String(t.id) === String(taskId) || String(t.maCongViec) === String(taskId))) return true;
      return false;
    });

    const targetId = taskId || target?.maCongViec || target?.id;
    const effectiveGroupId = recurringGroupId || target?.recurringGroupId || target?.maNhomLapLai;

    // 2. Lọc bỏ toàn bộ các công việc trong chuỗi khỏi state local ngay lập tức
    setTasks((prevTasks) =>
      prevTasks.filter((t) => {
        const gId = t.recurringGroupId || t.maNhomLapLai;
        if (effectiveGroupId && gId && String(gId) === String(effectiveGroupId)) return false;
        if (targetId && (String(t.id) === String(targetId) || String(t.maCongViec) === String(targetId))) return false;
        return true;
      })
    );

    // 3. Gọi backend xóa toàn bộ chuỗi lặp lại trong MySQL (thử cả theo mã nhóm và ID)
    try {
      if (effectiveGroupId) {
        await congViecService.xoaTheoNhom(effectiveGroupId);
      }
      if (targetId) {
        await congViecService.xoaCongViec(targetId, true);
      }
    } catch (e) {
      console.warn('Lỗi xóa chuỗi công việc trên MySQL:', e);
    }
  };

  // Create new task or recurring tasks
  const createTask = async (taskData) => {
    const {
      tieuDe,
      loaiCongViec,
      gioBatDau,
      gioKetThuc,
      diaDiem,
      isRecurring,
      coLapLai,
      recurringDays = ['T2'],
      danhSachThu = ['T2'],
      startDate = '2026-10-12',
      endDate = '2026-12-30',
      ngayBatDauLap,
      ngayKetThucLap,
      thu = 'T4',
    } = taskData;

    const shouldRecur = Boolean(isRecurring ?? coLapLai);
    const days = (danhSachThu && danhSachThu.length > 0 ? danhSachThu : recurringDays) || ['T2'];
    const sDate = ngayBatDauLap || startDate || '2026-10-12';
    const eDate = ngayKetThucLap || endDate || '2026-12-30';
    const loaiBackend =
      loaiCongViec === 'BỊ_ĐỘNG' || loaiCongViec === 'THIẾT_YẾU' || loaiCongViec === 'THIET_YEU_BI_DONG'
        ? 'THIET_YEU_BI_DONG'
        : 'CHU_DONG';
    const dayToNumberMap = { T2: 2, T3: 3, T4: 4, T5: 5, T6: 6, T7: 7, CN: 8 };

    try {
      if (shouldRecur && days && days.length > 0) {
        const payload = {
          tieuDe,
          gioBatDau: gioBatDau?.length === 5 ? `${gioBatDau}:00` : gioBatDau,
          gioKetThuc: gioKetThuc?.length === 5 ? `${gioKetThuc}:00` : gioKetThuc,
          loaiCongViec: loaiBackend,
          diaDiem: diaDiem || '',
          danhSachThu: days.map((d) => dayToNumberMap[d] || 2),
          ngayBatDau: sDate,
          ngayKetThuc: eDate,
        };
        const res = await congViecService.taoCongViecLapLai(payload);
        if (res && res.success) {
          await reloadTasks();
          return;
        }
      } else {
        const singleDay = thu || 'T4';
        const dateVal = getDateForWeekday(singleDay, taskData.ngay, currentWeek, currentYear);
        const payload = {
          tieuDe,
          ngayThucHien: dateVal,
          gioBatDau: gioBatDau?.length === 5 ? `${gioBatDau}:00` : gioBatDau,
          gioKetThuc: gioKetThuc?.length === 5 ? `${gioKetThuc}:00` : gioKetThuc,
          loaiCongViec: loaiBackend,
          diaDiem: diaDiem || '',
        };
        const res = await congViecService.taoCongViecDonLe(payload);
        if (res && res.success) {
          await reloadTasks();
          return;
        }
      }
    } catch (e) {
      console.warn('Lỗi gọi API tạo công việc lên MySQL:', e);
    }

    if (shouldRecur && days && days.length > 0) {
      // Create instances across selected days in current week
      const recurringGroupId = `rec_${Date.now()}`;
      const newTasks = days.map((day, idx) => {
        const dayDate = getDateForWeekday(day, null, currentWeek, currentYear);
        return {
          id: Date.now() + idx,
          maCongViec: Date.now() + idx,
          tieuDe,
          loaiCongViec,
          gioBatDau,
          gioKetThuc,
          diaDiem,
          thu: day,
          ngay: dayDate,
          ngayThucHien: dayDate,
          daHoanThanh: false,
          isToday: dayDate === formatDateYMD(new Date()),
          isRecurring: true,
          coLapLai: true,
          recurringGroupId,
          maNhomLapLai: recurringGroupId,
          recurringDays: days,
          danhSachThu: days,
          startDate: sDate,
          endDate: eDate,
          ngayBatDauLap: sDate,
          ngayKetThucLap: eDate,
        };
      });

      setTasks((prev) => [...prev, ...newTasks]);
    } else {
      // Create single task
      const singleDay = thu || 'T4';
      const dateVal = getDateForWeekday(singleDay, taskData.ngay, currentWeek, currentYear);
      const newId = Date.now();
      const newTask = {
        id: newId,
        maCongViec: newId,
        tieuDe,
        loaiCongViec,
        gioBatDau,
        gioKetThuc,
        diaDiem,
        thu: singleDay,
        ngay: dateVal,
        ngayThucHien: dateVal,
        daHoanThanh: false,
        isToday: dateVal === formatDateYMD(new Date()),
        isRecurring: false,
        coLapLai: false,
      };

      setTasks((prev) => [...prev, newTask]);
    }
  };

  // Nhập thời khóa biểu từ kết quả phân tích AI (Bước 2)
  const addScannedSchedule = async (scannedCourses, dateRange = {}) => {
    if (!scannedCourses || scannedCourses.length === 0) return;

    const sDate = dateRange.startDate || '2026-10-26';
    const eDate = dateRange.endDate || '2027-01-15';

    // 1. Chuẩn bị payload theo đúng format DTO của backend
    const danhSachMonHoc = scannedCourses.map((c) => {
      let gioBatDau = '08:00';
      let gioKetThuc = '11:00';
      if (c.khungGio && c.khungGio.includes('-')) {
        const parts = c.khungGio.split('-').map((p) => p.trim());
        if (parts[0]) gioBatDau = parts[0];
        if (parts[1]) gioKetThuc = parts[1];
      }
      return {
        tenMonHoc: c.tenMonHoc || 'Môn học mới',
        thuTrongTuan: c.thu || 'T2',
        gioBatDau: gioBatDau.length === 4 ? `0${gioBatDau}` : gioBatDau,
        gioKetThuc: gioKetThuc.length === 4 ? `0${gioKetThuc}` : gioKetThuc,
        phongHoc: c.phongHoc || '',
      };
    });

    let backendSuccess = false;
    try {
      // 2. Gửi request lưu toàn bộ các buổi học vào CSDL MySQL
      const res = await congViecService.luuTkbHangLoat({
        ngayBatDau: sDate,
        ngayKetThuc: eDate,
        danhSachMonHoc,
      });

      if (res && (res.success || res.status === 201 || Array.isArray(res.data))) {
        backendSuccess = true;
      }
    } catch (err) {
      console.warn('⚠️ Lỗi gọi API luuTkbHangLoat tới backend:', err);
    }

    // 3. Tạo task local hiển thị ngay trên giao diện tuần đang xem
    const localNewTasks = scannedCourses.map((course, idx) => {
      let gioBatDau = '08:00';
      let gioKetThuc = '11:00';
      if (course.khungGio && course.khungGio.includes('-')) {
        const parts = course.khungGio.split('-').map((p) => p.trim());
        if (parts[0]) gioBatDau = parts[0];
        if (parts[1]) gioKetThuc = parts[1];
      }

      const day = course.thu || 'T2';
      const recurringGroupId = `rec_ai_${Date.now()}_${idx}`;
      const newId = Date.now() + idx + Math.floor(Math.random() * 1000);
      
      // Tính ngày thực tế trong tuần hiện tại đang xem (thay vì fix cứng tuần 42)
      const actualDate = getDateForWeekday(day, null, currentWeek, currentYear);

      return {
        id: newId,
        maCongViec: newId,
        tieuDe: course.tenMonHoc || 'Môn học mới',
        loaiCongViec: 'CHỦ_ĐỘNG',
        gioBatDau,
        gioKetThuc,
        diaDiem: course.phongHoc || '',
        thu: day,
        ngay: actualDate,
        ngayThucHien: actualDate,
        daHoanThanh: false,
        isToday: actualDate === formatDateYMD(new Date()),
        isRecurring: true,
        coLapLai: true,
        recurringGroupId,
        maNhomLapLai: recurringGroupId,
        recurringDays: [day],
        danhSachThu: [day],
        startDate: sDate,
        endDate: eDate,
        ngayBatDauLap: sDate,
        ngayKetThucLap: eDate,
        ghiChu: `Nhập tự động từ AI Scanner (${sDate} đến ${eDate})`,
      };
    });

    setTasks((prev) => [...prev, ...localNewTasks]);

    // 4. Nếu lưu backend thành công, reload lại dữ liệu đồng bộ
    if (backendSuccess) {
      await reloadTasks(true);
    }

    // 5. Kiểm tra nếu tuần hiện tại nằm ngoài kỳ học, tự động chuyển đến tuần bắt đầu của kỳ
    try {
      const sDateObj = new Date(sDate);
      if (!isNaN(sDateObj.getTime())) {
        const targetWeek = getWeekNumber(sDateObj);
        const targetYear = sDateObj.getFullYear();
        if (targetWeek !== currentWeek || targetYear !== currentYear) {
          selectWeek(targetWeek, targetYear);
        }
      }
    } catch {
      // ignore
    }

    // 6. Kích hoạt ngay Toast thông báo thành công
    const firstCourse = scannedCourses[0];
    const startTime = firstCourse?.khungGio?.split('-')?.[0]?.trim() || '08:00';
    const room = firstCourse?.phongHoc ? `Phòng ${firstCourse.phongHoc}` : '';

    setNotificationToast({
      isOpen: true,
      tieuDe: `Đã thêm ${scannedCourses.length} môn học vào lịch trình!`,
      thoiGian: startTime,
      diaDiem: room || 'Theo thời khóa biểu',
      nhacNhoTruoc: 'Đã cập nhật lịch',
    });
  };

  // Re-fetch or reload state from MySQL theo tuần đang xem
  const reloadTasks = async (silent = false) => {
    try {
      const monday = getMondayOfWeek(currentWeek, currentYear);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const tuNgay = formatDateYMD(monday);
      const denNgay = formatDateYMD(sunday);

      const res = await congViecService.layDanhSach(tuNgay, denNgay);
      if (res && res.success && Array.isArray(res.data)) {
        const formatted = res.data.map(formatTaskFromBackend);
        const groupDaysMap = {};
        formatted.forEach((t) => {
          if (t.maNhomLapLai) {
            if (!groupDaysMap[t.maNhomLapLai]) {
              groupDaysMap[t.maNhomLapLai] = new Set();
            }
            groupDaysMap[t.maNhomLapLai].add(t.thu);
          }
        });
        formatted.forEach((t) => {
          if (t.maNhomLapLai && groupDaysMap[t.maNhomLapLai]) {
            const allDays = Array.from(groupDaysMap[t.maNhomLapLai]);
            t.danhSachThu = allDays;
            t.recurringDays = allDays;
          }
        });
        setTasks(formatted);
        return;
      }
    } catch (err) {
      if (!silent) console.warn('Lỗi tải dữ liệu từ MySQL:', err);
    }
    if (!silent) {
      setTasks((prev) => [...prev]);
    }
  };

  const clearTasks = () => {
    setTasks([]);
  };

  useEffect(() => {
    reloadTasks();
  }, [currentWeek, currentYear]);

  // Open modal in create mode
  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Open modal in edit mode
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Close modal
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Today's tasks (matched by real date or day of week)
  const todayTasks = useMemo(() => {
    const todayStr = formatDateYMD(new Date());
    const dayMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const todayThu = dayMap[new Date().getDay()];

    return tasks
      .filter((t) => t.isToday || t.ngay === todayStr || t.ngayThucHien === todayStr || t.thu === todayThu)
      .sort((a, b) => (a.gioBatDau || '').localeCompare(b.gioBatDau || ''));
  }, [tasks]);

  // Statistics calculation for Today (% progress widget): daXong, tongCong, tiLe %
  const stats = useMemo(() => {
    const tongCong = todayTasks.length;
    const daXong = todayTasks.filter((t) => t.daHoanThanh).length;
    const tiLe = tongCong > 0 ? Math.round((daXong / tongCong) * 100) : 0;
    return {
      tongCong,
      daXong,
      tiLe,
    };
  }, [todayTasks]);

  // Navigation functions
  const goToToday = () => {
    const now = new Date();
    const thisWeek = getWeekNumber(now);
    setCurrentWeek(thisWeek);
    setCurrentMonth(now.getMonth() + 1);
    setCurrentYear(now.getFullYear());
    setGoToTodayTrigger((v) => v + 1);
  };

  const nextWeek = () => {
    const monday = getMondayOfWeek(currentWeek, currentYear);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    const newWeek = getWeekNumber(nextMonday);
    const { month, year } = getMonthAndYearOfWeek(newWeek, nextMonday.getFullYear());

    setCurrentWeek(newWeek);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const prevWeek = () => {
    const monday = getMondayOfWeek(currentWeek, currentYear);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);

    const newWeek = getWeekNumber(prevMonday);
    const { month, year } = getMonthAndYearOfWeek(newWeek, prevMonday.getFullYear());

    setCurrentWeek(newWeek);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  // Chuyển sang tháng tiếp theo
  const nextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    const firstDay = new Date(newYear, newMonth - 1, 1);
    const newWeek = getWeekNumber(firstDay);

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setCurrentWeek(newWeek);
  };

  // Chuyển về tháng trước
  const prevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    const firstDay = new Date(newYear, newMonth - 1, 1);
    const newWeek = getWeekNumber(firstDay);

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setCurrentWeek(newWeek);
  };

  // Chọn một tuần cụ thể từ lịch tháng
  const selectWeek = (weekNum, yearVal) => {
    const yr = yearVal || currentYear;
    const { month, year } = getMonthAndYearOfWeek(weekNum, yr);
    setCurrentWeek(weekNum);
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        todayTasks,
        stats,
        toggleTask,
        markTaskCompleted,
        createTask,
        updateTaskInstance,
        updateTaskSeries,
        deleteTask,
        deleteTaskSeries,
        reloadTasks,
        clearTasks,
        activeView,
        setActiveView,
        currentWeek,
        currentMonth,
        currentYear,
        goToToday,
        goToTodayTrigger,
        nextWeek,
        prevWeek,
        nextMonth,
        prevMonth,
        selectWeek,
        filters,
        toggleFilter,
        isTaskModalOpen,
        editingTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        // AI Scanner & Notification Toast
        isAiScannerOpen,
        openAiScanner,
        closeAiScanner,
        notificationToast,
        showToast,
        closeToast,
        toggleToast,
        addScannedSchedule,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

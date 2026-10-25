import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDateYMD, getWeekNumber, getWeekDays, parseTimeToMinutes } from '../utils/dateUtils';
import congViecService from '../services/congViecService';

const START_HOUR = 6;  // 06:00
const END_HOUR = 22;   // 22:00
const HOUR_HEIGHT = 60; // 60px / 1 hour
const PIXELS_PER_MINUTE = 1; // 1px / 1 minute

/**
 * Custom Hook: useRealTimeSync
 * Động cơ đồng bộ thời gian thực cho hệ thống Timass
 * - Quản lý đồng hồ thời gian thực (Real-Time Clock)
 * - Xử lý chuyển ngày mới lúc nửa đêm (Midnight Rollover)
 * - Tính toán vị trí vạch chỉ giờ đỏ (Current Time Indicator)
 * - Tự động cuộn tới giờ hiện tại (Auto-Scroll)
 * - Tự động nhận diện công việc thiết yếu quá hạn & nhắc nhở 15 phút (Client-Side Polling)
 */
export function useRealTimeSync({
  calendarScrollRef,
  currentWeek,
  currentYear,
  tasks = [],
  reloadTasks,
  showToast,
  goToTodayTrigger = 0,
  markTaskCompleted,
}) {
  // 1. Quản lý đồng hồ thời gian thực
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Lưu trữ ngày hiện tại để phát hiện Midnight Rollover
  const prevDateRef = useRef(formatDateYMD(new Date()));
  const lastSyncMinuteRef = useRef(-1);
  const notifiedTasksRef = useRef(new Set());
  const hasInitialScrolledRef = useRef(false);

  // 2. Cập nhật currentTime mỗi 30 giây & dọn dẹp bộ nhớ khi unmount
  useEffect(() => {
    // Chạy kiểm tra sự kiện ngay khi tasks được nạp hoặc cập nhật
    const initialNow = new Date();
    checkAndAutoCompletePassiveTasks(initialNow);
    checkReminders(initialNow);

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const nowDateStr = formatDateYMD(now);

      // Xử lý chuyển ngày mới (Midnight Rollover): 23:59 -> 00:00
      if (prevDateRef.current !== nowDateStr) {
        prevDateRef.current = nowDateStr;
        notifiedTasksRef.current.clear();
        if (reloadTasks) {
          reloadTasks();
        }
      }

      // Chu kỳ 1 phút: Kiểm tra việc quá hạn, nhắc nhở sự kiện và sync ngầm backend
      const currentMinuteVal = now.getHours() * 60 + now.getMinutes();
      if (lastSyncMinuteRef.current !== currentMinuteVal) {
        lastSyncMinuteRef.current = currentMinuteVal;

        // a. Tự động chuyển việc thiết yếu/bị động quá hạn sang HOAN_THANH
        checkAndAutoCompletePassiveTasks(now);

        // b. Nhắc nhở công việc tiếp theo (15 phút trước hoặc khi đúng giờ bắt đầu)
        checkReminders(now);

        // c. Gọi ngầm API để đồng bộ dữ liệu mới nhất từ Backend Scheduler
        if (reloadTasks) {
          reloadTasks(true); // silent = true
        }
      }
    }, 30000); // 30 giây cập nhật một lần

    return () => clearInterval(timer);
  }, [tasks, reloadTasks]);

  // Kiểm tra và tự động tích hoàn thành việc bị động quá hạn
  const checkAndAutoCompletePassiveTasks = useCallback(
    async (now) => {
      const todayStr = formatDateYMD(now);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Lọc các công việc trong ngày hôm nay
      const todaysPassiveTasks = tasks.filter((t) => {
        const isTodayTask = t.ngay === todayStr || t.ngayThucHien === todayStr || t.isToday;
        const isPassive =
          t.loaiCongViec === 'THIET_YEU_BI_DONG' ||
          t.loaiCongViec === 'BỊ_ĐỘNG' ||
          t.loaiCongViec === 'THIẾT_YẾU' ||
          t.loaiCongViec === 'BI_DONG';
        const isPending = !t.daHoanThanh && t.trangThai !== 'HOAN_THANH';
        return isTodayTask && isPassive && isPending;
      });

      for (const task of todaysPassiveTasks) {
        const endMinutes = parseTimeToMinutes(task.gioKetThuc);
        // Nếu giờ kết thúc <= thời gian hiện tại
        if (endMinutes <= currentMinutes) {
          try {
            // Cập nhật Optimistic UI & gọi API xuống MySQL
            if (markTaskCompleted) {
              await markTaskCompleted(task.maCongViec || task.id);
            } else {
              await congViecService.capNhatTrangThai(task.maCongViec || task.id, 'HOAN_THANH');
              if (reloadTasks) {
                reloadTasks(true);
              }
            }
          } catch (e) {
            console.warn('Lỗi tự động hoàn thành công việc quá hạn:', e);
          }
        }
      }
    },
    [tasks, reloadTasks, markTaskCompleted]
  );

  // Nhắc nhở sự kiện: Sắp diễn ra (trước 15 phút) & Khi đến giờ (Bắt đầu ngay) theo thứ tự
  const checkReminders = useCallback(
    (now) => {
      if (!showToast) return;
      const todayStr = formatDateYMD(now);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Lấy danh sách công việc hôm nay chưa hoàn thành và sắp xếp theo giờ bắt đầu
      const todayPendingTasks = tasks
        .filter((t) => {
          const isTodayTask = t.ngay === todayStr || t.ngayThucHien === todayStr || t.isToday;
          const isPending = !t.daHoanThanh && t.trangThai !== 'HOAN_THANH';
          return isTodayTask && isPending;
        })
        .map((t) => ({
          ...t,
          startMin: parseTimeToMinutes(t.gioBatDau),
          endMin: parseTimeToMinutes(t.gioKetThuc),
        }))
        .sort((a, b) => a.startMin - b.startMin);

      for (const task of todayPendingTasks) {
        const taskId = task.id || task.maCongViec;
        const diff = task.startMin - currentMinutes;

        // 1. MỐC ĐẾN GIỜ (bắt đầu trong vòng 0 phút hoặc vừa mới bắt đầu)
        const startKey = `${taskId}_start`;
        if (diff <= 0 && currentMinutes < task.endMin) {
          if (!notifiedTasksRef.current.has(startKey)) {
            notifiedTasksRef.current.add(startKey);
            showToast({
              id: taskId,
              maCongViec: taskId,
              tieuDe: task.tieuDe,
              thoiGian: task.gioBatDau?.substring(0, 5) || '08:00',
              diaDiem: task.diaDiem ? `Phòng ${task.diaDiem}` : 'Theo lịch trình',
              nhacNhoTruoc: 'Bắt đầu ngay bây giờ',
            });
            break; // Mỗi chu kỳ chỉ kích hoạt 1 thông báo ưu tiên cao nhất
          }
        }
        // 2. MỐC SẮP DIỄN RA (còn từ 1 đến 15 phút nữa)
        else if (diff > 0 && diff <= 15) {
          const upcomingKey = `${taskId}_15m`;
          if (!notifiedTasksRef.current.has(upcomingKey)) {
            notifiedTasksRef.current.add(upcomingKey);
            showToast({
              id: taskId,
              maCongViec: taskId,
              tieuDe: task.tieuDe,
              thoiGian: task.gioBatDau?.substring(0, 5) || '08:00',
              diaDiem: task.diaDiem ? `Phòng ${task.diaDiem}` : 'Theo lịch trình',
              nhacNhoTruoc: `${diff} phút nữa`,
            });
            break; // Mỗi chu kỳ chỉ kích hoạt 1 thông báo ưu tiên cao nhất
          }
        }
      }
    },
    [tasks, showToast]
  );

  // 3. Tính toán tọa độ vị trí theo thời gian thực (Current Time Indicator)
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentSecond = currentTime.getSeconds();

  // Công thức: topPosition = ((currentHour - START_HOUR) * 60 + currentMinute) * PIXELS_PER_MINUTE
  const topPosition = Math.max(
    0,
    ((currentHour - START_HOUR) * 60 + currentMinute + currentSecond / 60) * PIXELS_PER_MINUTE
  );

  const totalGridHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  const isTimeInRange = topPosition >= 0 && topPosition <= totalGridHeight;

  const formattedTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  const todayDateString = formatDateYMD(currentTime);

  // Sinh danh sách 7 ngày của tuần đang chọn (T2 -> CN)
  const weekDays = getWeekDays(currentWeek, currentYear, currentTime);

  // Kiểm tra xem tuần đang xem có chứa ngày hôm nay hay không
  const isCurrentWeek = weekDays.some((d) => d.isToday);

  // 4. Tự động cuộn tới giờ hiện tại (Auto-Scroll to Current Time)
  const scrollToCurrentTime = useCallback(
    (behavior = 'smooth') => {
      if (calendarScrollRef?.current) {
        // Trừ hao 120px để người dùng thấy được cả sự kiện trước đó 1-2 tiếng
        const targetTop = Math.max(0, topPosition - 120);
        calendarScrollRef.current.scrollTo({
          top: targetTop,
          behavior,
        });
      }
    },
    [topPosition, calendarScrollRef]
  );

  // Tự động cuộn lần đầu khi vừa mở trang (Initial mount)
  useEffect(() => {
    if (calendarScrollRef?.current && isCurrentWeek && !hasInitialScrolledRef.current) {
      hasInitialScrolledRef.current = true;
      const t = setTimeout(() => {
        scrollToCurrentTime('smooth');
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isCurrentWeek, scrollToCurrentTime, calendarScrollRef]);

  // Cuộn khi người dùng bấm nút "Hôm nay"
  useEffect(() => {
    if (goToTodayTrigger > 0 && isCurrentWeek) {
      scrollToCurrentTime('smooth');
    }
  }, [goToTodayTrigger, isCurrentWeek, scrollToCurrentTime]);

  return {
    currentTime,
    currentHour,
    currentMinute,
    topPosition,
    isTimeInRange,
    isCurrentWeek,
    formattedTime,
    todayDateString,
    weekDays,
    scrollToCurrentTime,
    START_HOUR,
    END_HOUR,
    HOUR_HEIGHT,
    totalGridHeight,
  };
}

export default useRealTimeSync;

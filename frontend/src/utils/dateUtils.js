/**
 * Tiện ích xử lý ngày tháng & tuần chuẩn ISO cho hệ thống Timass
 */

/**
 * Định dạng Date object thành chuỗi "YYYY-MM-DD"
 */
export function formatDateYMD(date) {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Tính số tuần ISO (1 - 53) từ ngày cụ thể
 */
export function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Lấy ngày bắt đầu (Thứ 2 - Monday) của tuần ISO cụ thể trong năm
 */
export function getMondayOfWeek(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const ISOweekStart = new Date(simple);
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + (simple.getDay() === 0 ? -6 : 1));
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}

/**
 * Sinh danh sách 7 ngày trong tuần theo chuẩn giao diện Timass (T2 -> CN)
 */
export function getWeekDays(week, year, todayDate = new Date()) {
  const monday = getMondayOfWeek(week, year);
  const thuNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const todayStr = formatDateYMD(todayDate);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const fullDate = formatDateYMD(d);
    const ngay = d.getDate();
    const thu = thuNames[i];
    const isToday = fullDate === todayStr;

    return {
      thu,
      ngay,
      fullDate,
      label: `${thu} ${ngay}`,
      isToday,
      dateObj: d,
    };
  });
}

/**
 * Chuyển chuỗi "HH:mm" thành tổng số phút tính từ 00:00
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/**
 * Lấy tháng và năm đại diện của một tuần ISO cụ thể (dựa trên ngày Thứ 5 giữa tuần)
 */
export function getMonthAndYearOfWeek(week, year) {
  const monday = getMondayOfWeek(week, year);
  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);
  return {
    month: thursday.getMonth() + 1,
    year: thursday.getFullYear(),
  };
}

/**
 * Sinh ma trận lịch tháng động (Dynamic Month Calendar Matrix)
 * @param {number} year - Năm (vd: 2026)
 * @param {number} month - Tháng 1-12 (vd: 10)
 * @param {Date} todayDate - Ngày hiện tại để đánh dấu isToday
 * @returns {Array} Danh sách các tuần, mỗi tuần có weekNum và 7 ngày
 */
export function getMonthMatrix(year, month, todayDate = new Date()) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0); // Ngày cuối của tháng
  const todayStr = formatDateYMD(todayDate);

  // Tìm ngày Thứ 2 đầu tiên của ma trận
  const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // 1 = T2, 7 = CN
  const startMonday = new Date(firstDay);
  startMonday.setDate(firstDay.getDate() - (firstDayOfWeek - 1));

  const weeks = [];
  const currentCursor = new Date(startMonday);

  // Duyệt qua các tuần cho đến khi vượt qua ngày cuối cùng của tháng (5 đến 6 tuần)
  while (currentCursor <= lastDay || weeks.length < 5) {
    const weekStart = new Date(currentCursor);
    const weekNum = getWeekNumber(weekStart);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentCursor);
      const fullDate = formatDateYMD(d);
      const dMonth = d.getMonth() + 1;
      const dYear = d.getFullYear();

      let isPrevMonth = false;
      let isNextMonth = false;

      if (dYear < year || (dYear === year && dMonth < month)) {
        isPrevMonth = true;
      } else if (dYear > year || (dYear === year && dMonth > month)) {
        isNextMonth = true;
      }

      days.push({
        dayNumber: d.getDate(),
        fullDate,
        isPrevMonth,
        isNextMonth,
        isCurrentMonth: !isPrevMonth && !isNextMonth,
        isToday: fullDate === todayStr,
        dateObj: d,
      });

      currentCursor.setDate(currentCursor.getDate() + 1);
    }

    weeks.push({
      weekNum,
      year: weekStart.getFullYear(),
      days,
    });

    if (currentCursor > lastDay && weeks.length >= 5) {
      break;
    }
    if (weeks.length >= 6) {
      break;
    }
  }

  return weeks;
}

/**
 * Chuyển đổi an toàn chuỗi "YYYY-MM-DD" thành Date object theo giờ local
 */
export function parseDateYMD(str) {
  if (!str) return new Date();
  if (str instanceof Date) return str;
  const parts = String(str).split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(str);
}

/**
 * Lấy ngày Thứ 2 của tuần chứa dateInput
 */
export function getMondayOfDate(dateInput) {
  const d = parseDateYMD(dateInput);
  const dayOfWeek = d.getDay(); // 0: CN, 1: T2, 2: T3, ...
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  return monday;
}

/**
 * Lấy chuỗi ngày "YYYY-MM-DD" tương ứng với thứ trong tuần (T2 -> CN)
 * Dựa trên ngày gốc (baseDate) hoặc tuần/năm xem lịch (fallbackWeek, fallbackYear)
 */
export function getDateForWeekday(targetThu, baseDate, fallbackWeek, fallbackYear) {
  const THU_INDEX_MAP = {
    T2: 0,
    T3: 1,
    T4: 2,
    T5: 3,
    T6: 4,
    T7: 5,
    CN: 6,
    THU_2: 0,
    THU_3: 1,
    THU_4: 2,
    THU_5: 3,
    THU_6: 4,
    THU_7: 5,
    CHU_NHAT: 6,
  };

  const offset = THU_INDEX_MAP[targetThu] ?? 2;
  let monday;
  if (baseDate) {
    monday = getMondayOfDate(baseDate);
  } else if (fallbackWeek && fallbackYear) {
    monday = getMondayOfWeek(fallbackWeek, fallbackYear);
  } else {
    monday = getMondayOfDate(new Date());
  }

  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + offset);
  return formatDateYMD(targetDate);
}

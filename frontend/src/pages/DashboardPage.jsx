import React from 'react';
import Header from '../components/Header';
import MiniCalendar from '../components/MiniCalendar';
import CalendarLegend from '../components/CalendarLegend';
import TodayProgressWidget from '../components/TodayProgressWidget';
import WeekCalendarGrid from '../components/WeekCalendarGrid';
import TaskFormModal from '../components/TaskFormModal';
import AiScannerModal from '../components/AiScannerModal';
import NotificationToast from '../components/NotificationToast';
import { TaskProvider, useTasks } from '../context/TaskContext';

function DashboardContent() {
  const {
    isTaskModalOpen,
    editingTask,
    closeTaskModal,
    openEditModal,
    createTask,
    updateTaskInstance,
    updateTaskSeries,
    deleteTask,
    deleteTaskSeries,
    reloadTasks,
    tasks,
    // AI Scanner Modal & Toast Notification
    isAiScannerOpen,
    closeAiScanner,
    addScannedSchedule,
    notificationToast,
    closeToast,
  } = useTasks();

  const handleViewToastDetail = () => {
    // Tìm chính xác công việc tương ứng theo id / maCongViec để mở modal xem chi tiết
    const toastId = notificationToast?.id || notificationToast?.maCongViec;
    const matched = tasks.find((t) => 
      (toastId && (String(t.id) === String(toastId) || String(t.maCongViec) === String(toastId))) ||
      (notificationToast?.tieuDe && t.tieuDe?.toLowerCase() === notificationToast?.tieuDe?.toLowerCase())
    ) || tasks[0];

    if (matched) {
      openEditModal(matched);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcebee] flex flex-col selection:bg-indigo-500/20 selection:text-indigo-700 relative">
      {/* Top Header with Navigation, View Switcher & Today Progress Widget */}
      <Header />

      {/* Floating Notification Toast (Bám sát @ui-sample/Thông báo sự kiện.png) */}
      <NotificationToast
        isOpen={notificationToast.isOpen}
        onClose={closeToast}
        notification={notificationToast}
        onViewDetail={handleViewToastDetail}
        autoClose={true}
        duration={9000}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-[1780px] w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-4 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-3.5">
          {/* Mini Calendar */}
          <MiniCalendar />

          {/* Calendar Category Filter / Legend */}
          <CalendarLegend />

          {/* Sidebar Today Progress Card (Clicking opens popover checklist) */}
          <TodayProgressWidget variant="sidebar" />
        </aside>

        {/* RIGHT AREA: 7-DAY WEEK CALENDAR GRID */}
        <main className="flex-1 w-full min-w-0">
          <WeekCalendarGrid />
        </main>
      </div>

      {/* TASK FORM MODAL (THÊM / CHỈNH SỬA CÔNG VIỆC & LỰA CHỌN CHUỖI LẶP LẠI) */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        mode={editingTask ? 'edit' : 'create'}
        task={editingTask}
        congViecDangSua={editingTask}
        tasks={tasks}
        onClose={closeTaskModal}
        onCreate={createTask}
        onUpdateSingle={updateTaskInstance}
        onUpdateSeries={updateTaskSeries}
        onDelete={deleteTask}
        onDeleteSeries={deleteTaskSeries}
        onDataReload={reloadTasks}
      />

      {/* MODAL QUÉT ẢNH TKB BẰNG AI (BƯỚC 1: UPLOAD & BƯỚC 2: PREVIEW) */}
      <AiScannerModal
        isOpen={isAiScannerOpen}
        onClose={closeAiScanner}
        onConfirmSchedule={addScannedSchedule}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  Loader2, 
  Calendar, 
  Trash2, 
  Plus, 
  Check, 
  FileText,
  AlertCircle,
  Key,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import quetAiService, { MOCK_AI_SCAN_RESULT } from '../services/quetAiService';
import { formatDateYMD, getMondayOfDate } from '../utils/dateUtils';

const THU_OPTIONS = [
  { value: 'T2', label: 'T2' },
  { value: 'T3', label: 'T3' },
  { value: 'T4', label: 'T4' },
  { value: 'T5', label: 'T5' },
  { value: 'T6', label: 'T6' },
  { value: 'T7', label: 'T7' },
  { value: 'CN', label: 'CN' },
];

/**
 * Component Modal quét ảnh thời khóa biểu bằng AI
 * Bước 1: Upload & cấu hình AI Key (theo @ui-sample/tải ảnh.png)
 * Bước 2: Preview & Editable Table (theo @ui-sample/xem trước.png)
 */
export default function AiScannerModal({
  isOpen,
  onClose,
  onConfirmSchedule,
}) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scanSource, setScanSource] = useState(''); // 'backend-gemini-ai' | 'client-gemini-vision' | 'mock-sample-ui'

  // Quản lý Gemini API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isKeyConfigOpen, setIsKeyConfigOpen] = useState(false);

  // Bước 2: Danh sách môn học trích xuất được
  const [courses, setCourses] = useState(MOCK_AI_SCAN_RESULT);

  // Mặc định ngày bắt đầu là Thứ 2 của tuần hiện tại, kết thúc sau 3 tháng
  const [startDate, setStartDate] = useState(() => {
    const monday = getMondayOfDate(new Date());
    return formatDateYMD(monday);
  });
  const [endDate, setEndDate] = useState(() => {
    const monday = getMondayOfDate(new Date());
    const threeMonthsLater = new Date(monday);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return formatDateYMD(threeMonthsLater);
  });

  // Kiểm tra tính hợp lệ của API Key
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState(null); // { valid: boolean, message: string }

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    }
  }, [apiKey]);

  // Reset về trạng thái ban đầu khi đóng hoặc tải lại
  const handleResetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsAnalyzing(false);
    setIsSaving(false);
    setErrorMessage('');
    setScanSource('');
    setCourses(JSON.parse(JSON.stringify(MOCK_AI_SCAN_RESULT)));
  };

  const handleClose = () => {
    handleResetModal();
    onClose();
  };

  // Xử lý chọn tệp từ máy tính
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  // Kiểm tra tính hợp lệ của file (PNG, JPG, WebP <= 5MB)
  const validateAndSetFile = (file) => {
    if (!file) return;
    setErrorMessage('');

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Định dạng tệp không hợp lệ. Vui lòng chọn ảnh PNG, JPG hoặc WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh vượt quá giới hạn 5MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Kéo thả Dropzone
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyTestResult({ valid: false, message: 'Vui lòng dán API Key trước khi kiểm tra.' });
      return;
    }
    setIsTestingKey(true);
    setKeyTestResult(null);
    try {
      const res = await quetAiService.kiemTraApiKey(apiKey);
      setKeyTestResult(res);
    } catch (err) {
      setKeyTestResult({ valid: false, message: err.message || 'Lỗi kiểm tra key.' });
    } finally {
      setIsTestingKey(false);
    }
  };

  // Kích hoạt phân tích ảnh với AI
  const handleAnalyzeImage = async (useDemo = false) => {
    if (!useDemo && !selectedFile) {
      setErrorMessage('Vui lòng chọn hoặc kéo thả tệp ảnh thời khóa biểu.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const res = await quetAiService.phanTichAnhTkb(selectedFile, apiKey, useDemo);

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setCourses(res.data);
        setScanSource(res.source || '');
        setStep(2); // Chuyển sang Bước 2: Xem trước và chỉnh sửa
      } else {
        if (res.requireApiKey) {
          setIsKeyConfigOpen(true);
        }
        setErrorMessage(res.message || 'Không nhận diện được môn học nào trong ảnh. Hãy thử lại với ảnh rõ hơn.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi phân tích ảnh.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chọn dùng TKB mẫu demo
  const handleUseDemoSample = () => {
    setSelectedFile({ name: 'thoi_khoa_bieu_mau_hk1.png', size: 1048576, type: 'image/png' });
    setErrorMessage('');
    handleAnalyzeImage(true);
  };

  // Bước 2: Cập nhật thông tin dòng môn học
  const handleCourseChange = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Bước 2: Xóa 1 môn học
  const handleDeleteCourse = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Bước 2: Thêm 1 môn học thủ công
  const handleAddCourse = () => {
    const newCourse = {
      id: `manual_${Date.now()}`,
      tenMonHoc: '',
      thu: 'T2',
      khungGio: '08:00 - 11:00',
      phongHoc: '',
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  // Bước 2: Xác nhận thêm vào lịch trình
  const handleConfirm = async () => {
    if (courses.length === 0) {
      setErrorMessage('Danh sách môn học đang rỗng. Vui lòng thêm ít nhất một môn học.');
      return;
    }

    setIsSaving(true);
    try {
      if (onConfirmSchedule) {
        await onConfirmSchedule(courses, {
          startDate,
          endDate,
        });
      }
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Lỗi khi lưu lịch trình. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  // Format ngày dạng DD/MM/YYYY để hiển thị
  const formatDateDisplay = (isoStr) => {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoStr;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`bg-white rounded-3xl shadow-2xl border border-gray-100 w-full transition-all duration-200 overflow-hidden ${
          step === 1 ? 'max-w-lg' : 'max-w-3xl'
        }`}
      >
        {/* ==================== BƯỚC 1: UPLOAD ẢNH (tải ảnh.png) ==================== */}
        {step === 1 && (
          <div className="p-6 sm:p-7">
            {/* Header Modal */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">
                  Trợ lý AI - Nhập lịch tự động từ ảnh
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  Tải lên ảnh chụp màn hình thời khóa biểu để AI tự động trích xuất các môn học
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 rounded-xl p-1 transition-colors cursor-pointer shrink-0 ml-3"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Dropzone Area (Nét đứt bo góc) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-4 border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#4f46e5] bg-[#eff2fe] scale-[1.01]'
                  : selectedFile
                  ? 'border-[#6366f1]/60 bg-[#f8f9ff]'
                  : 'border-[#818cf8]/50 hover:border-[#6366f1] bg-[#f8f9ff]/70 hover:bg-[#f8f9ff]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Cloud Upload Icon */}
              <div className="w-13 h-13 mx-auto rounded-full bg-indigo-50/80 flex items-center justify-center text-[#4f46e5] mb-2.5">
                <UploadCloud className="w-7 h-7 stroke-[2]" />
              </div>

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  {previewUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-indigo-200 mb-2.5 shadow-xs bg-white flex items-center justify-center">
                      <img src={previewUrl} alt="Preview TKB" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 rounded-xl shadow-xs text-xs sm:text-sm font-semibold text-indigo-900">
                    <FileText className="w-4 h-4 text-[#4f46e5]" />
                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                    <span className="text-gray-400 font-normal">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mt-2 hover:underline">
                    Bấm để chọn ảnh khác
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">
                    Kéo thả ảnh thời khóa biểu vào đây
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    hoặc <span className="text-[#4f46e5] font-semibold underline underline-offset-2">bấm để chọn tệp</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-2.5">
                    Hỗ trợ PNG, JPG, WebP tối đa 5MB
                  </p>
                </>
              )}
            </div>

            {/* Quick Demo Helper & API Key toggle */}
            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleUseDemoSample}
                  className="text-gray-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>💡 Dùng ảnh TKB mẫu để thử nhanh</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsKeyConfigOpen((v) => !v)}
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{apiKey ? 'Đã có Gemini API Key' : 'Cấu hình Gemini API Key'}</span>
                </button>
              </div>

              {/* Ô cấu hình Gemini API Key */}
              {isKeyConfigOpen && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-indigo-600" />
                      Google Gemini API Key:
                    </span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Lấy key miễn phí</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          setKeyTestResult(null);
                        }}
                        placeholder="Dán key bắt đầu bằng AIzaSy... vào đây"
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey((v) => !v)}
                        className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        title={showApiKey ? 'Ẩn key' : 'Hiện key'}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleTestApiKey}
                      disabled={isTestingKey || !apiKey.trim()}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl font-medium text-xs transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1"
                    >
                      {isTestingKey ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Kiểm tra...</span>
                        </>
                      ) : (
                        <span>Kiểm tra key</span>
                      )}
                    </button>
                  </div>

                  {/* Kết quả kiểm tra Key */}
                  {keyTestResult && (
                    <div
                      className={`p-2 rounded-xl flex items-start gap-2 text-[11px] leading-tight ${
                        keyTestResult.valid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                    >
                      {keyTestResult.valid ? (
                        <Check className="w-3.5 h-3.5 shrink-0 stroke-[2.5] text-emerald-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                      )}
                      <span>{keyTestResult.message}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 Key được lưu an toàn tại trình duyệt của bạn và dùng trực tiếp để phân tích ảnh thời khóa biểu qua mô hình Gemini Vision.
                  </p>
                </div>
              )}
            </div>

            {/* Action Button: Phân tích ảnh với AI */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => handleAnalyzeImage(false)}
                disabled={isAnalyzing || !selectedFile}
                className="w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm sm:text-base bg-[#4f46e5] hover:bg-[#4338ca] active:scale-[0.99] shadow-md shadow-indigo-200 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>AI đang phân tích và đọc thời khóa biểu...</span>
                  </>
                ) : (
                  <>
                    <span>Phân tích ảnh với AI</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ==================== BƯỚC 2: PREVIEW & EDITABLE TABLE (xem trước.png) ==================== */}
        {step === 2 && (
          <div className="p-6 sm:p-7">
            {/* Header Modal */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">
                  Kết quả phân tích từ AI
                </h3>

                {/* Badge nhận diện thành công */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#ecfdf5] text-[#15803d] border border-[#bbf7d0]">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Đã nhận diện thành công {courses.length} môn học</span>
                  </div>

                  {scanSource === 'client-gemini-vision' || scanSource === 'backend-gemini-ai' ? (
                    <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full font-medium">
                      ✨ Phân tích từ ảnh thật (Gemini AI)
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-medium">
                      💡 Chế độ dữ liệu mẫu
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Kiểm tra và chỉnh sửa lại thông tin các môn học nếu có sai sót trước khi thêm vào lịch.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 rounded-xl p-1 transition-colors cursor-pointer shrink-0 ml-3"
                aria-label="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BẢNG EDITABLE TABLE CÁC MÔN HỌC */}
            <div className="mt-4 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
              {/* Table Header */}
              <div className="bg-[#f8fafc] px-4 py-2.5 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-700 border-b border-gray-100">
                <div className="col-span-4 sm:col-span-4">Tên môn học</div>
                <div className="col-span-2 sm:col-span-2">Thứ</div>
                <div className="col-span-3 sm:col-span-3">Khung giờ</div>
                <div className="col-span-2 sm:col-span-2">Phòng học</div>
                <div className="col-span-1 text-center"></div>
              </div>

              {/* Table Body (Editable Rows) */}
              <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-100 p-1 space-y-1">
                {courses.length === 0 ? (
                  <div className="py-8 text-center text-xs sm:text-sm text-gray-400">
                    Chưa có môn học nào. Hãy bấm "+ Thêm môn học" bên dưới.
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Tên môn học */}
                      <div className="col-span-4 sm:col-span-4">
                        <input
                          type="text"
                          value={course.tenMonHoc}
                          onChange={(e) => handleCourseChange(course.id, 'tenMonHoc', e.target.value)}
                          placeholder="Tên môn học"
                          className="w-full px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      {/* Thứ */}
                      <div className="col-span-2 sm:col-span-2">
                        <select
                          value={course.thu}
                          onChange={(e) => handleCourseChange(course.id, 'thu', e.target.value)}
                          className="w-full px-2 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer transition-all"
                        >
                          {THU_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Khung giờ */}
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="text"
                          value={course.khungGio}
                          onChange={(e) => handleCourseChange(course.id, 'khungGio', e.target.value)}
                          placeholder="08:00 - 11:00"
                          className="w-full px-2.5 py-2 text-xs sm:text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      {/* Phòng học */}
                      <div className="col-span-2 sm:col-span-2">
                        <input
                          type="text"
                          value={course.phongHoc}
                          onChange={(e) => handleCourseChange(course.id, 'phongHoc', e.target.value)}
                          placeholder="A3-402"
                          className="w-full px-2.5 py-2 text-xs sm:text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-[#4f46e5] focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                      </div>

                      {/* Nút Xóa */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa môn học này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Nút Thêm môn học */}
              <div className="p-2 bg-gray-50/50 border-t border-gray-100 flex justify-start">
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="px-3 py-1.5 text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm môn học</span>
                </button>
              </div>
            </div>

            {/* Thời gian áp dụng học kỳ */}
            <div className="mt-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5">
                Thời gian áp dụng học kỳ:
              </label>
              
              <div className="border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
                  <span>
                    Từ <strong className="text-gray-900">{formatDateDisplay(startDate)}</strong> đến <strong className="text-gray-900">{formatDateDisplay(endDate)}</strong>
                  </span>
                </div>

                {/* Date Inputs chỉnh sửa linh hoạt */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-indigo-500"
                    title="Ngày bắt đầu học kỳ"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-indigo-500"
                    title="Ngày kết thúc học kỳ"
                  />
                </div>
              </div>
            </div>

            {/* Nút hành động Footer */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Tải ảnh khác
              </button>

              <div className="w-full sm:w-auto flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm bg-[#4f46e5] hover:bg-[#4338ca] shadow-sm shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang lưu vào lịch trình...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Xác nhận thêm vào lịch trình</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

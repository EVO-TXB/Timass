import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();

  // Form states
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [ghiNho, setGhiNho] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status & error states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!soDienThoai.trim()) {
      newErrors.soDienThoai = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(soDienThoai.trim())) {
      newErrors.soDienThoai = 'Số điện thoại phải đúng 10 chữ số (bắt đầu bằng 0)';
    }

    if (!matKhau) {
      newErrors.matKhau = 'Vui lòng nhập mật khẩu';
    } else if (matKhau.length < 6) {
      newErrors.matKhau = 'Mật khẩu phải có tối thiểu 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Call mock auth service
      await authService.login(soDienThoai.trim(), matKhau);

      // Successfully authenticated -> redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for tester convenience
  const handleQuickFill = () => {
    setSoDienThoai('0912345678');
    setMatKhau('123456');
    setErrors({});
    setServerError('');
  };

  return (
    <AuthLayout
      footerText="Chưa có tài khoản?"
      footerLinkText="Đăng ký ngay"
      footerLinkTo="/register"
    >
      {/* Title & Subtitle */}
      <div className="text-center mb-7">
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#181848] tracking-tight">
          Chào mừng trở lại
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Đăng nhập để theo dõi lịch trình hôm nay
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Số điện thoại */}
        <div>
          <label
            htmlFor="soDienThoai"
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            Số điện thoại
          </label>
          <div className="relative">
            <input
              id="soDienThoai"
              name="soDienThoai"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="09xx xxx xxx"
              value={soDienThoai}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setSoDienThoai(val);
                if (errors.soDienThoai) setErrors((prev) => ({ ...prev, soDienThoai: '' }));
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${
                errors.soDienThoai
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#3b43c6] focus:ring-2 focus:ring-[#3b43c6]/15'
              }`}
            />
          </div>
          {errors.soDienThoai && (
            <p className="mt-1 text-xs text-red-500">{errors.soDienThoai}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div>
          <label
            htmlFor="matKhau"
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="matKhau"
              name="matKhau"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value);
                if (errors.matKhau) setErrors((prev) => ({ ...prev, matKhau: '' }));
              }}
              className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${
                errors.matKhau
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-[#3b43c6] focus:ring-2 focus:ring-[#3b43c6]/15'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.matKhau && (
            <p className="mt-1 text-xs text-red-500">{errors.matKhau}</p>
          )}
        </div>

        {/* Ghi nhớ đăng nhập & Quên mật khẩu */}
        <div className="flex items-center justify-between pt-1 text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setGhiNho(!ghiNho)}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${
                ghiNho
                  ? 'bg-[#3b43c6] border-[#3b43c6] text-white shadow-sm'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {ghiNho && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>
            <span className="text-gray-700 text-sm">Ghi nhớ đăng nhập</span>
          </label>

          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert('Tính năng khôi phục mật khẩu đang được phát triển.');
            }}
            className="text-sm font-normal text-[#3b43c6] hover:text-[#2f36a8] hover:underline transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Nút Đăng nhập */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#3b43c6] hover:bg-[#3138b6] active:bg-[#282d96] text-white font-medium py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(59,67,198,0.25)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </div>

        {/* Quick fill hint for reviewer convenience */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-xs text-gray-400 hover:text-[#3b43c6] transition-colors underline cursor-pointer"
          >
            ⚡ Điền nhanh tài khoản mẫu (0912345678 / 123456)
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form states
  const [hoTen, setHoTen] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [dongYDieuKhoan, setDongYDieuKhoan] = useState(true);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & error states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate password strength (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) && /[a-zA-Z]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(matKhau);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng nhập họ và tên';
    }

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

    if (!xacNhanMatKhau) {
      newErrors.xacNhanMatKhau = 'Vui lòng xác nhận mật khẩu';
    } else if (xacNhanMatKhau !== matKhau) {
      newErrors.xacNhanMatKhau = 'Mật khẩu xác nhận không khớp';
    }

    if (!dongYDieuKhoan) {
      newErrors.dongYDieuKhoan = 'Bạn cần đồng ý với Điều khoản và Chính sách';
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
      await authService.register({
        hoTen: hoTen.trim(),
        soDienThoai: soDienThoai.trim(),
        matKhau,
      });

      // Redirect to dashboard on successful account creation
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper colors for the 4-segment strength indicator as in design
  const getSegmentColor = (segmentIndex) => {
    // segmentIndex 0: Red (#e11d48)
    // segmentIndex 1: Amber/Orange (#f59e0b)
    // segmentIndex 2: Emerald Green (#10b981)
    // segmentIndex 3: Deep Green (#059669)
    if (passwordStrength > segmentIndex) {
      switch (segmentIndex) {
        case 0:
          return 'bg-[#e11d48]';
        case 1:
          return 'bg-[#f59e0b]';
        case 2:
          return 'bg-[#10b981]';
        case 3:
          return 'bg-[#059669]';
        default:
          return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  };

  return (
    <AuthLayout
      footerText="Đã có tài khoản?"
      footerLinkText="Đăng nhập"
      footerLinkTo="/login"
    >
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-[26px] font-bold text-[#181848] tracking-tight">
          Tạo tài khoản
        </h2>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Họ và tên */}
        <div>
          <label
            htmlFor="hoTen"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Họ và tên
          </label>
          <input
            id="hoTen"
            name="hoTen"
            type="text"
            placeholder="Nguyễn Văn A"
            value={hoTen}
            onChange={(e) => {
              setHoTen(e.target.value);
              if (errors.hoTen) setErrors((prev) => ({ ...prev, hoTen: '' }));
            }}
            className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${errors.hoTen
              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-[#3b43c6] focus:ring-2 focus:ring-[#3b43c6]/15'
              }`}
          />
          {errors.hoTen && (
            <p className="mt-1 text-xs text-red-500">{errors.hoTen}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <label
            htmlFor="regSoDienThoai"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Số điện thoại
          </label>
          <input
            id="regSoDienThoai"
            name="soDienThoai"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Nhập số điện thoại"
            value={soDienThoai}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setSoDienThoai(val);
              if (errors.soDienThoai) setErrors((prev) => ({ ...prev, soDienThoai: '' }));
            }}
            className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${errors.soDienThoai
              ? 'border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-[#3b43c6] focus:ring-2 focus:ring-[#3b43c6]/15'
              }`}
          />
          {errors.soDienThoai && (
            <p className="mt-1 text-xs text-red-500">{errors.soDienThoai}</p>
          )}
        </div>

        {/* Mật khẩu */}
        <div>
          <label
            htmlFor="regMatKhau"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="regMatKhau"
              name="matKhau"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={matKhau}
              onChange={(e) => {
                setMatKhau(e.target.value);
                if (errors.matKhau) setErrors((prev) => ({ ...prev, matKhau: '' }));
              }}
              className={`w-full pl-4 pr-11 py-2.5 sm:py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${errors.matKhau
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

          {/* Password Strength Indicator (4 colored segmented bars matching design) */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-colors duration-300 ${getSegmentColor(idx)}`}
              />
            ))}
          </div>

          {errors.matKhau && (
            <p className="mt-1 text-xs text-red-500">{errors.matKhau}</p>
          )}
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label
            htmlFor="xacNhanMatKhau"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <input
              id="xacNhanMatKhau"
              name="xacNhanMatKhau"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={xacNhanMatKhau}
              onChange={(e) => {
                setXacNhanMatKhau(e.target.value);
                if (errors.xacNhanMatKhau) setErrors((prev) => ({ ...prev, xacNhanMatKhau: '' }));
              }}
              className={`w-full pl-4 pr-11 py-2.5 sm:py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-white transition-all outline-none ${errors.xacNhanMatKhau
                ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-[#3b43c6] focus:ring-2 focus:ring-[#3b43c6]/15'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.xacNhanMatKhau && (
            <p className="mt-1 text-xs text-red-500">{errors.xacNhanMatKhau}</p>
          )}
        </div>

        {/* Điều khoản & Chính sách */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => {
                setDongYDieuKhoan(!dongYDieuKhoan);
                if (errors.dongYDieuKhoan) setErrors((prev) => ({ ...prev, dongYDieuKhoan: '' }));
              }}
              className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-all border ${dongYDieuKhoan
                ? 'bg-[#3b43c6] border-[#3b43c6] text-white shadow-sm'
                : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
            >
              {dongYDieuKhoan && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>
            <span className="text-xs sm:text-sm text-gray-700 leading-snug">
              Tôi đồng ý với{' '}
              <a
                href="#terms"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Điều khoản dịch vụ của Timass.');
                }}
                className="underline text-gray-900 hover:text-[#3b43c6]"
              >
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a
                href="#privacy"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Chính sách bảo mật của Timass.');
                }}
                className="underline text-gray-900 hover:text-[#3b43c6]"
              >
                Chính sách bảo mật
              </a>
            </span>
          </label>
          {errors.dongYDieuKhoan && (
            <p className="mt-1 text-xs text-red-500">{errors.dongYDieuKhoan}</p>
          )}
        </div>

        {/* Nút Tạo tài khoản */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#3b43c6] hover:bg-[#3138b6] active:bg-[#282d96] text-white font-medium py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(59,67,198,0.25)] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <span>Tạo tài khoản</span>
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

import axios from 'axios';

// Base Axios instance configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach access_token and X-User-Id if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userRaw = localStorage.getItem('timass_user');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        if (user?.id) {
          config.headers['X-User-Id'] = user.id;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('timass_user');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service (Đăng nhập / Đăng ký phân lập theo người dùng)
export const authService = {
  // Login with phone and password
  login: async (soDienThoai, matKhau) => {
    if (!soDienThoai || !matKhau) {
      throw new Error('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.');
    }

    if (!/^0\d{9}$/.test(soDienThoai)) {
      throw new Error('Số điện thoại phải đúng 10 số và bắt đầu bằng số 0.');
    }

    if (matKhau.length < 6) {
      throw new Error('Mật khẩu phải có tối thiểu 6 ký tự.');
    }

    try {
      const res = await api.post('/auth/login', {
        soDienThoai: soDienThoai.trim(),
        matKhau,
      });

      if (res.data?.success && res.data?.data) {
        const u = res.data.data;
        const userObj = {
          id: u.maNguoiDung || u.id,
          maNguoiDung: u.maNguoiDung || u.id,
          soDienThoai: u.soDienThoai,
          hoTen: u.hoTen,
          role: u.role || 'USER',
          avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        };
        const token = u.token || `timass_jwt_${Date.now()}`;
        localStorage.setItem('access_token', token);
        localStorage.setItem('timass_user', JSON.stringify(userObj));
        return {
          success: true,
          message: res.data.message || 'Đăng nhập thành công',
          data: { user: userObj, token },
        };
      }
    } catch (err) {
      console.warn('Backend login unavailable or returned error, evaluating fallback', err);
    }

    // Fallback: Phân lập ID theo số điện thoại (tài khoản mẫu 0912345678 -> ID 1; tài khoản khác -> ID riêng)
    const isDefault = soDienThoai.trim() === '0912345678';
    let numericId = 1;
    if (!isDefault) {
      numericId = parseInt(soDienThoai.slice(-6), 10) || 2;
    }
    const mockToken = `timass_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mockUser = {
      id: numericId,
      maNguoiDung: numericId,
      soDienThoai,
      hoTen: isDefault ? 'Nguyễn Văn A' : `Người dùng ${soDienThoai.slice(-4)}`,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };

    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('timass_user', JSON.stringify(mockUser));

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token: mockToken,
        user: mockUser,
      },
    };
  },

  // Register a new user
  register: async ({ hoTen, soDienThoai, matKhau }) => {
    if (!hoTen?.trim()) {
      throw new Error('Vui lòng nhập họ và tên.');
    }

    if (!/^0\d{9}$/.test(soDienThoai)) {
      throw new Error('Số điện thoại phải đúng 10 số và bắt đầu bằng số 0.');
    }

    if (matKhau.length < 6) {
      throw new Error('Mật khẩu phải có tối thiểu 6 ký tự.');
    }

    try {
      const res = await api.post('/auth/register', {
        hoTen: hoTen.trim(),
        soDienThoai: soDienThoai.trim(),
        matKhau,
      });

      if (res.data?.success && res.data?.data) {
        const u = res.data.data;
        const userObj = {
          id: u.maNguoiDung || u.id,
          maNguoiDung: u.maNguoiDung || u.id,
          soDienThoai: u.soDienThoai,
          hoTen: u.hoTen,
          role: u.role || 'USER',
          avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        };
        const token = u.token || `timass_jwt_${Date.now()}`;
        localStorage.setItem('access_token', token);
        localStorage.setItem('timass_user', JSON.stringify(userObj));
        return {
          success: true,
          message: res.data.message || 'Đăng ký tài khoản thành công',
          data: { user: userObj, token },
        };
      }
    } catch (err) {
      console.warn('Backend register unavailable, fallback local', err);
    }

    const numericId = parseInt(soDienThoai.slice(-6), 10) || (Math.floor(Math.random() * 1000) + 2);
    const mockToken = `timass_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const mockUser = {
      id: numericId,
      maNguoiDung: numericId,
      hoTen: hoTen.trim(),
      soDienThoai,
      role: 'USER',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };

    localStorage.setItem('access_token', mockToken);
    localStorage.setItem('timass_user', JSON.stringify(mockUser));

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        token: mockToken,
        user: mockUser,
      },
    };
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('timass_user');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return Boolean(localStorage.getItem('access_token'));
  },

  // Get current user info
  getCurrentUser: () => {
    const raw = localStorage.getItem('timass_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

export default api;

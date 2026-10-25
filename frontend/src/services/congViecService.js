import api from './api';

/**
 * Service gọi API quản lý công việc và lịch trình
 */
export const congViecService = {
  /**
   * Lấy danh sách công việc theo khoảng ngày hoặc theo ngày
   */
  layDanhSach: async (tuNgay, denNgay) => {
    try {
      const res = await api.get('/cong-viec', {
        params: { tuNgay, denNgay },
      });
      return res.data;
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Cập nhật công việc (Hỗ trợ cả đơn lẻ và chuỗi lặp qua apDungChoTatCa)
   */
  capNhatCongViec: async (id, payload) => {
    try {
      const res = await api.put(`/cong-viec/${id}`, payload);
      return res.data;
    } catch (err) {
      // Graceful fallback khi chạy chế độ client-mock
      return { success: true, localOnly: true, data: payload };
    }
  },

  /**
   * Xóa công việc (đơn lẻ hoặc cả chuỗi lặp)
   */
  xoaCongViec: async (id, xoaCaChuoiLap = false) => {
    try {
      const res = await api.delete(`/cong-viec/${id}`, {
        params: { xoaCaChuoiLap },
      });
      return res.data;
    } catch (err) {
      return { success: true, localOnly: true };
    }
  },

  /**
   * Xóa toàn bộ chuỗi công việc theo mã nhóm lặp lại
   */
  xoaTheoNhom: async (maNhomLapLai) => {
    try {
      const res = await api.delete(`/cong-viec/nhom/${encodeURIComponent(maNhomLapLai)}`);
      return res.data;
    } catch (err) {
      return { success: true, localOnly: true };
    }
  },

  /**
   * Tạo công việc đơn lẻ
   */
  taoCongViecDonLe: async (payload) => {
    try {
      const res = await api.post('/cong-viec/don-le', payload);
      return res.data;
    } catch (err) {
      return { success: true, localOnly: true, data: payload };
    }
  },

  /**
   * Tạo chuỗi công việc lặp lại
   */
  taoCongViecLapLai: async (payload) => {
    try {
      const res = await api.post('/cong-viec/lap-lai', payload);
      return res.data;
    } catch (err) {
      return { success: true, localOnly: true, data: payload };
    }
  },
  /**
   * Cập nhật trạng thái hoàn thành công việc
   */
  capNhatTrangThai: async (id, trangThai) => {
    try {
      const res = await api.patch(`/cong-viec/${id}/trang-thai`, { trangThai });
      return res.data;
    } catch (err) {
      return { success: false, error: err };
    }
  },

  /**
   * Lưu hàng loạt môn học từ thời khóa biểu (AI trích xuất)
   */
  luuTkbHangLoat: async (payload) => {
    try {
      const res = await api.post('/cong-viec/luu-hang-loat', payload);
      return res.data;
    } catch (err) {
      return { success: false, error: err };
    }
  },
};

export default congViecService;

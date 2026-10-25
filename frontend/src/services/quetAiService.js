import api from './api';

// Chuẩn hóa tên thứ sang ký hiệu UI (T2, T3, ..., CN)
export const normalizeBackendDayToUI = (thuRaw) => {
  if (!thuRaw) return 'T2';
  const clean = thuRaw.toString().trim().toLowerCase();
  if (clean.includes('2') || clean.includes('hai') || clean.includes('mon')) return 'T2';
  if (clean.includes('3') || clean.includes('ba') || clean.includes('tue')) return 'T3';
  if (clean.includes('4') || clean.includes('tư') || clean.includes('tu') || clean.includes('wed')) return 'T4';
  if (clean.includes('5') || clean.includes('năm') || clean.includes('nam') || clean.includes('thu')) return 'T5';
  if (clean.includes('6') || clean.includes('sáu') || clean.includes('sau') || clean.includes('fri')) return 'T6';
  if (clean.includes('7') || clean.includes('bảy') || clean.includes('bay') || clean.includes('sat')) return 'T7';
  if (clean.includes('nhật') || clean.includes('nhat') || clean.includes('cn') || clean.includes('sun') || clean === '1' || clean === '8') return 'CN';
  return 'T2';
};

// Dữ liệu mẫu nhận diện bám sát chuẩn thiết kế @ui-sample/xem trước.png (chỉ dùng khi ấn 'Dùng TKB mẫu')
export const MOCK_AI_SCAN_RESULT = [
  {
    id: 'tkb_1',
    tenMonHoc: 'Học Lập trình Web',
    thu: 'T2',
    khungGio: '08:00 - 11:00',
    phongHoc: 'A3-402',
  },
  {
    id: 'tkb_2',
    tenMonHoc: 'Toán rời rạc',
    thu: 'T3',
    khungGio: '09:30 - 11:30',
    phongHoc: 'B1-201',
  },
  {
    id: 'tkb_3',
    tenMonHoc: 'Anh văn giao tiếp',
    thu: 'T4',
    khungGio: '13:00 - 15:30',
    phongHoc: 'C2-302',
  },
  {
    id: 'tkb_4',
    tenMonHoc: 'Học TOEIC',
    thu: 'T5',
    khungGio: '18:00 - 20:00',
    phongHoc: 'A2-501',
  },
];

// Làm sạch API key (loại bỏ khoảng trắng, dấu nháy kép/đơn)
export const cleanApiKey = (rawKey) => {
  if (!rawKey) return '';
  return String(rawKey).trim().replace(/^["']|["']$/g, '').trim();
};

// Chuyển File thành chuỗi Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64String = result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Không thể đọc file ảnh'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Trích xuất JSON từ chuỗi phản hồi của AI một cách linh hoạt và an toàn
const extractJsonFromText = (rawText) => {
  if (!rawText) return null;

  // 1. Xóa các markdown tick ```json ... ```
  let text = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

  // 2. Thử parse trực tiếp
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) {
      for (const k of Object.keys(parsed)) {
        if (Array.isArray(parsed[k])) return parsed[k];
      }
    }
  } catch {
    // Không parse được trực tiếp, chuyển sang regex
  }

  // 3. Regex tìm mảng JSON [ { ... } ]
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) {
    try {
      const arr = JSON.parse(arrayMatch[0]);
      if (Array.isArray(arr)) return arr;
    } catch {
      // ignore
    }
  }

  // 4. Regex tìm object JSON { ... }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      const obj = JSON.parse(objMatch[0]);
      for (const k of Object.keys(obj)) {
        if (Array.isArray(obj[k])) return obj[k];
      }
    } catch {
      // ignore
    }
  }

  return null;
};

// Gọi trực tiếp Google Gemini Vision API (client-side fallback khi backend không có key hoặc gặp lỗi)
const callDirectGeminiVision = async (rawApiKey, base64Data, mimeType) => {
  const apiKey = cleanApiKey(rawApiKey);
  if (!apiKey) {
    throw new Error('Chưa cung cấp Gemini API Key.');
  }

  // Danh sách các model AI Vision tối ưu và hoạt động ổn định nhất
  const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastErrorMessage = '';

  // Đảm bảo mimeType chuẩn
  let safeMimeType = mimeType || 'image/jpeg';
  if (!safeMimeType.startsWith('image/')) {
    safeMimeType = 'image/jpeg';
  }

  const promptText = `
Bạn là chuyên gia AI Vision chuyên đọc và bóc tách thời khóa biểu, lịch học từ ảnh chụp màn hình hoặc ảnh scan tài liệu tiếng Việt.
Hãy đọc kỹ hình ảnh và trích xuất TOÀN BỘ các môn học / lớp học / sự kiện thành một JSON Array thuần.
Mỗi phần tử có các trường:
- "tenMonHoc": Tên môn học hoặc sự kiện (ví dụ: "Lập trình Web", "Toán rời rạc", "Cơ sở dữ liệu")
- "thuTrongTuan": Thứ trong tuần (chuẩn hóa: "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật")
- "gioBatDau": Giờ bắt đầu học (định dạng "HH:mm", ví dụ: "07:00", "08:30", "13:00")
- "gioKetThuc": Giờ kết thúc học (định dạng "HH:mm", ví dụ: "09:30", "11:30", "15:00")
- "phongHoc": Tên phòng học, giảng đường (ví dụ: "A3-402", "P.301", nếu không có để rỗng "")

Quy tắc bắt buộc:
- Chỉ trả về DUY NHẤT một chuỗi JSON Array bắt đầu bằng [ và kết thúc bằng ].
- Tuyệt đối không thêm văn bản dẫn dắt hay giải thích. Không dùng markdown ticks (\`\`\`json).
- Nếu ảnh không chứa thông tin môn học hoặc lịch biểu, trả về: []
`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType: safeMimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = resData?.error?.message || `HTTP ${response.status}`;
        const errorStatus = resData?.error?.status || '';

        if (errorStatus === 'API_KEY_INVALID' || errorMsg.includes('API key not valid')) {
          throw new Error('API Key không hợp lệ. Vui lòng kiểm tra lại key đã sao chép từ Google AI Studio.');
        } else if (response.status === 429 || errorStatus === 'RESOURCE_EXHAUSTED') {
          throw new Error('API Key đã tạm thời vượt quá giới hạn (Rate Limit). Vui lòng đợi khoảng 30 giây rồi thử lại.');
        } else if (response.status === 403) {
          throw new Error('API Key bị từ chối truy cập. Hãy đảm bảo API Key đã kích hoạt Generative Language API.');
        }

        lastErrorMessage = errorMsg;
        continue; // Thử model kế tiếp
      }

      const rawText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        lastErrorMessage = 'Gemini không trả về nội dung nhận diện.';
        continue;
      }

      const parsedItems = extractJsonFromText(rawText);
      if (Array.isArray(parsedItems)) {
        return parsedItems;
      }
    } catch (err) {
      if (err.message.includes('API Key không hợp lệ') || err.message.includes('Rate Limit')) {
        throw err;
      }
      lastErrorMessage = err.message || 'Lỗi kết nối tới AI';
    }
  }

  throw new Error(lastErrorMessage || 'Không thể phân tích ảnh qua Gemini AI.');
};

export const quetAiService = {
  /**
   * Kiểm tra nhanh tính hợp lệ của Gemini API Key
   */
  kiemTraApiKey: async (rawApiKey) => {
    const key = cleanApiKey(rawApiKey);
    if (!key) {
      return { valid: false, message: 'Vui lòng nhập API Key.' };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error?.message || `Lỗi HTTP ${res.status}`;
        if (msg.includes('API key not valid')) {
          return { valid: false, message: 'API Key không hợp lệ. Vui lòng tạo key mới tại Google AI Studio.' };
        }
        return { valid: false, message: msg };
      }

      return { valid: true, message: 'API Key hoàn toàn hợp lệ và sẵn sàng sử dụng!' };
    } catch (err) {
      return { valid: false, message: err.message || 'Không thể kết nối đến máy chủ Google Gemini.' };
    }
  },

  /**
   * Phân tích ảnh thời khóa biểu qua AI
   */
  phanTichAnhTkb: async (tepAnh, customApiKey = '', isDemo = false) => {
    // 1. Chế độ demo mẫu
    if (isDemo || tepAnh?.name === 'thoi_khoa_bieu_mau_hk1.png') {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        data: JSON.parse(JSON.stringify(MOCK_AI_SCAN_RESULT)),
        message: 'Đã nhận diện thành công 4 môn học từ TKB mẫu (Demo)',
        source: 'mock-sample-ui',
      };
    }

    if (!tepAnh) {
      return {
        success: false,
        message: 'Vui lòng chọn hoặc kéo thả tệp ảnh thời khóa biểu.',
      };
    }

    const savedApiKey = cleanApiKey(customApiKey || localStorage.getItem('gemini_api_key') || '');

    // 2. Thử gọi Backend API
    try {
      const formData = new FormData();
      formData.append('tepAnh', tepAnh);

      const headers = { 'Content-Type': 'multipart/form-data' };
      if (savedApiKey) {
        headers['X-Gemini-Api-Key'] = savedApiKey;
      }

      const res = await api.post('/ai/quet-tkb', formData, {
        headers,
        timeout: 25000,
      });

      if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mappedList = res.data.data.map((item, idx) => ({
          id: `tkb_${Date.now()}_${idx}`,
          tenMonHoc: item.tenMonHoc || 'Môn học mới',
          thu: normalizeBackendDayToUI(item.thuTrongTuan),
          khungGio: `${item.gioBatDau || '08:00'} - ${item.gioKetThuc || '11:00'}`,
          phongHoc: item.phongHoc || '',
        }));

        return {
          success: true,
          data: mappedList,
          message: res.data.message || 'Trích xuất thời khóa biểu thành công',
          source: 'backend-gemini-ai',
        };
      }
    } catch (backendErr) {
      console.warn('⚠️ Backend không thể quét ảnh hoặc chưa có key, chuyển sang gọi trực tiếp Gemini:', backendErr?.message);
    }

    // 3. Gọi trực tiếp Gemini Vision API từ client nếu có API Key
    if (savedApiKey) {
      try {
        const base64Data = await fileToBase64(tepAnh);
        const rawItems = await callDirectGeminiVision(savedApiKey, base64Data, tepAnh.type || 'image/jpeg');

        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const mappedList = rawItems.map((item, idx) => ({
            id: `tkb_${Date.now()}_${idx}`,
            tenMonHoc: item.tenMonHoc || item.ten_mon_hoc || 'Môn học mới',
            thu: normalizeBackendDayToUI(item.thuTrongTuan || item.thu_trong_tuan || item.thu),
            khungGio: `${item.gioBatDau || item.gio_bat_dau || '08:00'} - ${item.gioKetThuc || item.gio_ket_thuc || '11:00'}`,
            phongHoc: item.phongHoc || item.phong_hoc || '',
          }));

          return {
            success: true,
            data: mappedList,
            message: `AI đã nhận diện thành công ${mappedList.length} môn học từ ảnh của bạn!`,
            source: 'client-gemini-vision',
          };
        } else {
          return {
            success: false,
            message: 'AI không tìm thấy môn học nào trong ảnh. Hãy chụp rõ hơn hoặc cắt gọn phần thời khóa biểu.',
          };
        }
      } catch (clientErr) {
        return {
          success: false,
          requireApiKey: clientErr.message.includes('API Key'),
          message: clientErr.message || 'Không thể phân tích ảnh qua Gemini.',
        };
      }
    }

    // 4. Nếu chưa có API Key
    return {
      success: false,
      requireApiKey: true,
      message: 'Vui lòng dán Gemini API Key vào ô bên dưới để AI đọc ảnh thật của bạn (hoặc bấm "Dùng TKB mẫu" để thử nhanh).',
    };
  },
};

export default quetAiService;

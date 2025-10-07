/**
 * API Client Library
 * Helper functions để gọi API từ frontend components
 */

// Use Next.js API Routes (simpler, no CORS issues)
// Set to true if you want to call backend directly
const USE_DIRECT_BACKEND = false;
const API_BASE_URL = USE_DIRECT_BACKEND 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : '';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/${endpoint}` : `/api/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || 'API Error', data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error', error);
  }
}

/**
 * Generic CRUD operations
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

/**
 * Specific API endpoints
 */

// Users
export const usersApi = {
  getAll: () => api.get('users'),
  getById: (id: string) => api.get(`users/${id}`),
  create: (data: unknown) => api.post('users', data),
  update: (id: string, data: unknown) => api.put(`users/${id}`, data),
  delete: (id: string) => api.delete(`users/${id}`),
};

// Cơ sở
export const cosoApi = {
  getAll: () => api.get('coso'),
  getById: (id: string) => api.get(`coso/${id}`),
  create: (data: unknown) => api.post('coso', data),
  update: (id: string, data: unknown) => api.put(`coso/${id}`, data),
  delete: (id: string) => api.delete(`coso/${id}`),
};

// Hạng phòng
export const hangPhongApi = {
  getAll: () => api.get('hangphong'),
  getById: (id: string) => api.get(`hangphong/${id}`),
  create: (data: unknown) => api.post('hangphong', data),
  update: (id: string, data: unknown) => api.put(`hangphong/${id}`, data),
  delete: (id: string) => api.delete(`hangphong/${id}`),
};

// Phòng
export const phongApi = {
  getAll: () => api.get('phong'),
  getById: (id: string) => api.get(`phong/${id}`),
  create: (data: unknown) => api.post('phong', data),
  update: (id: string, data: unknown) => api.put(`phong/${id}`, data),
  delete: (id: string) => api.delete(`phong/${id}`),
};

// Availability
export interface AvailabilityRoom {
  maPhong: string;
  moTa: string;
  hangPhong?: {
    tenHangPhong: string;
    sucChua: number;
  };
  coSo?: unknown;
}

export const availabilityApi = {
  search: (params: { checkIn: string; checkOut: string; guests?: number; coSoId?: string }) => {
    const query = new URLSearchParams({
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      ...(params.guests !== undefined ? { guests: String(params.guests) } : {}),
      ...(params.coSoId ? { coSoId: params.coSoId } : {}),
    }).toString();
    return api.get<AvailabilityRoom[]>(`availability?${query}`);
  },
};

// Khách hàng
export const khachHangApi = {
  getAll: () => api.get('khachhang'),
  getById: (id: string) => api.get(`khachhang/${id}`),
  create: (data: unknown) => api.post('khachhang', data),
  update: (id: string, data: unknown) => api.put(`khachhang/${id}`, data),
  delete: (id: string) => api.delete(`khachhang/${id}`),
};

// Nhân viên
export const nhanVienApi = {
  getAll: () => api.get('nhanvien'),
  getById: (id: string) => api.get(`nhanvien/${id}`),
  create: (data: unknown) => api.post('nhanvien', data),
  update: (id: string, data: unknown) => api.put(`nhanvien/${id}`, data),
  delete: (id: string) => api.delete(`nhanvien/${id}`),
};

// Chức vụ
export const chucVuApi = {
  getAll: () => api.get('chucvu'),
  getById: (id: string) => api.get(`chucvu/${id}`),
  create: (data: unknown) => api.post('chucvu', data),
  update: (id: string, data: unknown) => api.put(`chucvu/${id}`, data),
  delete: (id: string) => api.delete(`chucvu/${id}`),
};

// Dịch vụ
export const dichVuApi = {
  getAll: () => api.get('dichvu'),
  getById: (id: string) => api.get(`dichvu/${id}`),
  create: (data: unknown) => api.post('dichvu', data),
  update: (id: string, data: unknown) => api.put(`dichvu/${id}`, data),
  delete: (id: string) => api.delete(`dichvu/${id}`),
};

// Đơn đặt phòng
export const donDatPhongApi = {
  getAll: () => api.get('dondatphong'),
  getById: (id: string) => api.get(`dondatphong/${id}`),
  create: (data: unknown) => api.post('dondatphong', data),
  update: (id: string, data: unknown) => api.put(`dondatphong/${id}`, data),
  delete: (id: string) => api.delete(`dondatphong/${id}`),
};

// Đơn giá
export const donGiaApi = {
  getAll: () => api.get('dongia'),
  create: (data: unknown) => api.post('dongia', data),
};

// Ca làm
export const caLamApi = {
  getAll: () => api.get('calam'),
  getById: (id: string) => api.get(`calam/${id}`),
  create: (data: unknown) => api.post('calam', data),
  update: (id: string, data: unknown) => api.put(`calam/${id}`, data),
  delete: (id: string) => api.delete(`calam/${id}`),
};

// Khiếu nại
export const khieuNaiApi = {
  getAll: () => api.get('khieunai'),
  getById: (id: string) => api.get(`khieunai/${id}`),
  create: (data: unknown) => api.post('khieunai', data),
  update: (id: string, data: unknown) => api.put(`khieunai/${id}`, data),
  delete: (id: string) => api.delete(`khieunai/${id}`),
};

// Cơ sở
export const coSoApi = {
  getAll: () => api.get('coso'),
  getById: (id: string) => api.get(`coso/${id}`),
  create: (data: unknown) => api.post('coso', data),
  update: (id: string, data: unknown) => api.put(`coso/${id}`, data),
  delete: (id: string) => api.delete(`coso/${id}`),
};

/**
 * Authentication API
 * Note: Sử dụng AuthAPI từ lib/auth.ts thay vì định nghĩa lại ở đây
 * để tránh duplicate code. AuthContext sẽ quản lý toàn bộ authentication.
 */


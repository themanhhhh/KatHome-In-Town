/**
 * API Client Library
 * Helper functions để gọi API từ frontend components
 */

// Use Next.js API Routes (simpler, no CORS issues)
// Set to true to call backend directly (Express at NEXT_PUBLIC_API_URL)
const USE_DIRECT_BACKEND = true;
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
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
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

  // Get auth token if available
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  // Add authorization header if token exists
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
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
 * Upload file to Pinata IPFS
 */
async function uploadFileToPinata(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      body: formData,
      headers: {
        pinata_api_key: '5b9afb41a6a64bcad1f7',
        pinata_secret_api_key: '080a3e13f1c8a9527e3ff8faaeb9871b5df53900099d88edba2259f98be701ec',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload to Pinata');
    }

    const data = await response.json();
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    console.log('Image successfully uploaded to Pinata:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error('Unable to upload image to Pinata');
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
  uploadAvatar: async (id: string, file: File) => {
    const imageUrl = await uploadFileToPinata(file);
    return api.put(`users/${id}/avatar`, { imageUrl });
  },
  createWithImage: async (data: unknown, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadFileToPinata(imageFile);
      return api.post('users', { ...(data as Record<string, unknown>), avatar: imageUrl });
    } else {
      return api.post('users', data);
    }
  },
};

// Cơ sở
export const cosoApi = {
  getAll: () => api.get('coso'),
  getById: (id: string) => api.get(`coso/${id}`),
  create: (data: unknown) => api.post('coso', data),
  update: (id: string, data: unknown) => api.put(`coso/${id}`, data),
  delete: (id: string) => api.delete(`coso/${id}`),
  uploadImage: async (id: string, file: File) => {
    const imageUrl = await uploadFileToPinata(file);
    return api.put(`coso/${id}/image`, { imageUrl });
  },
  createWithImage: async (data: unknown, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadFileToPinata(imageFile);
      return api.post('coso', { ...(data as Record<string, unknown>), hinhAnh: imageUrl });
    } else {
      return api.post('coso', data);
    }
  },
};

// Phòng
export const phongApi = {
  getAll: () => api.get('phong'),
  getById: (id: string) => api.get(`phong/${id}`),
  create: (data: unknown) => api.post('phong', data),
  update: (id: string, data: unknown) => api.put(`phong/${id}`, data),
  delete: (id: string) => api.delete(`phong/${id}`),
  uploadImage: async (id: string, file: File) => {
    const imageUrl = await uploadFileToPinata(file);
    return api.put(`phong/${id}/image`, { imageUrl });
  },
  createWithImage: async (data: unknown, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadFileToPinata(imageFile);
      return api.post('phong', { ...(data as Record<string, unknown>), hinhAnh: imageUrl });
    } else {
      return api.post('phong', data);
    }
  },
};

// Availability
export interface AvailabilityRoom {
  maPhong: string;
  tenPhong: string;
  moTa: string;
  sucChua: number;
  donGia4h: number;
  donGiaQuaDem: number;
  hinhAnh?: string;
  coSo?: {
    maCoSo: string;
    tenCoSo: string;
    diaChi: string;
    sdt: string;
    hinhAnh?: string;
  };
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
  uploadImage: async (id: string, file: File) => {
    const imageUrl = await uploadFileToPinata(file);
    return api.put(`nhanvien/${id}/image`, { imageUrl });
  },
  createWithImage: async (data: unknown, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadFileToPinata(imageFile);
      return api.post('nhanvien', { ...(data as Record<string, unknown>), hinhAnh: imageUrl });
    } else {
      return api.post('nhanvien', data);
    }
  },
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
  uploadImage: async (id: string, file: File) => {
    const imageUrl = await uploadFileToPinata(file);
    return api.put(`dichvu/${id}/image`, { imageUrl });
  },
  createWithImage: async (data: unknown, imageFile?: File) => {
    if (imageFile) {
      const imageUrl = await uploadFileToPinata(imageFile);
      return api.post('dichvu', { ...(data as Record<string, unknown>), hinhAnh: imageUrl });
    } else {
      return api.post('dichvu', data);
    }
  },
};

// Đơn đặt phòng
export interface CreateBookingRequest {
  coSoId: string;
  khachHangId?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  rooms: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    price: number;
  }[];
  notes?: string;
}

export const donDatPhongApi = {
  getAll: () => api.get('dondatphong'),
  getById: (id: string) => api.get(`dondatphong/${id}`),
  getByEmail: (email: string) => api.get(`dondatphong/by-email/${encodeURIComponent(email)}`),
  create: (data: CreateBookingRequest) => api.post('dondatphong', data),
  update: (id: string, data: unknown) => api.put(`dondatphong/${id}`, data),
  delete: (id: string) => api.delete(`dondatphong/${id}`),
  
  // Booking management
  sendOTP: (bookingId: string) => 
    api.post(`bookings/${bookingId}/send-otp`, {}),
  verifyOTP: (bookingId: string, otpCode: string) => 
    api.post(`bookings/${bookingId}/verify-otp`, { otpCode }),
  confirmPayment: (bookingId: string, paymentMethod: string = 'Cash') => 
    api.post(`bookings/${bookingId}/confirm-payment`, { paymentMethod }),
  checkIn: (bookingId: string) => 
    api.post(`bookings/${bookingId}/check-in`, {}),
  checkOut: (bookingId: string) => 
    api.post(`bookings/${bookingId}/check-out`, {}),
  cancel: (bookingId: string) => 
    api.post(`bookings/${bookingId}/cancel`, {}),
};

// Đánh giá
export interface ReviewStatsResponse {
  totalReviews: number;
  averageRating: number | string;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const danhGiaApi = {
  /**
   * Lấy tất cả đánh giá.
   * - Có thể filter theo trangThai, phongMaPhong, limit
   */
  getAll: (params?: { trangThai?: string; phongMaPhong?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.trangThai) queryParams.append('trangThai', params.trangThai);
    if (params?.phongMaPhong) queryParams.append('phongMaPhong', params.phongMaPhong);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return api.get(`danhgia${query ? `?${query}` : ''}`);
  },
  /**
   * Lấy thống kê đánh giá.
   * - Nếu truyền roomId => thống kê cho từng phòng (phongMaPhong).
   * - Nếu không truyền => thống kê tổng.
   */
  getStats: (roomId?: string) => {
    const query = roomId ? `?phongMaPhong=${encodeURIComponent(roomId)}` : "";
    return api.get<ReviewStatsResponse>(`danhgia/stats${query}`);
  },
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

// Payment
export const paymentApi = {
  verify: (payload: {
    bookingId: string;
    totalAmount: number;
    paymentMethod: string;
    paymentRef?: string;
    sendEmail?: boolean;
    customerEmail?: string;
    customerName?: string;
    roomName?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    bookingDate?: string;
  }) => api.post('payment/verify', payload),

  sendPaymentConfirmation: (payload: {
    email: string;
    customerName: string;
    bookingData: {
      bookingId: string;
      roomName: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      totalAmount: number;
      paymentMethod: string;
      bookingDate: string;
    };
  }) => api.post('send-payment-confirmation', payload),

  /**
   * Finalize booking payment
   * - Updates booking payment status to paid
   * - Creates revenue record
   * - Called after payment verification succeeds
   */
  finalizeBooking: (payload: {
    bookingId: string;
    totalAmount: number;
    paymentMethod: string;
    paymentRef?: string;
    paidAt?: string;
    sendEmail?: boolean;
    customerEmail?: string; // Email của khách hàng để verify quyền
  }) => api.post(`bookings/${payload.bookingId}/finalize`, {
    totalAmount: payload.totalAmount,
    paymentMethod: payload.paymentMethod,
    paymentRef: payload.paymentRef,
    paidAt: payload.paidAt,
    sendEmail: payload.sendEmail,
    customerEmail: payload.customerEmail,
  }),
};

// Cơ sở
export const coSoApi = {
  getAll: () => api.get('coso'),
  getById: (id: string) => api.get(`coso/${id}`),
  create: (data: unknown) => api.post('coso', data),
  update: (id: string, data: unknown) => api.put(`coso/${id}`, data),
  delete: (id: string) => api.delete(`coso/${id}`),
};

// New Reports API Types
export interface RevenueSummaryResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalBookings: number;
    averageRevenue: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    successRate: number;
  };
}

export interface TrendDataResponse {
  success: boolean;
  data: Array<{
    period: string;
    revenue: number;
    bookings: number;
    monthKey?: string;
    year?: number;
    quarter?: number;
    startDate?: string;
    endDate?: string;
  }>;
}

export interface StatusStatsResponse {
  success: boolean;
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface BookingsDetailResponse {
  success: boolean;
  data: Array<{
    maDatPhong: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    ngayDat: string;
    checkinDuKien: string;
    checkoutDuKien: string;
    totalAmount: number;
    trangThai: string;
    paymentStatus: string;
    paymentMethod: string;
    coSo: string;
  }>;
}

// Legacy Revenue Types (for backward compatibility)
export interface RevenueSummary {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    averageRevenue: number;
  };
  byPaymentMethod: Record<string, { count: number; total: number }>;
  byBranch: Record<string, { count: number; total: number; name: string }>;
  timeline: Record<string, { count: number; total: number }>;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

export const revenueApi = {
  getAll: () => api.get('revenue'),
  getById: (id: number) => api.get(`revenue/${id}`),
  
  // New Reports API
  getSummary: () => api.get<RevenueSummaryResponse>('revenue/summary'),
  getTrend: (period: 'week' | 'month' | 'quarter' | 'year' = 'month', limit: number = 6) => 
    api.get<TrendDataResponse>(`revenue/trend?period=${period}&limit=${limit}`),
  getStatusStats: () => api.get<StatusStatsResponse>('revenue/status-stats'),
  getBookingsDetail: () => api.get<BookingsDetailResponse>('revenue/bookings-detail'),
  
  // Legacy API (for backward compatibility)
  getSummaryLegacy: (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'month' | 'year';
  }) => {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
    return api.get<RevenueSummary>(`revenue/summary${query}`);
  },
};

// Reports
export interface ApiReport {
  id: string;
  title: string;
  type: 'revenue' | 'bookings' | 'occupancy' | 'customer' | 'rooms';
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'completed' | 'processing' | 'failed';
  description?: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  fileSize?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const reportsApi = {
  getAll: () => api.get<ApiReport[]>('reports'),
  getById: (id: string) => api.get<ApiReport>(`reports/${id}`),
  create: (data: {
    title: string;
    type: string;
    period: string;
    description?: string;
    value?: number;
    change?: number;
    trend?: string;
    status?: string;
  }) => api.post('reports', data),
  update: (id: string, data: Partial<ApiReport>) => api.put(`reports/${id}`, data),
  delete: (id: string) => api.delete(`reports/${id}`),
  bulkDelete: (ids: string[]) => api.post('reports/bulk-delete', { ids }),
  markCompleted: (id: string) => api.post(`reports/${id}/complete`, {}),
};

/**
 * Authentication API
 * Note: Sử dụng AuthAPI từ lib/auth.ts thay vì định nghĩa lại ở đây
 * để tránh duplicate code. AuthContext sẽ quản lý toàn bộ authentication.
 */


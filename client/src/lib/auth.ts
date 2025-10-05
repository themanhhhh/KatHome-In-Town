/**
 * Authentication API Client
 * Helper functions để xử lý authentication từ frontend
 */

// Use Next.js API Routes (simpler, no CORS issues)
// Backend server will be called by Next.js API routes
const USE_DIRECT_BACKEND = false;
const API_BASE_URL = USE_DIRECT_BACKEND 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
  : '';

export interface User {
  id: string;
  taiKhoan: string;
  gmail: string;
  vaiTro: string;
  soDienThoai?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  taiKhoan: string;
  matKhau: string;
  gmail: string;
  soDienThoai?: string;
}

export interface LoginData {
  taiKhoan: string;
  matKhau: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  requiresVerification?: boolean;
  userId?: string;
}

export class AuthAPI {
  /**
   * Đăng ký tài khoản mới
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/register` : '/api/auth/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Đăng ký thất bại');
    }

    return result;
  }

  /**
   * Đăng nhập
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Đăng nhập thất bại');
    }

    return result;
  }

  /**
   * Xác thực email bằng mã code
   */
  static async verifyEmail(gmail: string, code: string): Promise<AuthResponse> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/verify-email` : '/api/auth/verify-email';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail, code }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Xác thực thất bại');
    }

    return result;
  }

  /**
   * Gửi lại mã xác thực
   */
  static async resendVerification(gmail: string): Promise<{ success: boolean; message: string }> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/resend-verification` : '/api/auth/resend-verification';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gửi lại mã thất bại');
    }

    return result;
  }

  /**
   * Yêu cầu đặt lại mật khẩu
   */
  static async forgotPassword(gmail: string): Promise<{ success: boolean; message: string }> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/forgot-password` : '/api/auth/forgot-password';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gmail }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Yêu cầu thất bại');
    }

    return result;
  }

  /**
   * Đặt lại mật khẩu
   */
  static async resetPassword(token: string, matKhauMoi: string): Promise<{ success: boolean; message: string }> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/reset-password` : '/api/auth/reset-password';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, matKhauMoi }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Đặt lại mật khẩu thất bại');
    }

    return result;
  }

  /**
   * Lấy thông tin user hiện tại
   */
  static async getCurrentUser(token: string): Promise<{ success: boolean; user: User }> {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/me` : '/api/auth/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Không thể lấy thông tin user');
    }

    return result;
  }
}

/**
 * Token Management
 */
export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  /**
   * Lưu token vào localStorage
   */
  static saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Lấy token từ localStorage
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Xóa token
   */
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Lưu user info
   */
  static saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Lấy user info
   */
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Xóa user info
   */
  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Xóa tất cả auth data
   */
  static clearAll(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Kiểm tra có đăng nhập hay không
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}


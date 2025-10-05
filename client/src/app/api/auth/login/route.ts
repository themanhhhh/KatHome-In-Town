import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/login - Đăng nhập
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taiKhoan, matKhau } = body;

    // Validate input
    if (!taiKhoan || !matKhau) {
      return NextResponse.json(
        { message: 'Tài khoản và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Forward to backend
    const response = await fetch(getApiUrl('auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taiKhoan, matKhau }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi đăng nhập', error: String(error) },
      { status: 500 }
    );
  }
}


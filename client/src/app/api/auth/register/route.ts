import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/register - Đăng ký tài khoản mới
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taiKhoan, matKhau, gmail, soDienThoai } = body;

    // Validate input
    if (!taiKhoan || !matKhau || !gmail) {
      return NextResponse.json(
        { message: 'Tài khoản, mật khẩu và email là bắt buộc' },
        { status: 400 }
      );
    }

    // Forward to backend
    const response = await fetch(getApiUrl('auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taiKhoan, matKhau, gmail, soDienThoai }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi đăng ký tài khoản', error: String(error) },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/reset-password - Đặt lại mật khẩu
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, matKhauMoi } = body;

    if (!token || !matKhauMoi) {
      return NextResponse.json(
        { message: 'Token và mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    const response = await fetch(getApiUrl('auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, matKhauMoi }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi đặt lại mật khẩu', error: String(error) },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/forgot-password - Yêu cầu đặt lại mật khẩu
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gmail } = body;

    if (!gmail) {
      return NextResponse.json(
        { message: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    const response = await fetch(getApiUrl('auth/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gmail }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi xử lý yêu cầu', error: String(error) },
      { status: 500 }
    );
  }
}


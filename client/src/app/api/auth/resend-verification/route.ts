import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/resend-verification - Gửi lại mã xác thực
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

    const response = await fetch(getApiUrl('auth/resend-verification'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gmail }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi gửi lại mã xác thực', error: String(error) },
      { status: 500 }
    );
  }
}


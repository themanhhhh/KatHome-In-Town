import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * POST /api/auth/verify-email - Xác thực email bằng mã code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gmail, code } = body;

    // Validate input
    if (!gmail || !code) {
      return NextResponse.json(
        { message: 'Email và mã xác thực là bắt buộc' },
        { status: 400 }
      );
    }

    // Forward to backend
    const response = await fetch(getApiUrl('auth/verify-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gmail, code }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi xác thực email', error: String(error) },
      { status: 500 }
    );
  }
}


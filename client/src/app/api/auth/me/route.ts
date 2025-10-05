import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../config';

/**
 * GET /api/auth/me - Lấy thông tin user hiện tại
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Không có token xác thực' },
        { status: 401 }
      );
    }

    const response = await fetch(getApiUrl('auth/me'), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy thông tin user', error: String(error) },
      { status: 500 }
    );
  }
}


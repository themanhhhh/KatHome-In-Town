import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../../../config';

// GET /api/dondatphong/by-email/[email] - Get booking history by email
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const { email } = await params;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(getApiUrl(`dondatphong/by-email/${encodeURIComponent(email)}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid response from server' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking history' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '../../config';

// GET /api/danhgia/stats - Get review statistics
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/danhgia/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review statistics' },
      { status: 500 }
    );
  }
}


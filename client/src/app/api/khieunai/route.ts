import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from '../config';

// GET /api/khieunai - Get all complaints (admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const response = await fetch(`${getApiUrl('khieunai')}${queryString ? `?${queryString}` : ''}`, {
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
        console.error('Error fetching complaints:', error);
        return NextResponse.json(
            { error: 'Failed to fetch complaints' },
            { status: 500 }
        );
    }
}

// POST /api/khieunai - Create new complaint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[khieunai POST] Received body:', body);

        const response = await fetch(getApiUrl('khieunai'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('[khieunai POST] Backend response status:', response.status);

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
        console.log('[khieunai POST] Backend response data:', data);

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating complaint:', error);
        return NextResponse.json(
            { error: 'Failed to create complaint', message: String(error) },
            { status: 500 }
        );
    }
}

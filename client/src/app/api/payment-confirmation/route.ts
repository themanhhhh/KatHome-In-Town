import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      customerName, 
      bookingData 
    } = await request.json();

    if (!email || !customerName || !bookingData) {
      return NextResponse.json(
        { error: 'Email, customer name, and booking data are required' },
        { status: 400 }
      );
    }

    // Validate booking data structure
    const requiredFields = ['bookingId', 'roomName', 'checkIn', 'checkOut', 'guests', 'totalAmount', 'paymentMethod', 'bookingDate'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Call backend email service
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3000'}/api/send-payment-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        customerName,
        bookingData
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.message || 'Failed to send payment confirmation email');
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Payment confirmation email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Payment confirmation API error:', error);
    
    let errorMessage = 'Failed to send payment confirmation email';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to send payment confirmation email',
        message: errorMessage
      },
      { status: 500 }
    );
  }
}

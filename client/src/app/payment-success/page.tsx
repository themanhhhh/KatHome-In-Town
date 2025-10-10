'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { PaymentSuccess } from "../components/paymentsuccess/PaymentSuccess";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<{
    roomData: {
      id: string;
      name: string;
      type: string;
      price: number;
      image: string;
      maxGuests: number;
      beds: number;
      bathrooms: number;
    };
    searchData: {
      checkIn: string;
      checkOut: string;
      guests: number;
    };
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zipCode: string;
      specialRequests: string;
    };
    paymentInfo: {
      method: string;
      total: number;
    };
    bookingId: string;
    bookingDate: string;
  } | null>(null);

  useEffect(() => {
    // Load booking data from sessionStorage
    const savedBookingData = sessionStorage.getItem('paymentSuccessData');

    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
      // Clear all checkout data
      sessionStorage.removeItem('checkoutRoomData');
      sessionStorage.removeItem('checkoutSearchData');
      sessionStorage.removeItem('paymentSuccessData');
    } else {
      // If no data, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#3D0301' }}></div>
            <p style={{ color: '#3D0301' }}>Đang tải thông tin đặt phòng...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <PaymentSuccess 
          bookingData={bookingData}
          onBackToHome={handleBackToHome}
        />
      </main>
      <Footer />
    </div>
  );
}


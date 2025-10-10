'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailVerification } from "../components/emailverification/EmailVerification";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<{
    bookingId: string;
    bookingDate: string;
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
      email: string;
      firstName: string;
      lastName: string;
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
  } | null>(null);

  useEffect(() => {
    // Load booking data from sessionStorage
    const savedBookingData = sessionStorage.getItem('verificationBookingData');

    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    } else {
      // If no data, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleBack = () => {
    router.push('/checkout');
  };

  const handleVerificationSuccess = (verifiedBookingData: {
    bookingId: string;
    bookingDate: string;
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
      email: string;
      firstName: string;
      lastName: string;
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
  }) => {
    // Save verified booking data to sessionStorage
    sessionStorage.setItem('paymentSuccessData', JSON.stringify(verifiedBookingData));
    // Clear verification data
    sessionStorage.removeItem('verificationBookingData');
    router.push('/payment-success');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <EmailVerification 
      bookingData={bookingData}
      onBack={handleBack}
      onVerificationSuccess={handleVerificationSuccess}
    />
  );
}


'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentSuccess } from "../components/paymentsuccess/PaymentSuccess";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<{
    roomData: {
      id: number;
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
    return <div>Loading...</div>;
  }

  return (
    <PaymentSuccess 
      bookingData={bookingData}
      onBackToHome={handleBackToHome}
    />
  );
}


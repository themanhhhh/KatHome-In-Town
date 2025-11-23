'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { Checkout } from "../components/checkout/Checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [roomData, setRoomData] = useState<{
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    maxGuests: number;
    beds: number;
    bathrooms: number;
    branchId?: string;
    branchName?: string;
  } | null>(null);
  const [searchData, setSearchData] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);

  useEffect(() => {
    // Load data from sessionStorage
    const savedRoomData = sessionStorage.getItem('checkoutRoomData');
    const savedSearchData = sessionStorage.getItem('checkoutSearchData');

    if (savedRoomData && savedSearchData) {
      setRoomData(JSON.parse(savedRoomData));
      setSearchData(JSON.parse(savedSearchData));
    } else {
      // If no data, redirect to home
      router.push('/');
    }
  }, [router]);

  const handleBack = () => {
    if (roomData) {
      const params = new URLSearchParams({
        checkIn: searchData?.checkIn || '',
        checkOut: searchData?.checkOut || '',
        guests: searchData?.guests.toString() || '1',
      });
      router.push(`/rooms/${roomData.id}?${params.toString()}`);
    }
  };

  const handleProceedToVerification = (bookingData: {
    roomData: {
      id: string;
      name: string;
      type: string;
      price: number;
      image: string;
      maxGuests: number;
      beds: number;
      bathrooms: number;
      branchId?: string;
      branchName?: string;
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
      specialRequests: string;
    };
    paymentInfo: {
      method: string;
      total: number;
    };
    bookingId: string;
    bookingDate: string;
  }) => {
    // Save booking data to sessionStorage
    sessionStorage.setItem('verificationBookingData', JSON.stringify(bookingData));
    router.push('/verify-email');
  };

  if (!roomData || !searchData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-allow-select="true" data-checkout="true">
      <main className="flex-1">
        <Checkout 
          roomData={roomData}
          searchData={searchData}
          onBack={handleBack}
          onProceedToVerification={handleProceedToVerification}
        />
      </main>
      <Footer />
    </div>
  );
}


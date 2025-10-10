'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { RoomDetail } from "../../components/roomdetail/RoomDetail";

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then((p) => setRoomId(p.id));
  }, [params]);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');

  const searchData = {
    checkIn,
    checkOut,
    guests,
  };

  const handleBackToSearch = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleProceedToCheckout = (roomData: {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    maxGuests: number;
    beds: number;
    bathrooms: number;
  }) => {
    // Save room data and search data to sessionStorage for checkout
    sessionStorage.setItem('checkoutRoomData', JSON.stringify(roomData));
    sessionStorage.setItem('checkoutSearchData', JSON.stringify(searchData));
    router.push('/checkout');
  };

  if (!roomId) {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RoomDetail 
          roomId={roomId}
          searchData={searchData}
          onBackToSearch={handleBackToSearch}
          onBackToHome={handleBackToHome}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </main>
      <Footer />
    </div>
  );
}


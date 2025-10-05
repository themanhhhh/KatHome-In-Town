'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { SearchResults } from "../components/searchresults/SearchResults";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');

  const searchData = {
    checkIn,
    checkOut,
    guests,
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleViewRoomDetail = (roomId: number) => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/rooms/${roomId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SearchResults
          searchData={searchData}
          onBackToHome={handleBackToHome}
          onViewRoomDetail={handleViewRoomDetail}
        />
      </main>
      <Footer />
    </div>
  );
}


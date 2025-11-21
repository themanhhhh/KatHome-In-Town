'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "./components/header/header";
import { Hero } from "./components/hero/Hero";
import { About } from "./components/about/about";
import { ReviewsSection } from "./components/reviews/ReviewsSection";
import { ComplaintsSection } from "./components/complaints/ComplaintsSection";
import { Contact } from "./components/contact/Contact";
import { Footer } from "./components/footer/footer";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (data: { checkIn: string; checkOut: string; guests: number }) => {
    // Navigate to search page with query params
    const params = new URLSearchParams({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero onSearch={handleSearch} />
        <About />
        <ReviewsSection />
        <ComplaintsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { Login } from "../components/login/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleSwitchToRegister = () => {
    router.push('/register');
  };

  const handleLoginSuccess = () => {
    // After successful login, redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Login 
          onBack={handleBack}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </main>
      <Footer />
    </div>
  );
}

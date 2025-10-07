'use client';

import React from "react";
import { useRouter } from "next/navigation";
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
      <main className="flex-1">
        <Login 
          onBack={handleBack}
          onSwitchToRegister={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      </main> 
    </div>
  );
}

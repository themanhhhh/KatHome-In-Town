'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { Register } from "../components/register/Register";

export default function RegisterPage() {
  const router = useRouter();
  const handleBack = () => {
    router.push('/');
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  const handleRegisterSuccess = (email: string) => {
    router.push(`/verify-account?email=${encodeURIComponent(email)}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Register 
          onBack={handleBack}
          onSwitchToLogin={handleSwitchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </main>
    </div>
  );
}


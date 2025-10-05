'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountVerification } from "../components/accountverification/AccountVerification";

export default function VerifyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailParam = searchParams.get('email');
    const savedEmail = sessionStorage.getItem('verificationEmail');

    if (emailParam) {
      setEmail(emailParam);
      sessionStorage.setItem('verificationEmail', emailParam);
    } else if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // If no email, redirect to register
      router.push('/register');
    }
  }, [searchParams, router]);

  const handleBack = () => {
    router.push('/register');
  };

  const handleVerificationSuccess = () => {
    // Clear verification email from sessionStorage
    sessionStorage.removeItem('verificationEmail');
    // Redirect to login page
    router.push('/login?verified=true');
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e6b2ba' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#3D0301' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <AccountVerification 
      email={email}
      onBack={handleBack}
      onVerificationSuccess={handleVerificationSuccess}
    />
  );
}


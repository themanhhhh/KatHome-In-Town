import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Locations } from "./components/Locations";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SearchResults } from "./components/SearchResults";
import { RoomDetail } from "./components/RoomDetail";
import { Checkout } from "./components/Checkout";
import { EmailVerification } from "./components/EmailVerification";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { BookingsManagement } from "./components/admin/BookingsManagement";
import { UsersManagement } from "./components/admin/UsersManagement";
import { RoomsManagement } from "./components/admin/RoomsManagement";
import { ReportsManagement } from "./components/admin/ReportsManagement";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'search' | 'room-detail' | 'checkout' | 'email-verification' | 'payment-success' | 'login' | 'register' | 'admin'>('home');
  const [adminPage, setAdminPage] = useState<'dashboard' | 'bookings' | 'users' | 'rooms' | 'analytics' | 'settings'>('dashboard');
  const [searchData, setSearchData] = useState<{
    checkIn: string;
    checkOut: string;
    guests: number;
  } | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomData, setSelectedRoomData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  const handleSearch = (data: { checkIn: string; checkOut: string; guests: number }) => {
    setSearchData(data);
    setCurrentPage('search');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleBackToSearch = () => {
    setCurrentPage('search');
  };

  const handleViewRoomDetail = (roomId: number) => {
    setSelectedRoomId(roomId);
    setCurrentPage('room-detail');
  };

  const handleProceedToCheckout = (roomData: any) => {
    setSelectedRoomData(roomData);
    setCurrentPage('checkout');
  };

  const handleProceedToVerification = (bookingDataFromCheckout: any) => {
    setBookingData(bookingDataFromCheckout);
    setCurrentPage('email-verification');
  };

  const handleVerificationSuccess = (verifiedBookingData: any) => {
    setBookingData(verifiedBookingData);
    setCurrentPage('payment-success');
  };

  const handleShowLogin = () => {
    setCurrentPage('login');
  };

  const handleShowRegister = () => {
    setCurrentPage('register');
  };

  const handleLoginSuccess = (userData: any) => {
    setCurrentPage('home');
  };

  const handleRegisterSuccess = (userData: any) => {
    setCurrentPage('home');
  };

  const handleShowAdmin = () => {
    setCurrentPage('admin');
  };

  const handleAdminNavigate = (page: string) => {
    setAdminPage(page as any);
  };

  if (currentPage === 'admin') {
    const renderAdminContent = () => {
      switch (adminPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'bookings':
          return <BookingsManagement />;
        case 'users':
          return <UsersManagement />;
        case 'rooms':
          return <RoomsManagement />;
        case 'analytics':
          return <ReportsManagement />;
        case 'settings':
          return <div className="text-center py-12" style={{ color: '#C599B6' }}>Cài đặt - Đang phát triển</div>;
        default:
          return <AdminDashboard />;
      }
    };

    return (
      <AdminLayout
        currentPage={adminPage}
        onNavigate={handleAdminNavigate}
        onBackToHome={handleBackToHome}
        children={renderAdminContent()}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <Register 
        onBack={handleBackToHome}
        onSwitchToLogin={handleShowLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <Login 
        onBack={handleBackToHome}
        onSwitchToRegister={handleShowRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentPage === 'payment-success' && bookingData) {
    return (
      <PaymentSuccess 
        bookingData={bookingData}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentPage === 'email-verification' && bookingData) {
    return (
      <EmailVerification 
        bookingData={bookingData}
        onBack={() => setCurrentPage('checkout')}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  if (currentPage === 'checkout' && selectedRoomData && searchData) {
    return (
      <Checkout 
        roomData={selectedRoomData}
        searchData={searchData}
        onBack={() => setCurrentPage('room-detail')}
        onProceedToVerification={handleProceedToVerification}
      />
    );
  }

  if (currentPage === 'room-detail' && searchData && selectedRoomId) {
    return (
      <RoomDetail 
        roomId={selectedRoomId}
        searchData={searchData} 
        onBackToSearch={handleBackToSearch}
        onBackToHome={handleBackToHome}
        onProceedToCheckout={handleProceedToCheckout}
      />
    );
  }

  if (currentPage === 'search' && searchData) {
    return (
      <SearchResults 
        searchData={searchData} 
        onBackToHome={handleBackToHome}
        onViewRoomDetail={handleViewRoomDetail}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onShowAdmin={handleShowAdmin}
      />
      <main>
          <Hero onSearch={handleSearch} />
          <About />
          <Services />
          <Locations />
          <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider children={<AppContent />} />
  );
}
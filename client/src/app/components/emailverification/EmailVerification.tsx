'use client';

import { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { donDatPhongApi } from "@/lib/api";
import Style from "../../styles/verify-email.module.css";

interface BookingData {
  bookingId: string;
  bookingDate: string;
  roomData: {
    id: string;
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
    email: string;
    firstName: string;
    lastName: string;
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
  verificationStatus?: string;
  verificationTime?: string;
}

interface EmailVerificationProps {
  bookingData: BookingData;
  onBack: () => void;
  onVerificationSuccess: (bookingData: BookingData) => void;
}

export function EmailVerification({ bookingData, onBack, onVerificationSuccess }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown

  // OTP countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Mã OTP phải có 6 chữ số");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const result = await donDatPhongApi.verifyOTP(bookingData.bookingId, verificationCode) as { success: boolean; message?: string };

      if (result.success) {
        onVerificationSuccess({
          ...bookingData,
          verificationStatus: "verified",
          verificationTime: new Date().toISOString()
        });
      } else {
        setError(result.message || "Mã OTP không đúng. Vui lòng thử lại.");
        setVerificationCode("");
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      setVerificationCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError("");
  };

  return (
    <div className={Style.verifyEmailPage} data-allow-select="true">
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.container}>
          <div className={Style.headerContent}>
            <button 
              onClick={onBack}
              className={Style.backButton}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
            <div className={Style.headerTitle}>
              <h1>Xác nhận đặt phòng</h1>
              <span className={Style.stepBadge}>
                Bước 2/3
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={Style.container}>
        <div className={Style.mainContent}>
          <div className={Style.verificationCard}>
            <div className={Style.cardHeader}>
              <div className={Style.iconContainer}>
                <Mail className={Style.icon} />
              </div>
              <h2 className={Style.cardTitle}>Xác nhận đặt phòng</h2>
              <p className={Style.cardDescription}>
                Chúng tôi đã gửi mã OTP 6 chữ số đến email
              </p>
              <div className={Style.emailAddress}>
                {bookingData.guestInfo.email}
              </div>
            </div>
            
            <div className={Style.cardContent}>
              <form onSubmit={handleVerificationSubmit} className={Style.form}>
                <div className={Style.inputGroup}>
                  <label className={Style.inputLabel}>
                    Nhập mã OTP
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="123456"
                    className={`${Style.verificationInput} ${error ? Style.error : ''}`}
                    maxLength={6}
                    autoComplete="off"
                  />
                  {error && (
                    <p className={Style.errorMessage}>
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className={Style.submitButton}
                >
                  {isVerifying ? (
                    <>
                      <div className={Style.loadingSpinner} />
                      <span>Đang xác nhận...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Xác nhận đặt phòng</span>
                    </>
                  )}
                </button>
              </form>

              {/* Countdown */}
              <div className={Style.countdownSection}>
                {countdown > 0 ? (
                  <div className={Style.countdown}>
                    <Clock className={Style.countdownIcon} />
                    <span>Mã OTP sẽ hết hạn sau: {formatTime(countdown)}</span>
                  </div>
                ) : (
                  <p className={Style.expiredMessage}>
                    Mã OTP đã hết hạn. Vui lòng đặt lại phòng.
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className={Style.infoSection}>
                <div className={Style.infoHeader}>
                  <Shield className={Style.infoIcon} />
                  <span>Bảo mật thông tin</span>
                </div>
                <div className={Style.infoContent}>
                  <p>
                    Mã OTP này chỉ có hiệu lực trong 5 phút và chỉ được sử dụng một lần. 
                    Không chia sẻ mã này với bất kỳ ai.
                  </p>
                </div>
              </div>

              {/* Booking Info Reminder */}
              <div className={Style.bookingInfo}>
                <h4 className={Style.bookingTitle}>Thông tin đặt phòng</h4>
                <div className={Style.bookingDetails}>
                  <div className={Style.bookingDetail}>
                    <span className={Style.bookingLabel}>Mã đặt phòng:</span> {bookingData.bookingId}
                  </div>
                  <div className={Style.bookingDetail}>
                    <span className={Style.bookingLabel}>Phòng:</span> {bookingData.roomData.name}
                  </div>
                  <div className={Style.bookingDetail}>
                    <span className={Style.bookingLabel}>Khách hàng:</span> {bookingData.guestInfo.firstName} {bookingData.guestInfo.lastName}
                  </div>
                  <div className={Style.bookingDetail}>
                    <span className={Style.bookingLabel}>Tổng tiền:</span> {new Intl.NumberFormat('vi-VN').format(bookingData.paymentInfo.total)}đ
                  </div>
                </div>
              </div>

              {/* Final Notice */}
              <div className={Style.securityNotice}>
                <p className={Style.securityText}>
                  <strong>Lưu ý:</strong> Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư và nhập mã 6 chữ số để xác nhận đặt phòng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

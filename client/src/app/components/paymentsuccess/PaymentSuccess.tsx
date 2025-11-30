'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import { Badge } from "../badge/badge";
import { Separator } from "../separator/separator";
import { paymentApi } from "@/lib/api";
import { toast } from "sonner";
import { 
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  Home,
  Star,
  Clock,
  CreditCard,
  User,
  Bed,
  Bath,
  AlertCircle
} from "lucide-react";

interface BookingData {
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
    firstName: string;
    lastName: string;
    email: string;
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
  bookingId: string;
  bookingDate: string;
}

interface PaymentSuccessProps {
  bookingData: BookingData;
  onBackToHome: () => void;
}

export function PaymentSuccess({ bookingData, onBackToHome }: PaymentSuccessProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [paymentFinalized, setPaymentFinalized] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const hasProcessedRef = useRef(false); // Track if payment verification has been processed

  // Map frontend payment method to backend enum values (Card or Cash)
  const mapPaymentMethod = (method: string): string => {
    // Normalize to lowercase for comparison
    const normalizedMethod = method?.toLowerCase().trim();
    
    if (normalizedMethod === 'bank-transfer' || normalizedMethod === 'bank transfer') {
      return 'Cash'; // Bank transfer is treated as Cash payment in backend
    }
    if (normalizedMethod === 'card' || normalizedMethod === 'credit-card' || normalizedMethod === 'debit-card') {
      return 'Card';
    }
    if (normalizedMethod === 'cash' || normalizedMethod === 'cash on delivery' || normalizedMethod === 'thanh toán tại chỗ') {
      return 'Cash';
    }
    // If already in correct format (Card, Cash), return as is
    if (method === 'Card' || method === 'Cash') {
      return method;
    }
    // Fallback: default to Cash for unknown methods
    console.warn(`⚠️ Unknown payment method "${method}", defaulting to Cash`);
    return 'Cash';
  };

  // Send payment confirmation email on component mount
  // Chỉ chạy một lần khi component mount với bookingData đã có sẵn
  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessedRef.current) {
      return;
    }

    // Đảm bảo bookingData đã có giá trị
    if (!bookingData || !bookingData.bookingId) {
      console.log('⏭️ Skipping payment verification - bookingData not ready');
      return;
    }

    const verifyAndSendPaymentEmail = async () => {
      // Mark as processed to prevent duplicate calls
      hasProcessedRef.current = true;

      setIsSendingEmail(true);
      setEmailError(null);

      try {
        // Log booking data for debugging
        console.log('🔍 Payment verify - bookingData:', bookingData);
        
        // Validate required fields
        if (!bookingData.bookingId) {
          console.error('❌ Validation failed: Booking ID is missing');
          throw new Error('Booking ID is missing');
        }
        
        // Calculate total if missing or invalid
        let totalAmount = bookingData.paymentInfo?.total;
        if (!totalAmount || totalAmount <= 0 || isNaN(totalAmount)) {
          console.warn('⚠️ Total amount is missing or invalid, calculating from room price...');
          // Calculate total from room price and nights
          const checkInDate = new Date(bookingData.searchData?.checkIn);
          const checkOutDate = new Date(bookingData.searchData?.checkOut);
          const nights = Math.ceil(Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
          const roomPrice = bookingData.roomData?.price || 0;
          totalAmount = roomPrice * nights;
          
          if (totalAmount <= 0) {
            console.error('❌ Validation failed: Cannot calculate total amount', {
              roomPrice,
              nights,
              checkIn: bookingData.searchData?.checkIn,
              checkOut: bookingData.searchData?.checkOut,
            });
            throw new Error('Total amount is missing or invalid');
          }
          
          // Update bookingData with calculated total
          bookingData.paymentInfo = {
            ...bookingData.paymentInfo,
            total: totalAmount,
          };
          console.log('✅ Calculated total amount:', totalAmount);
        }
        if (!bookingData.paymentInfo?.method) {
          console.error('❌ Validation failed: Payment method is missing');
          throw new Error('Payment method is missing');
        }

        // Map payment method to backend enum
        const backendPaymentMethod = mapPaymentMethod(bookingData.paymentInfo.method);
        console.log('🔍 Payment method mapping:', bookingData.paymentInfo.method, '->', backendPaymentMethod);
        
        // Validate mapped payment method
        if (!backendPaymentMethod || (backendPaymentMethod !== 'Card' && backendPaymentMethod !== 'Cash')) {
          console.error('❌ Validation failed: Invalid payment method', backendPaymentMethod);
          throw new Error('Invalid payment method');
        }

        // Prepare request payload
        const payload = {
          bookingId: bookingData.bookingId,
          totalAmount: totalAmount,
          paymentMethod: backendPaymentMethod,
          paymentRef: undefined,
          sendEmail: true,
          customerEmail: bookingData.guestInfo?.email,
          customerName: bookingData.guestInfo ? `${bookingData.guestInfo.firstName || ''} ${bookingData.guestInfo.lastName || ''}`.trim() : undefined,
          roomName: bookingData.roomData?.name,
          checkIn: bookingData.searchData?.checkIn,
          checkOut: bookingData.searchData?.checkOut,
          guests: bookingData.searchData?.guests,
          bookingDate: bookingData.bookingDate,
        };
        
        console.log('🔍 Payment verify - payload:', payload);

        // ✅ Chỉ verify payment, KHÔNG gửi email ở đây
        // Email sẽ được gửi sau khi nhân viên đổi status thành "CC" (hoàn thành)
        const verifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/payment/verify`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...payload,
              sendEmail: false, // ❌ KHÔNG gửi email sau khi verify OTP
            }),
          }
        );

        if (!verifyResponse.ok) {
          const err = await verifyResponse.json().catch(() => ({}));
          const errorMessage = err.error || err.message || `Payment verify failed (${verifyResponse.status})`;
          console.error('Payment verify error:', err);
          throw new Error(errorMessage);
        }

        const verifyJson = await verifyResponse.json();
        if (verifyJson.success) {
          // ✅ Không set emailSent = true vì chưa gửi email
          // Email sẽ được gửi sau khi nhân viên đổi status thành "CC"
          setEmailSent(false);
          
          // ✅ After successful verification, finalize the booking
          try {
            // Map payment method to backend enum
            const backendPaymentMethod = mapPaymentMethod(bookingData.paymentInfo.method);

            console.log('🔍 Finalizing booking with:', {
              bookingId: bookingData.bookingId,
              totalAmount,
              paymentMethod: backendPaymentMethod,
            });

            const finalizeResponse = await paymentApi.finalizeBooking({
              bookingId: bookingData.bookingId,
              totalAmount: totalAmount,
              paymentMethod: backendPaymentMethod,
              paymentRef: verifyJson.paymentRef || undefined,
              paidAt: new Date().toISOString(),
              sendEmail: false, // Email already sent in verify step
              customerEmail: bookingData.guestInfo.email, // Gửi email để verify quyền
            }) as { success?: boolean; message?: string; data?: unknown; error?: string };

            console.log('🔍 Finalize response:', finalizeResponse);

            if (finalizeResponse?.success) {
              setPaymentFinalized(true);
              console.log('✅ Payment finalized successfully:', finalizeResponse);
              toast.success('Thanh toán thành công!', {
                description: `Booking #${bookingData.bookingId} đã được xác nhận và thanh toán.`,
                duration: 5000,
              });
              
              // ✅ Xóa sessionStorage sau khi finalize thành công
              // Đảm bảo data đã được xử lý xong trước khi xóa
              try {
                sessionStorage.removeItem('paymentSuccessData');
                sessionStorage.removeItem('checkoutRoomData');
                sessionStorage.removeItem('checkoutSearchData');
                console.log('✅ Cleaned up sessionStorage after successful payment finalization');
              } catch (storageError) {
                console.warn('⚠️ Failed to clean sessionStorage:', storageError);
              }
            } else {
              // Check if response has error message
              const errorMsg = finalizeResponse?.message || finalizeResponse?.error || 'Finalize booking failed';
              throw new Error(errorMsg);
            }
          } catch (finalizeErr: unknown) {
            console.error('❌ Error finalizing booking:', finalizeErr);
            
            // Extract error message
            let errorMessage = 'Lỗi khi xác nhận thanh toán';
            if (finalizeErr instanceof Error) {
              errorMessage = finalizeErr.message;
            } else if (typeof finalizeErr === 'string') {
              errorMessage = finalizeErr;
            } else if (finalizeErr && typeof finalizeErr === 'object' && 'message' in finalizeErr) {
              errorMessage = String(finalizeErr.message);
            }
            
            console.error('❌ Finalize error details:', {
              error: finalizeErr,
              errorMessage,
              bookingId: bookingData.bookingId,
            });
            
            // ✅ Check if error is "already paid" - treat as success
            const lowerErrorMessage = errorMessage.toLowerCase();
            if (lowerErrorMessage.includes('already paid') || 
                lowerErrorMessage.includes('đã thanh toán') ||
                lowerErrorMessage.includes('booking is already paid')) {
              setPaymentFinalized(true);
              console.log('✅ Payment already finalized (already paid)');
              toast.info('Thanh toán đã được xác nhận', {
                description: `Booking #${bookingData.bookingId} đã được thanh toán trước đó.`,
                duration: 5000,
              });
              
              // ✅ Xóa sessionStorage khi booking đã được thanh toán trước đó
              try {
                sessionStorage.removeItem('paymentSuccessData');
                sessionStorage.removeItem('checkoutRoomData');
                sessionStorage.removeItem('checkoutSearchData');
                console.log('✅ Cleaned up sessionStorage (already paid)');
              } catch (storageError) {
                console.warn('⚠️ Failed to clean sessionStorage:', storageError);
              }
            } else {
              setFinalizeError(errorMessage);
              toast.warning('Lưu ý về thanh toán', {
                description: `${errorMessage}. Booking của bạn đã được tạo nhưng có thể cần xác nhận thêm.`,
                duration: 8000,
              });
            }
          }

          return;
        }

        // ❌ Không cần fallback gửi email nữa
        // Email sẽ được gửi sau khi nhân viên đổi status thành "CC" (hoàn thành)
      } catch (error) {
        console.error('❌ Payment verification/email error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to verify/send email';
        setEmailError(errorMsg);
        toast.error('Lỗi gửi email xác nhận', {
          description: errorMsg,
          duration: 6000,
        });
      } finally {
        setIsSendingEmail(false);
      }
    };

    verifyAndSendPaymentEmail();
    // Chỉ chạy khi bookingData thay đổi từ null/undefined sang có giá trị
    // useRef đảm bảo chỉ gọi API một lần
  }, [bookingData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateNights = () => {
    const checkInDate = new Date(bookingData.searchData.checkIn);
    const checkOutDate = new Date(bookingData.searchData.checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In real app, would generate and download PDF
      toast.success('Hóa đơn đã được tải xuống!', {
        description: 'File PDF đã được tải về máy của bạn.',
        duration: 3000,
      });
    }, 2000);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // In real app, would use Web Share API or copy to clipboard
      await navigator.clipboard.writeText(`Đặt phòng thành công tại KatHome In Town ! Mã đặt phòng: ${bookingData.bookingId}`);
      toast.success('Đã sao chép thông tin đặt phòng!', {
        description: 'Thông tin đặt phòng đã được sao chép vào clipboard.',
        duration: 3000,
      });
    } catch {
      toast.error('Lỗi sao chép', {
        description: 'Không thể sao chép thông tin. Vui lòng thử lại.',
        duration: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen" data-allow-select="true" style={{ backgroundColor: '#fef5f6' }}>
      {/* Success Header */}
      <div className="text-center py-12" style={{ backgroundColor: 'linear-gradient(135deg, #FAD0C4 0%, #E6B2BA 50%, #F2A7C3 100%)' }}>
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#3D0301' }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading" style={{ color: '#3D0301' }}>
          Đặt phòng thành công!
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto px-4" style={{ color: 'rgba(61, 3, 1, 0.8)' }}>
          Cảm ơn bạn đã chọn KatHome In Town. Email xác nhận sẽ được gửi sau khi nhân viên hoàn tất xử lý đặt phòng.
        </p>
        <div className="mt-6">
          <Badge className="px-4 py-2 text-lg" style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)', color: '#3D0301' }}>
            Mã đặt phòng: {bookingData.bookingId}
          </Badge>
        </div>
      </div>

      {/* Email & Payment Status Notification */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {isSendingEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-700 font-medium">Đang xác minh thanh toán và gửi email...</span>
              </div>
            </div>
          )}
          
          {emailSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  ✅ Email xác nhận đã được gửi đến {bookingData.guestInfo.email}
                </span>
              </div>
            </div>
          )}

          {paymentFinalized && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">
                  ✅ Thanh toán đã được ghi nhận vào hệ thống
                </span>
              </div>
            </div>
          )}
          
          {emailError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 font-medium">
                  ❌ Lỗi gửi email: {emailError}
                </span>
              </div>
            </div>
          )}

          {finalizeError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-700 font-medium">
                  ⚠️ Lưu ý: {finalizeError}. Booking của bạn đã được tạo nhưng có thể cần xác nhận thêm.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              variant="outline"
              className="flex items-center space-x-2"
              style={{ borderColor: '#3D0301', color: '#3D0301' }}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? 'Đang tải...' : 'Tải hóa đơn'}</span>
            </Button>
            
            <Button
              onClick={handleShare}
              disabled={isSharing}
              variant="outline"
              className="flex items-center space-x-2"
              style={{ borderColor: '#3D0301', color: '#3D0301' }}
            >
              {isSharing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              <span>{isSharing ? 'Đang chia sẻ...' : 'Chia sẻ'}</span>
            </Button>
            
            <Button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-white"
              style={{ backgroundColor: '#3D0301' }}
            >
              <Home className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Booking Details */}
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                  <Calendar className="w-5 h-5" />
                  <span>Chi tiết đặt phòng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-2 font-heading" style={{ color: '#3D0301' }}>
                    {bookingData.roomData.name}
                  </h3>
                  <p className="text-sm opacity-80 mb-3" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                    {bookingData.roomData.type}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: '#3D0301' }}>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{bookingData.roomData.maxGuests} khách</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 flex-shrink-0" />
                      <span>{bookingData.roomData.beds} giường</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="w-4 h-4 flex-shrink-0" />
                      <span>{bookingData.roomData.bathrooms} phòng tắm</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stay Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Nhận phòng</p>
                    <p className="text-sm opacity-80 break-words" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {formatDate(bookingData.searchData.checkIn)}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: 'rgba(61, 3, 1, 0.6)' }}>Từ 14:00</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Trả phòng</p>
                    <p className="text-sm opacity-80 break-words" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {formatDate(bookingData.searchData.checkOut)}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: 'rgba(61, 3, 1, 0.6)' }}>Trước 12:00</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Số khách</p>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {bookingData.searchData.guests} người
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Số đêm</p>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {calculateNights()} đêm
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Special Requests */}
                {bookingData.guestInfo.specialRequests && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#3D0301' }}>Yêu cầu đặc biệt</p>
                    <p className="text-sm opacity-80 p-3 rounded-lg bg-white/50" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {bookingData.guestInfo.specialRequests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guest & Payment Info */}
            <div className="space-y-6">
              {/* Guest Information */}
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                    <User className="w-5 h-5" />
                    <span>Thông tin khách hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Họ tên</p>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {bookingData.guestInfo.firstName} {bookingData.guestInfo.lastName}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium flex items-center space-x-1" style={{ color: '#3D0301' }}>
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span>Email</span>
                      </p>
                      <p className="text-sm opacity-80 break-all" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        {bookingData.guestInfo.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center space-x-1" style={{ color: '#3D0301' }}>
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>Điện thoại</span>
                      </p>
                      <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        {bookingData.guestInfo.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium flex items-center space-x-1" style={{ color: '#3D0301' }}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>Địa chỉ</span>
                    </p>
                    <p className="text-sm opacity-80 break-words" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {bookingData.guestInfo.address}, {bookingData.guestInfo.city}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                    <CreditCard className="w-5 h-5" />
                    <span>Thông tin thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm" style={{ color: '#3D0301' }}>
                      <span>{formatPrice(bookingData.roomData.price)} x {calculateNights()} đêm</span>
                      <span>{formatPrice(bookingData.roomData.price * calculateNights())}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg" style={{ color: '#3D0301' }}>
                      <span>Tổng cộng</span>
                      <span>{formatPrice(bookingData.paymentInfo.total)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Phương thức thanh toán</p>
                    <p className="text-sm opacity-80 capitalize" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {bookingData.paymentInfo.method === 'card' ? 'Thẻ tín dụng/ghi nợ' : 
                       bookingData.paymentInfo.method === 'bank-transfer' ? 'Chuyển khoản ngân hàng' : 
                       'Thanh toán tại chỗ'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3D0301' }}>Thời gian đặt phòng</p>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      {formatDateTime(bookingData.bookingDate)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Information */}
          <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                <Clock className="w-5 h-5" />
                <span>Thông tin quan trọng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 font-heading" style={{ color: '#3D0301' }}>Chính sách nhận/trả phòng</h4>
                    <ul className="text-sm space-y-1 opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      <li>• Nhận phòng: 14:00 - 22:00</li>
                      <li>• Trả phòng: 06:00 - 12:00</li>
                      <li>• Vui lòng mang theo CMND/CCCD khi nhận phòng</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 font-heading" style={{ color: '#3D0301' }}>Chính sách hủy phòng</h4>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      Hủy miễn phí trước 24 tiếng. Sau thời gian này sẽ tính phí 50% tổng giá trị đặt phòng.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 font-heading" style={{ color: '#3D0301' }}>Liên hệ KatHome In Town </h4>
                    <div className="space-y-2 text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>+84 375 914 908</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>info@rosehomestay.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>123 Đường Hoa Hồng, Phường 1, Đà Lạt</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 font-heading" style={{ color: '#3D0301' }}>Đánh giá trải nghiệm</h4>
                    <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      Sau khi kết thúc kỳ nghỉ, chúng tôi sẽ gửi email để bạn chia sẻ trải nghiệm. 
                      Ý kiến của bạn rất quan trọng với chúng tôi!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <div className="text-center py-8">
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" style={{ color: '#3D0301' }} />
              ))}
            </div>
            <h2 className="text-2xl font-semibold mb-4 font-heading" style={{ color: '#3D0301' }}>
              Cảm ơn bạn đã chọn KatHome In Town !
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
              Chúng tôi rất mong được phục vụ bạn và mang đến những trải nghiệm tuyệt vời nhất. 
              Chúc bạn có một kỳ nghỉ đáng nhớ tại Đà Lạt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

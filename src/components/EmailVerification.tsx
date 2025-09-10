import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from "lucide-react";

interface EmailVerificationProps {
  bookingData: any;
  onBack: () => void;
  onVerificationSuccess: (bookingData: any) => void;
}

export function EmailVerification({ bookingData, onBack, onVerificationSuccess }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Mock verification code for demo (in real app, this would be sent via email)
  const correctCode = "123456";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
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
      setError("Vui lòng nhập mã xác thực");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Mã xác thực phải có 6 chữ số");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simulate verification process
    setTimeout(() => {
      if (verificationCode === correctCode) {
        setIsVerifying(false);
        onVerificationSuccess({
          ...bookingData,
          verificationStatus: "verified",
          verificationTime: new Date().toISOString()
        });
      } else {
        setIsVerifying(false);
        setError("Mã xác thực không đúng. Vui lòng thử lại.");
        setVerificationCode("");
      }
    }, 2000);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    // Simulate resending code
    setTimeout(() => {
      setIsResending(false);
      setCanResend(false);
      setCountdown(300); // Reset countdown
      setError("");
      // In real app, would trigger new email send
      alert("Mã xác thực mới đã được gửi đến email của bạn!");
    }, 1000);
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: '#FAD0C4' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
              style={{ color: '#C599B6' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold" style={{ color: '#C599B6' }}>Xác thực email</h1>
              <Badge style={{ backgroundColor: '#F2A7C3', color: '#C599B6' }}>
                Bước 2/2
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F2A7C3' }}>
                <Mail className="w-8 h-8" style={{ color: '#C599B6' }} />
              </div>
              <CardTitle style={{ color: '#C599B6' }}>Xác thực email</CardTitle>
              <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
                Chúng tôi đã gửi mã xác thực 6 chữ số đến email
              </p>
              <p className="font-medium" style={{ color: '#C599B6' }}>
                {bookingData.guestInfo.email}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-center block" style={{ color: '#C599B6' }}>
                    Nhập mã xác thực
                  </Label>
                  <Input
                    value={verificationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="123456"
                    className={`text-center text-2xl tracking-widest ${error ? 'border-red-500' : ''}`}
                    maxLength={6}
                    autoComplete="off"
                  />
                  {error && (
                    <p className="text-sm text-red-500 flex items-center justify-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="w-full text-white py-3"
                  style={{ backgroundColor: '#C599B6' }}
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Xác thực</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Countdown and Resend */}
              <div className="text-center space-y-3">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: '#C599B6' }}>
                    <Clock className="w-4 h-4" />
                    <span>Mã sẽ hết hạn sau: {formatTime(countdown)}</span>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: '#C599B6' }}>
                    Mã xác thực đã hết hạn
                  </p>
                )}

                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={!canResend || isResending}
                  className="text-sm"
                  style={{ color: '#C599B6' }}
                >
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-3 h-3" />
                      <span>Gửi lại mã</span>
                    </div>
                  )}
                </Button>
              </div>

              {/* Security Notice */}
              <div className="p-4 rounded-lg bg-white/50">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 mt-0.5" style={{ color: '#C599B6' }} />
                  <div className="text-xs space-y-1" style={{ color: '#C599B6' }}>
                    <p className="font-medium">Bảo mật thông tin</p>
                    <p className="opacity-80">
                      Mã xác thực này chỉ có hiệu lực trong 5 phút và chỉ được sử dụng một lần. 
                      Không chia sẻ mã này với bất kỳ ai.
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Info Reminder */}
              <div className="p-4 rounded-lg bg-white/50">
                <h4 className="font-medium mb-2" style={{ color: '#C599B6' }}>Thông tin đặt phòng</h4>
                <div className="text-sm space-y-1" style={{ color: '#C599B6' }}>
                  <p><strong>Mã đặt phòng:</strong> {bookingData.bookingId}</p>
                  <p><strong>Phòng:</strong> {bookingData.roomData.name}</p>
                  <p><strong>Khách hàng:</strong> {bookingData.guestInfo.firstName} {bookingData.guestInfo.lastName}</p>
                  <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN').format(bookingData.paymentInfo.total)}đ</p>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="p-3 rounded-lg border-2 border-dashed" style={{ borderColor: '#F2A7C3', backgroundColor: 'rgba(242, 167, 195, 0.1)' }}>
                <p className="text-xs text-center" style={{ color: '#C599B6' }}>
                  <strong>Demo:</strong> Sử dụng mã <span className="font-mono bg-white px-1 rounded">123456</span> để xác thực
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

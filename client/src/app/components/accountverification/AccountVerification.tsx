'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { 
  ArrowLeft,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface AccountVerificationProps {
  email: string;
  onBack: () => void;
  onVerificationSuccess: () => void;
}

export function AccountVerification({ email, onBack, onVerificationSuccess }: AccountVerificationProps) {
  const { verifyEmail, resendVerification } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
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

    try {
      const result = await verifyEmail(email, verificationCode);
      
      if (!isMountedRef.current) return;
      
      if (result.success) {
        setSuccessMessage("Xác thực thành công! Đang chuyển hướng...");
        redirectTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            onVerificationSuccess();
          }
        }, 1500);
      } else {
        setError(result.message || "Mã xác thực không đúng. Vui lòng thử lại.");
        setVerificationCode("");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
      setVerificationCode("");
    } finally {
      if (isMountedRef.current) {
        setIsVerifying(false);
      }
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setCanResend(false);
        setCountdown(600); // Reset countdown to 10 minutes
        alert("Mã xác thực mới đã được gửi đến email của bạn!");
      } else {
        setError(result.message || "Không thể gửi lại mã. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi lại mã.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e6b2ba' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: '#FAD0C4' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
              style={{ color: '#3D0301' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#3D0301' }}>Xác thực tài khoản</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <ImageWithFallback
                  src="/logo.jfif"
                  alt="KatHome In Town Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-2xl" style={{ color: '#3D0301' }}>
                Xác thực email
              </CardTitle>
              <p className="text-sm opacity-80 mt-2" style={{ color: '#3D0301' }}>
                Chúng tôi đã gửi mã xác thực 6 chữ số đến
              </p>
              <p className="font-medium text-base" style={{ color: '#3D0301' }}>
                {email}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="p-3 rounded-lg flex items-center space-x-2 bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-center block" style={{ color: '#3D0301' }}>
                    Nhập mã xác thực
                  </Label>
                  <Input
                    value={verificationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="123456"
                    className={`text-center text-2xl tracking-widest placeholder:text-gray-300 ${error ? 'border-red-500' : ''}`}
                    maxLength={6}
                    autoComplete="off"
                    disabled={isVerifying || !!successMessage}
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
                  disabled={isVerifying || verificationCode.length !== 6 || !!successMessage}
                  className="w-full text-white py-3"
                  style={{ backgroundColor: '#3D0301' }}
                >
                  {isVerifying ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực...</span>
                    </div>
                  ) : successMessage ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Thành công!</span>
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
                  <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: '#3D0301' }}>
                    <Clock className="w-4 h-4" />
                    <span>Mã sẽ hết hạn sau: {formatTime(countdown)}</span>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    ⚠️ Mã xác thực đã hết hạn
                  </p>
                )}

                <Button
                  variant="ghost"
                  onClick={handleResendCode}
                  disabled={!canResend || isResending || !!successMessage}
                  className="text-sm"
                  style={{ color: '#3D0301' }}
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

              {/* Help Text */}
              <div className="text-center text-sm" style={{ color: '#3D0301' }}>
                <p className="opacity-80">
                  Không nhận được email?{' '}
                  <button 
                    type="button"
                    onClick={() => alert("Vui lòng kiểm tra thư mục Spam/Junk hoặc bấm nút 'Gửi lại mã' sau khi mã hết hạn.")}
                    className="underline hover:no-underline font-medium"
                  >
                    Kiểm tra spam
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


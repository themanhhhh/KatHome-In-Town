'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Separator } from "../separator/separator";
import { useAuth } from "../../../contexts/AuthContext";
import type { LoginData } from "../../../lib/auth";
import { 
  ArrowLeft,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface LoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onBack, onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if user just verified their email
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage("✅ Email đã được xác thực! Bây giờ bạn có thể đăng nhập.");
      // Auto-clear after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.taiKhoan.trim()) {
      newErrors.taiKhoan = "Vui lòng nhập tên tài khoản";
    } else if (formData.taiKhoan.length < 3) {
      newErrors.taiKhoan = "Tên tài khoản phải có ít nhất 3 ký tự";
    }

    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Vui lòng nhập mật khẩu";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const loginData: LoginData = {
        taiKhoan: formData.taiKhoan,
        matKhau: formData.matKhau
      };
      
      const result = await login(loginData);

      if (result.success) {
        setSuccessMessage(result.message || "Đăng nhập thành công!");
        
        // Redirect after a short delay
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else if (result.requiresVerification) {
        setErrors({ general: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn." });
      } else {
        setErrors({ general: result.message || "Đăng nhập thất bại" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: error instanceof Error ? error.message : "Tên tài khoản hoặc mật khẩu không đúng" 
      });
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#3D0301' }}>Đăng nhập</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
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
                Chào mừng trở lại
              </CardTitle>
              <p className="text-sm opacity-80 mt-2" style={{ color: '#3D0301' }}>
                Đăng nhập để tiếp tục đặt phòng tại KatHome In Town 
              </p>
            </CardHeader>
            
            <CardContent>
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 rounded-lg flex items-center space-x-2 bg-green-50 border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">{successMessage}</span>
                </div>
              )}

              {/* General Error Message */}
              {errors.general && (
                <div className="mb-4 p-3 rounded-lg flex items-center space-x-2 bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label style={{ color: '#3D0301' }}>Tên tài khoản *</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.taiKhoan}
                      onChange={(e) => handleInputChange('taiKhoan', e.target.value)}
                      placeholder="Nhập tên tài khoản"
                      className={`pl-10 placeholder:text-gray-300 ${errors.taiKhoan ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                  </div>
                  {errors.taiKhoan && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.taiKhoan}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#3D0301' }}>Mật khẩu *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.matKhau}
                      onChange={(e) => handleInputChange('matKhau', e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className={`pl-10 pr-10 placeholder:text-gray-300 ${errors.matKhau ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#3D0301' }}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.matKhau && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.matKhau}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer" style={{ color: '#3D0301' }}>
                    <input type="checkbox" className="rounded" style={{ accentColor: '#3D0301' }} />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button 
                    type="button" 
                    className="underline hover:no-underline"
                    style={{ color: '#3D0301' }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !!successMessage}
                  className="w-full text-white py-3"
                  style={{ backgroundColor: '#3D0301' }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : successMessage ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Thành công!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Đăng nhập</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="text-center mt-6">
                  <p className="text-sm" style={{ color: '#3D0301' }}>
                    Chưa có tài khoản?{' '}
                    <button 
                      onClick={onSwitchToRegister}
                      className="font-semibold underline hover:no-underline"
                      style={{ color: '#3D0301' }}
                      disabled={isLoading}
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <p className="text-sm text-center opacity-80" style={{ color: '#3D0301' }}>
                  * Đăng nhập để trải nghiệm đầy đủ tính năng đặt phòng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

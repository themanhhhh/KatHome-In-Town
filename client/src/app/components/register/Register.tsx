'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Separator } from "../separator/separator";
import { useAuth } from "../../../contexts/AuthContext";
import type { RegisterData } from "../../../lib/auth";
import { 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  User,
  Phone
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface RegisterProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (email: string) => void;
}

export function Register({ onBack, onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    taiKhoan: "",
    gmail: "",
    soDienThoai: "",
    matKhau: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
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
    
    if (!formData.gmail.trim()) {
      newErrors.gmail = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.gmail)) {
      newErrors.gmail = "Email không hợp lệ";
    }

    if (!formData.soDienThoai.trim()) {
      newErrors.soDienThoai = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.soDienThoai.replace(/\s/g, ''))) {
      newErrors.soDienThoai = "Số điện thoại không hợp lệ";
    }

    if (!formData.matKhau.trim()) {
      newErrors.matKhau = "Vui lòng nhập mật khẩu";
    } else if (formData.matKhau.length < 6) {
      newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.matKhau !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vui lòng đồng ý với điều khoản sử dụng";
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
      const registerData: RegisterData = {
        taiKhoan: formData.taiKhoan,
        matKhau: formData.matKhau,
        gmail: formData.gmail,
        soDienThoai: formData.soDienThoai
      };
      
      const result = await register(registerData);

      if (result.success) {
        setSuccessMessage(result.message || "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
        
        // Redirect to verification page after a short delay
        setTimeout(() => {
          onRegisterSuccess(formData.gmail);
        }, 2000);
      } else {
        setErrors({ general: result.message || "Đăng ký thất bại" });
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrors({ 
        general: error instanceof Error ? error.message : "Đăng ký thất bại. Vui lòng thử lại." 
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
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#3D0301' }}>Đăng ký</h1>
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
                Tạo tài khoản mới
              </CardTitle>
              <p className="text-sm opacity-80 mt-2" style={{ color: '#3D0301' }}>
                Đăng ký để bắt đầu đặt phòng tại KatHome In Town
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
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

                {/* Email */}
                <div className="space-y-2">
                  <Label style={{ color: '#3D0301' }}>Email *</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={formData.gmail}
                      onChange={(e) => handleInputChange('gmail', e.target.value)}
                      placeholder="example@email.com"
                      className={`pl-10 placeholder:text-gray-300 ${errors.gmail ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                  </div>
                  {errors.gmail && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.gmail}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label style={{ color: '#3D0301' }}>Số điện thoại *</Label>
                  <div className="relative">
                    <Input
                      value={formData.soDienThoai}
                      onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                      placeholder="0123456789"
                      className={`pl-10 placeholder:text-gray-300 ${errors.soDienThoai ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                  </div>
                  {errors.soDienThoai && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.soDienThoai}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
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

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label style={{ color: '#3D0301' }}>Xác nhận mật khẩu *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className={`pl-10 pr-10 placeholder:text-gray-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#3D0301' }}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="space-y-2">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 rounded" 
                      style={{ accentColor: '#3D0301' }} 
                    />
                    <span className="text-sm" style={{ color: '#3D0301' }}>
                      Tôi đồng ý với{' '}
                      <button type="button" className="underline hover:no-underline font-medium">
                        Điều khoản sử dụng
                      </button>
                      {' '}và{' '}
                      <button type="button" className="underline hover:no-underline font-medium">
                        Chính sách bảo mật
                      </button>
                      {' '}của KatHome In Town 
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.acceptTerms}</span>
                    </p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading || !!successMessage}
                  className="w-full text-white py-3 mt-6"
                  style={{ backgroundColor: '#3D0301' }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </div>
                  ) : successMessage ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Thành công!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Tạo tài khoản</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="text-center mt-6">
                  <p className="text-sm" style={{ color: '#3D0301' }}>
                    Đã có tài khoản?{' '}
                    <button 
                      onClick={onSwitchToLogin}
                      className="font-semibold underline hover:no-underline"
                      style={{ color: '#3D0301' }}
                      disabled={isLoading}
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <p className="text-sm text-center opacity-80" style={{ color: '#3D0301' }}>
                  * Đăng ký để trải nghiệm đầy đủ tính năng đặt phòng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

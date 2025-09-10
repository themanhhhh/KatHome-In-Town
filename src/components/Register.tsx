import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "../contexts/AuthContext";
import { 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  UserPlus,
  User,
  Phone,
  MapPin
} from "lucide-react";

interface RegisterProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess: (userData: any) => void;
}

export function Register({ onBack, onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
    
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.city) newErrors.city = "Vui lòng chọn thành phố";
    
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

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        registrationTime: new Date().toISOString()
      };
      register(userData);
      setIsLoading(false);
      onRegisterSuccess(userData);
    }, 2000);
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
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#C599B6' }}>Đăng ký</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <Card className="border-0 shadow-xl" style={{ backgroundColor: '#FAD0C4' }}>
            <CardHeader className="text-center pb-6">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#C599B6' }}
              >
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl" style={{ color: '#C599B6' }}>
                Tạo tài khoản mới
              </CardTitle>
              <p className="text-sm opacity-80 mt-2" style={{ color: '#C599B6' }}>
                Đăng ký để trải nghiệm dịch vụ tốt nhất tại KatHome In Town 
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#C599B6' }}>Họ *</Label>
                    <div className="relative">
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nguyễn"
                        className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#C599B6' }} />
                    </div>
                    {errors.firstName && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: '#C599B6' }}>Tên *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Văn A"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.lastName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label style={{ color: '#C599B6' }}>Email *</Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#C599B6' }} />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label style={{ color: '#C599B6' }}>Số điện thoại *</Label>
                  <div className="relative">
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0123456789"
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#C599B6' }} />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label style={{ color: '#C599B6' }}>Thành phố *</Label>
                  <Select value={formData.city} onValueChange={(value) => handleInputChange('city', value)}>
                    <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="ha-noi">Hà Nội</SelectItem>
                      <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                      <SelectItem value="da-lat">Đà Lạt</SelectItem>
                      <SelectItem value="nha-trang">Nha Trang</SelectItem>
                      <SelectItem value="hoi-an">Hội An</SelectItem>
                      <SelectItem value="phu-quoc">Phú Quốc</SelectItem>
                      <SelectItem value="can-tho">Cần Thơ</SelectItem>
                      <SelectItem value="hai-phong">Hải Phòng</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.city}</span>
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label style={{ color: '#C599B6' }}>Mật khẩu *</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#C599B6' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#C599B6' }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label style={{ color: '#C599B6' }}>Xác nhận mật khẩu *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#C599B6' }} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#C599B6' }}
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
                      style={{ accentColor: '#C599B6' }} 
                    />
                    <span className="text-sm" style={{ color: '#C599B6' }}>
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
                  disabled={isLoading}
                  className="w-full text-white py-3 mt-6"
                  style={{ backgroundColor: '#C599B6' }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo tài khoản...</span>
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
                  <p className="text-sm" style={{ color: '#C599B6' }}>
                    Đã có tài khoản?{' '}
                    <button 
                      onClick={onSwitchToLogin}
                      className="font-semibold underline hover:no-underline"
                      style={{ color: '#C599B6' }}
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

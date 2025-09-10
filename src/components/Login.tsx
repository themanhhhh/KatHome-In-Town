import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  User
} from "lucide-react";

interface LoginProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (userData: any) => void;
}

export function Login({ onBack, onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
      // Demo login - accept any email with password "123456"
      if (formData.password === "123456") {
        const userData = {
          id: 1,
          email: formData.email,
          firstName: "Nguyễn",
          lastName: "Văn A",
          phone: "0123456789",
          loginTime: new Date().toISOString()
        };
        login(userData);
        setIsLoading(false);
        onLoginSuccess(userData);
      } else {
        setIsLoading(false);
        setErrors({ password: "Email hoặc mật khẩu không đúng" });
      }
    }, 1500);
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
            <h1 className="text-xl font-semibold font-heading" style={{ color: '#C599B6' }}>Đăng nhập</h1>
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
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl" style={{ color: '#C599B6' }}>
                Chào mừng trở lại
              </CardTitle>
              <p className="text-sm opacity-80 mt-2" style={{ color: '#C599B6' }}>
                Đăng nhập để tiếp tục đặt phòng tại KatHome In Town 
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer" style={{ color: '#C599B6' }}>
                    <input type="checkbox" className="rounded" style={{ accentColor: '#C599B6' }} />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button 
                    type="button" 
                    className="underline hover:no-underline"
                    style={{ color: '#C599B6' }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-3"
                  style={{ backgroundColor: '#C599B6' }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang đăng nhập...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Đăng nhập</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="text-center mt-6">
                  <p className="text-sm" style={{ color: '#C599B6' }}>
                    Chưa có tài khoản?{' '}
                    <button 
                      onClick={onSwitchToRegister}
                      className="font-semibold underline hover:no-underline"
                      style={{ color: '#C599B6' }}
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </div>
              </div>

              {/* Demo Notice */}
              <div className="mt-6 p-3 rounded-lg border-2 border-dashed" style={{ borderColor: '#F2A7C3', backgroundColor: 'rgba(242, 167, 195, 0.1)' }}>
                <p className="text-xs text-center" style={{ color: '#C599B6' }}>
                  <strong>Demo:</strong> Sử dụng bất kỳ email nào với mật khẩu <span className="font-mono bg-white px-1 rounded">123456</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

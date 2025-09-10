import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Menu, Phone, Mail, User, LogOut, Settings, Heart, ChevronDown, MapPin } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeaderProps {
  onShowLogin?: () => void;
  onShowRegister?: () => void;
  onShowAdmin?: () => void;
}

export function Header({ onShowLogin, onShowRegister, onShowAdmin }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm" style={{ borderColor: '#F8E8EC' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <ImageWithFallback
              src="/logo.jfif"
              alt="KatHome In Town Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#E8A5B8' }}>
              KatHome In Town
            </h1>
            <p className="text-xs opacity-70" style={{ color: '#B8899A' }}>Hệ thống homestay Hà Nội</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#E8A5B8' }}>
            Trang chủ
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 hover:opacity-75 transition-opacity font-medium" style={{ color: '#E8A5B8' }}>
                <span>Cơ sở</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              <div className="p-2">
                <div className="text-sm font-semibold mb-2 px-2" style={{ color: '#E8A5B8' }}>
                  Hệ thống cơ sở tại Hà Nội
                </div>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Tây Hồ</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      6 Trịnh Công Sơn • 274 Vũ Miên<br />
                      133B Yên Phụ • 145 Âu Cơ
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Ba Đình</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      29 Phạm Hồng Thái
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Hoàn Kiếm</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      7A ngõ Dã Tượng
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Thanh Xuân</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      29D Phương Liệt
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Đống Đa</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      30 Vườn hoa 1-6, Hoàng Cầu
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start space-x-3 p-3 cursor-pointer">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A5B8' }} />
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#E8A5B8' }}>Cầu Giấy</div>
                    <div className="text-xs opacity-70" style={{ color: '#B8899A' }}>
                      18 Xuân Quỳnh, Yên Hòa
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="w-full text-center">
                    <span className="text-sm font-medium" style={{ color: '#E8A5B8' }}>
                      Xem bảng giá các cơ sở
                    </span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href="#about" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#E8A5B8' }}>
            Giới thiệu
          </a>
          <a href="#services" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#E8A5B8' }}>
            Dịch vụ
          </a>
          <a href="#contact" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#E8A5B8' }}>
            Liên hệ
          </a>
          <button 
            onClick={onShowAdmin}
            className="hover:opacity-75 transition-opacity font-medium" 
            style={{ color: '#E8A5B8' }}
          >
            Admin
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#E8A5B8' }}>
               <Phone className="w-4 h-4" />
               <span>098 894 65 68</span>
             </div>
             <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#E8A5B8' }}>
               <Mail className="w-4 h-4" />
               <span>kathome.luv@gmail.com</span>
             </div>
          </div>
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden md:inline text-sm font-medium" style={{ color: '#E8A5B8' }}>
                Xin chào, {user.firstName}!
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2 font-medium"
                    style={{ borderColor: '#E8A5B8', color: '#E8A5B8' }}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Thông tin cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Danh sách yêu thích</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center space-x-2 text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={onShowLogin}
                  className="font-medium"
                  style={{ color: '#E8A5B8' }}
                >
                  Đăng nhập
                </Button>
                <Button 
                  size="sm"
                  onClick={onShowRegister}
                  className="text-white border-0 font-medium"
                  style={{ backgroundColor: '#E8A5B8' }}
                >
                  Đăng ký
                </Button>
            </div>
          )}
          
           <Button variant="ghost" size="icon" className="md:hidden" style={{ color: '#E8A5B8' }}>
             <Menu className="w-5 h-5" />
           </Button>
        </div>
      </div>
    </header>
  );
}
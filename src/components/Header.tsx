import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Menu, Phone, Mail, User, LogOut, Settings, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onShowLogin?: () => void;
  onShowRegister?: () => void;
  onShowAdmin?: () => void;
}

export function Header({ onShowLogin, onShowRegister, onShowAdmin }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm" style={{ borderColor: '#F2D8D8' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold" style={{ color: '#D91A73' }}>
            KatHome In Town 
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="hover:opacity-75 transition-opacity" style={{ color: '#D91A73' }}>
            Trang chủ
          </a>
          <a href="#about" className="hover:opacity-75 transition-opacity" style={{ color: '#D91A73' }}>
            Giới thiệu
          </a>
          <a href="#amenities" className="hover:opacity-75 transition-opacity" style={{ color: '#D91A73' }}>
            Tiện nghi
          </a>
          <a href="#gallery" className="hover:opacity-75 transition-opacity" style={{ color: '#D91A73' }}>
            Hình ảnh
          </a>
          <a href="#contact" className="hover:opacity-75 transition-opacity" style={{ color: '#D91A73' }}>
            Liên hệ
          </a>
          <button 
            onClick={onShowAdmin}
            className="hover:opacity-75 transition-opacity" 
            style={{ color: '#D91A73' }}
          >
            Admin
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm" style={{ color: '#D91A73' }}>
              <Phone className="w-4 h-4" />
              <span>0123 456 789</span>
            </div>
            <div className="flex items-center space-x-2 text-sm" style={{ color: '#D91A73' }}>
              <Mail className="w-4 h-4" />
              <span>info@rosehomestay.com</span>
            </div>
          </div>
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <span className="hidden md:inline text-sm" style={{ color: '#D91A73' }}>
                Xin chào, {user.firstName}!
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2"
                    style={{ borderColor: '#D91A73', color: '#D91A73' }}
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
                style={{ color: '#D91A73' }}
              >
                Đăng nhập
              </Button>
              <Button 
                size="sm"
                onClick={onShowRegister}
                className="text-white border-0"
                style={{ backgroundColor: '#D91A73' }}
              >
                Đăng ký
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden" style={{ color: '#D91A73' }}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
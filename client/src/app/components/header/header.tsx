'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdown-menu/dropdown-menu";
import { Menu, Phone, Mail, User as UserIcon, LogOut, Settings, Heart, ChevronDown, MapPin } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { coSoApi } from "../../../lib/api";

interface CoSo {
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  sdt: string;
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [branches, setBranches] = useState<CoSo[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await coSoApi.getAll();
        setBranches(data as CoSo[]);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchClick = (maCoSo: string) => {
    router.push(`/branches/${maCoSo}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm" style={{ borderColor: '#F8E8EC' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <ImageWithFallback
              src="/logo.jfif"
              alt="KatHome In Town Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading" style={{ color: '#3D0301' }}>
              KatHome In Town
            </h1>
            <p className="text-xs opacity-70" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Hệ thống homestay Hà Nội</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#3D0301' }}>
            Trang chủ
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 hover:opacity-75 transition-opacity font-medium" style={{ color: '#3D0301' }}>
                <span>Cơ sở</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 bg-white border shadow-lg max-h-96 overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
              <div className="p-2">
                <div className="text-sm font-semibold mb-2 px-2" style={{ color: '#3D0301' }}>
                  Hệ thống cơ sở tại Hà Nội ({branches.length})
                </div>
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <DropdownMenuItem 
                      key={branch.maCoSo}
                      className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => handleBranchClick(branch.maCoSo)}
                    >
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3D0301' }} />
                      <div className="flex-1">
                        <div className="font-medium text-sm" style={{ color: '#3D0301' }}>
                          {branch.tenCoSo}
                        </div>
                        <div className="text-xs opacity-70 mt-0.5" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                          {branch.diaChi}
                        </div>
                        <div className="text-xs opacity-60 mt-0.5 flex items-center space-x-1" style={{ color: 'rgba(61, 3, 1, 0.6)' }}>
                          <Phone className="w-3 h-3" />
                          <span>{branch.sdt}</span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                    Đang tải danh sách cơ sở...
                  </div>
                )}
                <DropdownMenuSeparator />
                <Link href="/branches">
                  <DropdownMenuItem className="p-3 cursor-pointer">
                    <div className="w-full text-center">
                      <span className="text-sm font-medium" style={{ color: '#3D0301' }}>
                        📍 Xem tất cả cơ sở
                      </span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <a href="#about" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#3D0301' }}>
            Giới thiệu
          </a>
          <a href="#contact" className="hover:opacity-75 transition-opacity font-medium" style={{ color: '#3D0301' }}>
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
             <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#3D0301' }}>
               <Phone className="w-4 h-4" />
               <span>0375 914 908</span>
             </div>
             <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#3D0301' }}>
               <Mail className="w-4 h-4" />
               <span>kathome.luv@gmail.com</span>
             </div>
          </div>
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center space-x-2 font-medium"
                    style={{ borderColor: '#3D0301', color: '#3D0301' }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden md:inline">{user.taiKhoan}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
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
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="font-medium"
                    style={{ color: '#3D0301' }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm"
                    className="text-white border-0 font-medium"
                    style={{ backgroundColor: '#3D0301' }}
                  >
                    Đăng ký
                  </Button>
                </Link>
            </div>
          )}
          
           <Button variant="ghost" size="icon" className="md:hidden" style={{ color: '#3D0301' }}>
             <Menu className="w-5 h-5" />
           </Button>
        </div>
      </div>
    </header>
  );
}
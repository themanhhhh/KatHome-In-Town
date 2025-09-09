import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { 
  LayoutDashboard,
  Calendar,
  Users,
  Bed,
  Settings,
  LogOut,
  Menu,
  Home,
  BarChart3
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onBackToHome: () => void;
}

export function AdminLayout({ children, currentPage, onNavigate, onBackToHome }: AdminLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mở sidebar mặc định trên desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Thiết lập trạng thái ban đầu
    handleResize();

    // Lắng nghe thay đổi kích thước màn hình
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Tổng quan hệ thống'
    },
    {
      id: 'bookings',
      label: 'Đặt phòng',
      icon: Calendar,
      description: 'Quản lý booking'
    },
    {
      id: 'users',
      label: 'Người dùng',
      icon: Users,
      description: 'Quản lý khách hàng'
    },
    {
      id: 'rooms',
      label: 'Phòng',
      icon: Bed,
      description: 'Quản lý phòng'
    },
    {
      id: 'analytics',
      label: 'Báo cáo',
      icon: BarChart3,
      description: 'Thống kê doanh thu'
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      description: 'Cấu hình hệ thống'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm flex-shrink-0" style={{ borderColor: '#F2D8D8' }}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Sidebar toggle button - works for both mobile and desktop */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2"
                style={{ color: '#D91A73' }}
                title={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold" style={{ color: '#D91A73' }}>
                  KatHome In Town  Admin
                </h1>
                
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="flex items-center space-x-2"
                style={{ color: '#D91A73' }}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Về trang chủ</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-medium" style={{ color: '#D91A73' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                        Administrator
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="flex items-center space-x-2"
                      style={{ borderColor: '#D91A73', color: '#D91A73' }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Đăng xuất</span>
                    </Button>
                  </>
                ) : (
                  <div className="text-sm" style={{ color: '#D91A73' }}>
                    <div className="font-medium">Admin Panel</div>
                    <div className="text-xs opacity-60">Chế độ demo</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex bg-white shadow-lg flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}>
          <div className="flex flex-col h-full w-full">
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                        onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-white shadow-md' 
                        : 'hover:bg-gray-50'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                    style={{
                      backgroundColor: isActive ? '#D91A73' : 'transparent',
                      color: isActive ? 'white' : '#D91A73'
                    }}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} />
                    {sidebarOpen && (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.label}</div>
                        <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            {sidebarOpen && (
              <div className="p-4 border-t" style={{ borderColor: '#F2D8D8' }}>
                <div className="text-xs text-center opacity-60" style={{ color: '#D91A73' }}>
                  KatHome In Town  Admin Panel
                  <br />
                  Version 1.0.0
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" style={{ top: '64px' }}>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar Content */}
            <div className="fixed left-0 w-64 bg-white shadow-lg" style={{ top: '64px', bottom: 0 }}>
              <div className="flex flex-col h-full">
                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'text-white shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: isActive ? '#D91A73' : 'transparent',
                          color: isActive ? 'white' : '#D91A73'
                        }}
                      >
                        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.label}</div>
                          <div className={`text-xs mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t" style={{ borderColor: '#F2D8D8' }}>
                  <div className="text-xs text-center opacity-60" style={{ color: '#D91A73' }}>
                    Rose Homestay Admin Panel
                    <br />
                    Version 1.0.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

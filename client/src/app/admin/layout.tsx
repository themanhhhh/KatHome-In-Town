"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard,
  Calendar,
  Users,
  Bed,
  LogOut,
  Menu,
  Home,
  BarChart3,
  Building
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../components/loading-spinner";

import Style from "../styles/adminlayout.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Tổng quan hệ thống',
    href: '/admin'
  },
  {
    id: 'bookings',
    label: 'Đặt phòng',
    icon: Calendar,
    description: 'Quản lý booking',
    href: '/admin/bookingsmanagement'
  },
  {
    id: 'users',
    label: 'Người dùng',
    icon: Users,
    description: 'Quản lý khách hàng',
    href: '/admin/usersmanagement'
  },
  {
    id: 'rooms',
    label: 'Phòng',
    icon: Bed,
    description: 'Quản lý phòng',
    href: '/admin/roomsmanagement'
  },
  {
    id: 'coso',
    label: 'Cơ sở',
    icon: Building,
    description: 'Quản lý cơ sở',
    href: '/admin/cosomanagement'
  },
  {
    id: 'analytics',
    label: 'Báo cáo',
    icon: BarChart3,
    description: 'Thống kê doanh thu',
    href: '/admin/reportsmanagement'
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isAuthenticated, isAdmin, canManage, isLoading, logout } = useAuth();

  // Redirect nếu không có quyền quản lý (admin hoặc quản lý)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        window.location.href = '/login';
        return;
      }
      if (!canManage) {
        window.location.href = '/';
        return;
      }
    }
  }, [isAuthenticated, canManage, isLoading]);

  // Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (href: string, id: string) => {
    setCurrentPage(id);
    window.location.href = href;
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    logout();
    handleBackToHome();
  };

  // Determine current page based on current URL
  useEffect(() => {
    const path = window.location.pathname;
    const currentItem = menuItems.find(item => item.href === path);
    if (currentItem) {
      setCurrentPage(currentItem.id);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (!isAuthenticated || !canManage) {
    return null; // đã redirect ở trên
  }

  return (
    <div className={Style.adminLayout}>
      {/* Header */}
      <header className={Style.header}>
        <div className={Style.headerContainer}>
          <div className={Style.headerContent}>
            <div className={Style.headerLeft}>
              {/* Sidebar toggle button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={Style.menuButton}
                title={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className={Style.headerTitle}>
                  KatHome In Town Admin
                </h1>
              </div>
            </div>

            <div className={Style.headerRight}>
              <button
                onClick={handleBackToHome}
                className={Style.homeButton}
              >
                <Home className="w-4 h-4" />
                <span className={Style.hiddenOnMobile}>Về trang chủ</span>
              </button>
              
              <div className={Style.userInfo}>
                {user ? (
                  <>
                    <div className={`${Style.userDetails} ${Style.hiddenOnMobile}`}>
                      <div className={Style.userName}>
                        {user.taiKhoan}
                      </div>
                      <div className={Style.userRole}>
                        Administrator
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={Style.logoutButton}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className={Style.hiddenOnMobile}>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <div className={Style.demoInfo}>
                    <div className={Style.demoTitle}>Admin Panel</div>
                    <div className={Style.demoSubtitle}>Chế độ demo</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={Style.mainContainer}>
        {/* Desktop Sidebar */}
        <aside className={`${Style.desktopSidebar} ${
          sidebarOpen ? Style.sidebarOpen : Style.sidebarClosed
        }`}>
          <div className={Style.sidebarContent}>
            {/* Navigation */}
            <nav className={Style.navigation}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href, item.id)}
                    className={`${Style.navItem} ${
                      isActive ? Style.navItemActive : Style.navItemInactive
                    } ${!sidebarOpen ? Style.navItemCentered : ''}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <Icon className={`${Style.navIcon} ${sidebarOpen ? Style.navIconWithMargin : ''}`} />
                    {sidebarOpen && (
                      <div className={Style.navContent}>
                        <div className={Style.navLabel}>{item.label}</div>
                        <div className={`${Style.navDescription} ${
                          isActive ? Style.navDescriptionActive : Style.navDescriptionInactive
                        }`}>
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
              <div className={Style.sidebarFooter}>
                <div className={Style.footerText}>
                  KatHome In Town Admin Panel
                  <br />
                  Version 1.0.0
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className={Style.mobileSidebarOverlay}>
            {/* Backdrop */}
            <div 
              className={Style.mobileSidebarBackdrop}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar Content */}
            <div className={Style.mobileSidebarContent}>
              <div className={Style.sidebarContent}>
                {/* Navigation */}
                <nav className={Style.navigation}>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleNavigation(item.href, item.id);
                          setSidebarOpen(false);
                        }}
                        className={`${Style.navItem} ${
                          isActive ? Style.navItemActive : Style.navItemInactive
                        }`}
                      >
                        <Icon className={`${Style.navIcon} ${Style.navIconWithMargin}`} />
                        <div className={Style.navContent}>
                          <div className={Style.navLabel}>{item.label}</div>
                          <div className={`${Style.navDescription} ${
                            isActive ? Style.navDescriptionActive : Style.navDescriptionInactive
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className={Style.sidebarFooter}>
                  <div className={Style.footerText}>
                    KatHome In Town Admin Panel
                    <br />
                    Version 1.0.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className={Style.mainContent}>
          <main className={Style.contentArea}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

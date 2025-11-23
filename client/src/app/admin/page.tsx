"use client";

import React, { useState, useMemo } from "react";
import { 
  Users,
  Calendar,
  Bed,
  Clock,
  Star,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  X
} from "lucide-react";

import Style from "../styles/adminpage.module.css";
import { useApi } from "../../hooks/useApi";
import { donDatPhongApi, phongApi, khachHangApi, usersApi } from "../../lib/api";
import { ApiBooking, ApiRoom, ApiCustomer, ApiUser } from "../../types/api";
import LoadingSpinner from "../components/loading-spinner";
import { Input } from "../components/input/input";

type FilterType = 'checkin' | 'rooms' | 'coso' | 'bookings' | null;

const AdminPage = () => {
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Fetch data from API
  const { data: bookings = [], loading: bookingsLoading, error: bookingsError } = useApi<ApiBooking[]>(
    () => donDatPhongApi.getAll(),
    []
  );

  const { data: rooms = [], loading: roomsLoading, error: roomsError } = useApi<ApiRoom[]>(
    () => phongApi.getAll(),
    []
  );

  const { data: customers = [], loading: customersLoading, error: customersError } = useApi<ApiCustomer[]>(
    () => khachHangApi.getAll(),
    []
  );

  const { data: users = [], loading: usersLoading, error: usersError } = useApi<ApiUser[]>(
    () => usersApi.getAll(),
    []
  );

  // Filter data based on date range
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.ngayDat || 0);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate >= fromDate;
      });
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.ngayDat || 0);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate <= toDate;
      });
    }
    
    return filtered;
  }, [bookings, dateFrom, dateTo]);

  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];
    
    if (selectedFilter === 'rooms') {
      filtered = filtered.filter(room => room.tenPhong);
    } else if (selectedFilter === 'coso') {
      filtered = filtered.filter(room => room.coSo?.tenCoSo);
    }
    
    return filtered;
  }, [rooms, selectedFilter]);

  // Calculate statistics from filtered data
  const totalRevenue = (filteredBookings || []).reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const totalBookings = (filteredBookings || []).length;
  const totalUsers = (users || []).length;
  const totalCustomers = (customers || []).length;
  const roomsWithTenPhong = (filteredRooms || []).filter(room => room.tenPhong).length;
  const roomsWithCoSo = (filteredRooms || []).filter(room => room.coSo?.tenCoSo).length;
  const occupancyRate = (rooms || []).length > 0 ? (roomsWithTenPhong / (rooms || []).length) * 100 : 0;

  const stats = {
    totalBookings,
    totalRevenue,
    totalUsers: totalUsers + totalCustomers,
    occupancyRate: Math.round(occupancyRate),
    monthlyGrowth: 12.5,
    averageRating: 4.8,
    roomsWithTenPhong,
    roomsWithCoSo
  };

  // Get recent bookings - filtered by selected filter
  const recentBookings = useMemo(() => {
    let bookingsToShow = [...filteredBookings];
    
    // Apply filter based on selected stat card
    if (selectedFilter === 'checkin') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      bookingsToShow = bookingsToShow.filter(booking => {
        if (!booking.checkinDuKien) return false;
        const checkinDate = new Date(booking.checkinDuKien);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === today.getTime();
      });
    } else if (selectedFilter === 'bookings') {
      // Show all bookings (already filtered by date range if set)
      bookingsToShow = [...filteredBookings];
    }
    
    return bookingsToShow
      .sort((a, b) => {
        const dateA = new Date(a.ngayDat || 0).getTime();
        const dateB = new Date(b.ngayDat || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, selectedFilter === 'bookings' ? 10 : 3) // Show more if "Tổng booking" is selected
      .map(booking => {
        const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soNguoiLon || 0) + (ct.soTreEm || 0), 0);
        const firstRoom = booking.chiTiet?.[0];
        
        return {
          id: booking.maDatPhong,
          guestName: booking.khachHang?.ten || booking.khachHang?.tenKhachHang || booking.customerName || 'N/A',
          room: firstRoom?.phong?.moTa || 'N/A',
          checkIn: booking.checkinDuKien,
          checkOut: booking.checkoutDuKien,
          total: booking.totalAmount || 0,
          status: booking.trangThai
        };
      });
  }, [filteredBookings, selectedFilter]);

  // Get upcoming check-ins (today's check-ins or filtered by date range)
  const upcomingCheckIns = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    let checkInsToShow = (filteredBookings || [])
      .filter(booking => {
        // Only include confirmed or reserved bookings (not cancelled or completed)
        if (!['CF', 'R'].includes(booking.trangThai)) {
          return false;
        }
        
        if (!booking.checkinDuKien) {
          return false;
        }
        
        // Parse the check-in date
        const checkinDate = new Date(booking.checkinDuKien);
        checkinDate.setHours(0, 0, 0, 0); // Normalize to start of day
        
        // If "Check In hôm nay" filter is selected, only show today's check-ins
        if (selectedFilter === 'checkin') {
          return checkinDate.getTime() === today.getTime();
        }
        
        // If date range is set, filter by date range
        if (dateFrom || dateTo) {
          if (dateFrom) {
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            if (checkinDate < fromDate) return false;
          }
          if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (checkinDate > toDate) return false;
          }
          return true;
        }
        
        // Otherwise, check if check-in is today
        return checkinDate.getTime() === today.getTime();
      });
    
    return checkInsToShow
      .sort((a, b) => {
        // Sort by check-in time if available
        const dateA = new Date(a.checkinDuKien || 0).getTime();
        const dateB = new Date(b.checkinDuKien || 0).getTime();
        return dateA - dateB;
      })
      .slice(0, selectedFilter === 'checkin' ? 10 : 2) // Show more if "Check In hôm nay" is selected
      .map(booking => {
        const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soNguoiLon || 0) + (ct.soTreEm || 0), 0);
        const firstRoom = booking.chiTiet?.[0];
        
        return {
          id: booking.maDatPhong,
          guestName: booking.khachHang?.ten || booking.khachHang?.tenKhachHang || booking.customerName || 'N/A',
          room: firstRoom?.phong?.moTa || 'N/A',
          checkIn: `${booking.checkinDuKien} 14:00`,
          phone: booking.khachHang?.sdt || booking.khachHang?.soDienThoai || booking.customerPhone || 'N/A',
          guests: totalGuests
        };
      });
  }, [filteredBookings, selectedFilter, dateFrom, dateTo]);

  // Loading and error states
  const isLoading = bookingsLoading || roomsLoading || customersLoading || usersLoading;
  const hasError = bookingsError || roomsError || customersError || usersError;

  if (isLoading) {
    return <LoadingSpinner text="Đang tải ..." />;
  }

  if (hasError) {
    return (
      <div className={Style.adminpage}>
        <div className={Style.errorContainer}>
          <AlertCircle className={Style.errorIcon} />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{bookingsError || roomsError || customersError || usersError}</p>
          <button onClick={() => window.location.reload()} className={Style.retryButton}>
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CF': // Confirmed
        return <span className={`${Style.badge} ${Style.badgeConfirmed}`}>Đã xác nhận</span>;
      case 'R': // Reserved/Pending
        return <span className={`${Style.badge} ${Style.badgePending}`}>Chờ xác nhận</span>;
      case 'AB': // Aborted/Cancelled
        return <span className={`${Style.badge} ${Style.badgeCancelled}`}>Đã hủy</span>;
      case 'CC': // Checked-out/Completed
        return <span className={`${Style.badge} ${Style.badgeConfirmed}`}>Hoàn thành</span>;
      default:
        return <span className={Style.badge}>{status}</span>;
    }
  };

  const handleFilterClick = (filterType: FilterType) => {
    if (selectedFilter === filterType) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filterType);
    }
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = selectedFilter !== null || dateFrom || dateTo;

  return (
    <div className={Style.adminpage}>
      <div className={Style.container}>
        {/* Header */}
        <div className={Style.header}>
          <h1 className={Style.headerTitle}>
            Dashboard
          </h1>
          <p className={Style.headerDescription}>
            Chào mừng trở lại! Đây là tổng quan hoạt động của KatHome In Town.
          </p>
          
          {/* Date Range Filter */}
          <div className={Style.filterSection}>
            <div className={Style.filterHeader}>
              <Filter className="w-4 h-4" style={{ color: '#3D0301' }} />
              <span style={{ color: '#3D0301', fontWeight: 500 }}>Lọc theo thời gian</span>
            </div>
            <div className={Style.dateRangeContainer}>
              <div className={Style.dateInputGroup}>
                <label className={Style.dateLabel}>Từ ngày:</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={Style.dateInput}
                />
              </div>
              <div className={Style.dateInputGroup}>
                <label className={Style.dateLabel}>Đến ngày:</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={Style.dateInput}
                  min={dateFrom || undefined}
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedFilter(null);
                    clearDateFilter();
                  }}
                  className={Style.clearFilterButton}
                  title="Xóa bộ lọc"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={Style.statsGrid}>
          <div 
            className={`${Style.statCard} ${selectedFilter === 'checkin' ? Style.statCardActive : ''}`}
            onClick={() => handleFilterClick('checkin')}
            style={{ cursor: 'pointer' }}
            title="Click để lọc theo Check In"
          >
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconGreen}`}>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{upcomingCheckIns.length}</div>
                <div className={Style.statLabel}>Check In hôm nay</div>
              </div>
            </div>
          </div>

          <div 
            className={`${Style.statCard} ${selectedFilter === 'rooms' ? Style.statCardActive : ''}`}
            onClick={() => handleFilterClick('rooms')}
            style={{ cursor: 'pointer' }}
            title="Click để lọc phòng có tên"
          >
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconRed}`}>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{roomsWithTenPhong}</div>
                <div className={Style.statLabel}>Có tên phòng</div>
              </div>
            </div>
          </div>

          <div 
            className={`${Style.statCard} ${selectedFilter === 'coso' ? Style.statCardActive : ''}`}
            onClick={() => handleFilterClick('coso')}
            style={{ cursor: 'pointer' }}
            title="Click để lọc phòng có cơ sở"
          >
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconPurple}`}>
                <Bed className="w-5 h-5 text-purple-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{roomsWithCoSo}</div>
                <div className={Style.statLabel}>Có cơ sở</div>
              </div>
            </div>
          </div>

          <div 
            className={`${Style.statCard} ${selectedFilter === 'bookings' ? Style.statCardActive : ''}`}
            onClick={() => handleFilterClick('bookings')}
            style={{ cursor: 'pointer' }}
            title="Click để xem tất cả booking"
          >
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconOrange}`}>
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{totalBookings}</div>
                <div className={Style.statLabel}>Tổng booking</div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.mainGrid}>
          {/* Recent Bookings */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <h3 className={Style.cardTitle}>
                <Calendar className="w-5 h-5" />
                <span>Đặt phòng gần đây</span>
              </h3>
            </div>
            <div className={Style.cardContent}>
              <div>
                {recentBookings.map((booking, index) => (
                  <div key={booking.id || `booking-${index}`} className={Style.bookingItem}>
                    <div className={Style.bookingInfo}>
                      <div className={Style.bookingHeader}>
                        <h4 className={Style.guestName}>
                          {booking.guestName}
                        </h4>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className={Style.roomName}>
                        {booking.room}
                      </p>
                      <p className={Style.dateRange}>
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                    </div>
                    <div className={Style.bookingPrice}>
                      <p className={Style.price}>
                        {formatPrice(booking.total)}
                      </p>
                      <p className={Style.bookingId}>
                        {booking.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Check-ins */}
          <div className={Style.card}>
            <div className={Style.cardHeader}>
              <h3 className={Style.cardTitle}>
                <Clock className="w-5 h-5" />
                <span>Khách nhận phòng hôm nay</span>
              </h3>
            </div>
            <div className={Style.cardContent}>
              <div>
                {upcomingCheckIns.map((checkin, index) => (
                  <div key={checkin.id || `checkin-${index}`} className={Style.checkinItem}>
                    <div className={Style.checkinIcon}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div className={Style.checkinInfo}>
                      <h4 className={Style.guestName}>
                        {checkin.guestName}
                      </h4>
                      <p className={Style.roomName}>
                        {checkin.room} • {checkin.guests} khách
                      </p>
                      <div className={Style.checkinDetails}>
                        <div className={Style.checkinDetail}>
                          <Clock className="w-3 h-3" />
                          <span>{checkin.checkIn}</span>
                        </div>
                        <div className={Style.checkinDetail}>
                          <Phone className="w-3 h-3" />
                          <span>{checkin.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {upcomingCheckIns.length === 0 && (
                  <div className={Style.emptyState}>
                    <Clock className={Style.emptyIcon} />
                    <p>Không có khách nhận phòng hôm nay</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className={Style.quickStatsGrid}>
          <div className={Style.quickStatCard}>
            <div className={Style.quickStatContent}>
              <div className={Style.quickStatIcon}>
                <Star className="w-6 h-6" />
              </div>
              <h3 className={Style.quickStatValue}>
                {stats.averageRating}/5
              </h3>
              <p className={Style.quickStatLabel}>
                Đánh giá trung bình
              </p>
              <p className={Style.quickStatSubtext}>
                Từ 127 đánh giá
              </p>
            </div>
          </div>

          <div className={Style.quickStatCard}>
            <div className={Style.quickStatContent}>
              <div className={Style.quickStatIcon}>
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className={Style.quickStatValue}>
                98%
              </h3>
              <p className={Style.quickStatLabel}>
                Tỷ lệ xác nhận
              </p>
              <p className={Style.quickStatSubtext}>
                Booking được xác nhận
              </p>
            </div>
          </div>

          <div className={Style.quickStatCard}>
            <div className={Style.quickStatContent}>
              <div className={Style.quickStatIcon}>
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className={Style.quickStatValue}>
                2%
              </h3>
              <p className={Style.quickStatLabel}>
                Tỷ lệ hủy phòng
              </p>
              <p className={Style.quickStatSubtext}>
                Booking bị hủy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
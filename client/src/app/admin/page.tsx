import React from "react";
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
  RefreshCw
} from "lucide-react";

import Style from "../styles/adminpage.module.css";
import { useApi } from "../../hooks/useApi";
import { donDatPhongApi, phongApi, khachHangApi, usersApi } from "../../lib/api";
import { ApiBooking, ApiRoom, ApiCustomer, ApiUser } from "../../types/api";

const AdminPage = () => {
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

  // Calculate statistics from real data
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.tongTien, 0);
  const totalBookings = bookings.length;
  const totalUsers = users.length;
  const totalCustomers = customers.length;
  const occupiedRooms = rooms.filter(room => room.trangThai === 'occupied').length;
  const availableRooms = rooms.filter(room => room.trangThai === 'available').length;
  const occupancyRate = rooms.length > 0 ? (occupiedRooms / rooms.length) * 100 : 0;

  const stats = {
    totalBookings,
    totalRevenue,
    totalUsers: totalUsers + totalCustomers,
    occupancyRate: Math.round(occupancyRate),
    monthlyGrowth: 12.5,
    averageRating: 4.8
  };

  // Get recent bookings (last 3)
  const recentBookings = bookings.slice(0, 3).map(booking => ({
    id: booking.maDonDatPhong,
    guestName: booking.khachHang?.tenKhachHang || 'N/A',
    room: booking.phong?.moTa || 'N/A',
    checkIn: booking.ngayNhan,
    checkOut: booking.ngayTra,
    total: booking.tongTien,
    status: booking.trangThai
  }));

  // Get upcoming check-ins (today's check-ins)
  const today = new Date().toISOString().split('T')[0];
  const upcomingCheckIns = bookings
    .filter(booking => booking.ngayNhan === today)
    .slice(0, 2)
    .map(booking => ({
      id: booking.maDonDatPhong,
      guestName: booking.khachHang?.tenKhachHang || 'N/A',
      room: booking.phong?.moTa || 'N/A',
      checkIn: `${booking.ngayNhan} 14:00`,
      phone: booking.khachHang?.soDienThoai || 'N/A',
      guests: booking.soLuongKhach
    }));

  // Loading and error states
  const isLoading = bookingsLoading || roomsLoading || customersLoading || usersLoading;
  const hasError = bookingsError || roomsError || customersError || usersError;

  if (isLoading) {
    return (
      <div className={Style.adminpage}>
        <div className={Style.loadingContainer}>
          <RefreshCw className={Style.loadingIcon} />
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
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
      case 'confirmed':
        return <span className={`${Style.badge} ${Style.badgeConfirmed}`}>Đã xác nhận</span>;
      case 'pending':
        return <span className={`${Style.badge} ${Style.badgePending}`}>Chờ xác nhận</span>;
      case 'cancelled':
        return <span className={`${Style.badge} ${Style.badgeCancelled}`}>Đã hủy</span>;
      default:
        return <span className={Style.badge}>{status}</span>;
    }
  };

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
        </div>

        {/* Stats Cards */}
        <div className={Style.statsGrid}>
          <div className={Style.statCard}>
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

          <div className={Style.statCard}>
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconRed}`}>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{occupiedRooms}</div>
                <div className={Style.statLabel}>Đã thuê</div>
              </div>
            </div>
          </div>

          <div className={Style.statCard}>
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconPurple}`}>
                <Bed className="w-5 h-5 text-purple-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>{availableRooms}</div>
                <div className={Style.statLabel}>Có sẵn</div>
              </div>
            </div>
          </div>

          <div className={Style.statCard}>
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
                {recentBookings.map((booking) => (
                  <div key={booking.id} className={Style.bookingItem}>
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
                {upcomingCheckIns.map((checkin) => (
                  <div key={checkin.id} className={Style.checkinItem}>
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
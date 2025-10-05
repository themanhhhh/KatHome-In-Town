import React from "react";
import { 
  Users,
  Calendar,
  Bed,
  Clock,
  Star,
  Phone,
  CheckCircle,
  XCircle
} from "lucide-react";

import Style from "../styles/adminpage.module.css";

const AdminPage = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = {
    totalBookings: 156,
    totalRevenue: 485200000,
    totalUsers: 89,
    occupancyRate: 78,
    monthlyGrowth: 12.5,
    averageRating: 4.8
  };

  const recentBookings = [
    {
      id: "BK1735123456",
      guestName: "Nguyễn Văn A",
      room: "Phòng Deluxe với Ban công",
      checkIn: "2024-12-28",
      checkOut: "2024-12-30",
      total: 2400000,
      status: "confirmed"
    },
    {
      id: "BK1735123457",
      guestName: "Trần Thị B",
      room: "Phòng Superior",
      checkIn: "2024-12-29",
      checkOut: "2024-12-31",
      total: 1800000,
      status: "pending"
    },
    {
      id: "BK1735123458",
      guestName: "Lê Văn C",
      room: "Phòng Standard",
      checkIn: "2024-12-30",
      checkOut: "2025-01-02",
      total: 2100000,
      status: "confirmed"
    }
  ];

  const upcomingCheckIns = [
    {
      id: 1,
      guestName: "Phạm Thị D",
      room: "Phòng Deluxe",
      checkIn: "2024-12-28 14:00",
      phone: "0987654321",
      guests: 2
    },
    {
      id: 2,
      guestName: "Hoàng Văn E",
      room: "Phòng Superior",
      checkIn: "2024-12-28 16:30",
      phone: "0976543210",
      guests: 4
    }
  ];

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
                <div className={Style.statNumber}>15</div>
                <div className={Style.statLabel}>Check In</div>
              </div>
            </div>
          </div>

          <div className={Style.statCard}>
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconRed}`}>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>7</div>
                <div className={Style.statLabel}>Check Out</div>
              </div>
            </div>
          </div>

          <div className={Style.statCard}>
            <div className={Style.statCardContent}>
              <div className={`${Style.statIcon} ${Style.statIconPurple}`}>
                <Bed className="w-5 h-5 text-purple-600" />
              </div>
              <div style={{ flex: 1 }}>
                <div className={Style.statNumber}>5</div>
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
                <div className={Style.statNumber}>23</div>
                <div className={Style.statLabel}>Đã đặt</div>
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
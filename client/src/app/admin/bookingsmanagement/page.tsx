"use client";

import React, { useState } from "react";
import { 
  Search,
  Filter,
  Calendar,
  Users,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import Style from "../../styles/bookingsmanagement.module.css";

interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentMethod: string;
  bookingDate: string;
  specialRequests?: string;
}

const BookingsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [bookings] = useState<Booking[]>([
    {
      id: "BK1735123456",
      guestName: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0987654321",
      room: "Phòng Deluxe với Ban công",
      checkIn: "2024-12-28",
      checkOut: "2024-12-30",
      guests: 2,
      total: 2400000,
      status: "confirmed",
      paymentMethod: "Thẻ tín dụng",
      bookingDate: "2024-12-20",
      specialRequests: "Tầng cao, view đẹp"
    },
    {
      id: "BK1735123457",
      guestName: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0976543210",
      room: "Phòng Superior",
      checkIn: "2024-12-29",
      checkOut: "2024-12-31",
      guests: 4,
      total: 1800000,
      status: "pending",
      paymentMethod: "Chuyển khoản",
      bookingDate: "2024-12-21"
    },
    {
      id: "BK1735123458",
      guestName: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0965432109",
      room: "Phòng Standard",
      checkIn: "2024-12-30",
      checkOut: "2025-01-02",
      guests: 2,
      total: 2100000,
      status: "confirmed",
      paymentMethod: "Thanh toán tại chỗ",
      bookingDate: "2024-12-22"
    },
    {
      id: "BK1735123459",
      guestName: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0954321098",
      room: "Phòng Deluxe",
      checkIn: "2024-12-25",
      checkOut: "2024-12-27",
      guests: 3,
      total: 1600000,
      status: "completed",
      paymentMethod: "Thẻ tín dụng",
      bookingDate: "2024-12-15",
      specialRequests: "Giường đôi"
    },
    {
      id: "BK1735123460",
      guestName: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0943210987",
      room: "Phòng Superior",
      checkIn: "2024-12-26",
      checkOut: "2024-12-28",
      guests: 2,
      total: 1200000,
      status: "cancelled",
      paymentMethod: "Chuyển khoản",
      bookingDate: "2024-12-18"
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Đã xác nhận', className: Style.badgeConfirmed },
      pending: { label: 'Chờ xác nhận', className: Style.badgePending },
      cancelled: { label: 'Đã hủy', className: Style.badgeCancelled },
      completed: { label: 'Hoàn thành', className: Style.badgeCompleted }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: Style.badge };
    
    return (
      <span className={`${Style.badge} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className={`${Style.statusIcon} text-green-500`} />;
      case 'pending':
        return <Clock className={`${Style.statusIcon} text-yellow-500`} />;
      case 'cancelled':
        return <XCircle className={`${Style.statusIcon} text-red-500`} />;
      case 'completed':
        return <CheckCircle className={`${Style.statusIcon} text-blue-500`} />;
      default:
        return <Clock className={`${Style.statusIcon} text-gray-500`} />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  return (
    <div className={Style.bookingsManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div>
            <h1 className={Style.headerTitle}>
              Quản lý đặt phòng
            </h1>
            <p className={Style.headerDescription}>
              Quản lý tất cả booking của khách hàng
            </p>
          </div>
          
          <div className={Style.headerActions}>
            <button className={Style.exportButton}>
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={Style.filtersCard}>
        <div className={Style.filtersContent}>
          <div className={Style.filtersRow}>
            <div className={Style.searchContainer}>
              <Search className={Style.searchIcon} />
              <input
                type="text"
                placeholder="Tìm theo tên khách, mã booking, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={Style.searchInput}
              />
            </div>
            
            <div className={Style.filterControls}>
              <div className={Style.filterGroup}>
                <Filter className={Style.filterIcon} />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={Style.selectTrigger}
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={Style.statsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {bookings.length}
            </div>
            <div className={Style.statLabel}>
              Tổng booking
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className={Style.statLabel}>
              Chờ xác nhận
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className={Style.statLabel}>
              Đã xác nhận
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(bookings.reduce((sum, b) => sum + b.total, 0))}
            </div>
            <div className={Style.statLabel}>
              Tổng doanh thu
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className={Style.tableCard}>
        <div className={Style.tableHeader}>
          <div className={Style.tableHeaderContent}>
            <h3 className={Style.tableTitle}>
              Danh sách đặt phòng ({filteredBookings.length})
            </h3>
            {selectedBookings.length > 0 && (
              <div className={Style.bulkActions}>
                <span className={Style.bulkText}>
                  Đã chọn {selectedBookings.length} booking
                </span>
                <button className={Style.bulkButton}>
                  Xác nhận hàng loạt
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={Style.tableContent}>
          <div className={Style.tableContainer}>
            <table className={Style.table}>
              <thead className={Style.tableHead}>
                <tr>
                  <th className={Style.tableHeadCell}>
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === filteredBookings.length}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Booking</th>
                  <th className={Style.tableHeadCell}>Khách hàng</th>
                  <th className={Style.tableHeadCell}>Phòng</th>
                  <th className={Style.tableHeadCell}>Ngày</th>
                  <th className={Style.tableHeadCell}>Tổng tiền</th>
                  <th className={Style.tableHeadCell}>Trạng thái</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => handleSelectBooking(booking.id)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.bookingId}>
                          {booking.id}
                        </div>
                        <div className={Style.bookingDate}>
                          {formatDate(booking.bookingDate)}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.guestName}>
                          {booking.guestName}
                        </div>
                        <div className={Style.contactInfo}>
                          <Mail className={Style.contactIcon} />
                          <span>{booking.email}</span>
                        </div>
                        <div className={Style.contactInfo}>
                          <Phone className={Style.contactIcon} />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.roomName}>
                          {booking.room}
                        </div>
                        <div className={Style.guestCount}>
                          <Users className={Style.contactIcon} />
                          <span>{booking.guests} khách</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.dateInfo}>
                        <div>Nhận: {formatDate(booking.checkIn)}</div>
                        <div>Trả: {formatDate(booking.checkOut)}</div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.totalAmount}>
                        {formatPrice(booking.total)}
                      </div>
                      <div className={Style.paymentMethod}>
                        {booking.paymentMethod}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statusContainer}>
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.actions}>
                        <button className={Style.actionButton}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className={Style.actionButton}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={`${Style.actionButton} ${Style.actionButtonDanger}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBookings.length === 0 && (
              <div className={Style.emptyState}>
                <Calendar className={Style.emptyIcon} />
                <p>Không tìm thấy booking nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagementPage;
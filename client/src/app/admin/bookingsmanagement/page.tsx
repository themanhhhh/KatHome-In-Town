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
  Clock,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import Style from "../../styles/bookingsmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { donDatPhongApi } from "../../../lib/api";
import { ApiBooking } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { BookingForm } from "../../components/booking-form";

// Using ApiBooking type from types/api.ts

const BookingsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<ApiBooking | null>(null);

  // Fetch data from API
  const { data: bookings = [], loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useApi<ApiBooking[]>(
    () => donDatPhongApi.getAll(),
    []
  );


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

  const handleCreateBooking = () => {
    setEditingBooking(null);
    setShowBookingForm(true);
  };

  const handleEditBooking = (booking: ApiBooking) => {
    setEditingBooking(booking);
    setShowBookingForm(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đặt phòng này?')) {
      try {
        await donDatPhongApi.delete(bookingId);
        await refetchBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Có lỗi xảy ra khi xóa đặt phòng');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBookings.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedBookings.length} đặt phòng đã chọn?`)) {
      try {
        await Promise.all(selectedBookings.map(id => donDatPhongApi.delete(id)));
        await refetchBookings();
        setSelectedBookings([]);
      } catch (error) {
        console.error('Error deleting bookings:', error);
        alert('Có lỗi xảy ra khi xóa đặt phòng');
      }
    }
  };

  const handleFormSuccess = () => {
    refetchBookings();
    setShowBookingForm(false);
    setEditingBooking(null);
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

  const filteredBookings = (bookings || []).filter(booking => {
    const guestName = booking.khachHang?.tenKhachHang || '';
    const email = booking.khachHang?.email || '';
    const bookingId = booking.maDonDatPhong || '';
    
    const matchesSearch = guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.trangThai === statusFilter;
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
      setSelectedBookings(filteredBookings.map(booking => booking.maDonDatPhong));
    }
  };

  // Loading and error states
  if (bookingsLoading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (bookingsError) {
    return (
      <div className={Style.bookingsManagement}>
        <div className={Style.errorContainer}>
          <AlertCircle className={Style.errorIcon} />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{bookingsError}</p>
          <button onClick={refetchBookings} className={Style.retryButton}>
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
            <button className={Style.addButton} onClick={handleCreateBooking}>
              <Calendar className="w-4 h-4" />
              <span>Thêm đặt phòng</span>
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
              {(bookings || []).length}
            </div>
            <div className={Style.statLabel}>
              Tổng booking
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(bookings || []).filter(b => b.trangThai === 'pending').length}
            </div>
            <div className={Style.statLabel}>
              Chờ xác nhận
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(bookings || []).filter(b => b.trangThai === 'confirmed').length}
            </div>
            <div className={Style.statLabel}>
              Đã xác nhận
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice((bookings || []).reduce((sum, b) => sum + b.tongTien, 0))}
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
                <button 
                  className={`${Style.bulkButton} ${Style.bulkButtonDanger}`}
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa đã chọn
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
                {filteredBookings.map((booking, index) => (
                  <tr key={booking.maDonDatPhong || `booking-${index}`} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.maDonDatPhong)}
                        onChange={() => handleSelectBooking(booking.maDonDatPhong)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.bookingId}>
                          {booking.maDonDatPhong}
                        </div>
                        <div className={Style.bookingDate}>
                          {formatDate(booking.ngayDat)}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.guestName}>
                          {booking.khachHang?.tenKhachHang || 'N/A'}
                        </div>
                        <div className={Style.contactInfo}>
                          <Mail className={Style.contactIcon} />
                          <span>{booking.khachHang?.email || 'N/A'}</span>
                        </div>
                        <div className={Style.contactInfo}>
                          <Phone className={Style.contactIcon} />
                          <span>{booking.khachHang?.soDienThoai || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.roomName}>
                          {booking.phong?.moTa || 'N/A'}
                        </div>
                        <div className={Style.guestCount}>
                          <Users className={Style.contactIcon} />
                          <span>{booking.soLuongKhach || 0} khách</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.dateInfo}>
                        <div>Nhận: {formatDate(booking.ngayNhan)}</div>
                        <div>Trả: {formatDate(booking.ngayTra)}</div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.totalAmount}>
                        {formatPrice(booking.tongTien)}
                      </div>
                      <div className={Style.paymentMethod}>
                        {booking.phuongThucThanhToan || 'N/A'}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statusContainer}>
                        {getStatusIcon(booking.trangThai)}
                        {getStatusBadge(booking.trangThai)}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.actions}>
                        <button className={Style.actionButton}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className={Style.actionButton}
                          onClick={() => handleEditBooking(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`${Style.actionButton} ${Style.actionButtonDanger}`}
                          onClick={() => handleDeleteBooking(booking.maDonDatPhong)}
                        >
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

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          booking={editingBooking}
          onClose={() => {
            setShowBookingForm(false);
            setEditingBooking(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default BookingsManagementPage;
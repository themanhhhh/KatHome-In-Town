"use client";

import React, { useState } from "react";
import * as XLSX from 'xlsx';
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
import { donDatPhongApi, revenueApi, RevenueSummaryResponse } from "../../../lib/api";
import { ApiBooking } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { BookingForm } from "../../components/booking-form";
import { BookingDetail } from "../../components/booking-detail";
import { toast } from "sonner";

// Using ApiBooking type from types/api.ts

const BookingsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState<ApiBooking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<ApiBooking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  const { data: bookings = [], loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useApi<ApiBooking[]>(
    () => donDatPhongApi.getAll(),
    []
  );

  // Try to fetch revenue summary from backend (preferred)
  const { data: revenueSummary } = useApi<RevenueSummaryResponse>(
    () => revenueApi.getSummary(),
    []
  );


  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '0đ';
    }
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      R: { label: 'Chờ xác nhận', className: Style.badgePending },
      CF: { label: 'Đã xác nhận', className: Style.badgeConfirmed },
      PA: { label: 'Đã thanh toán', className: Style.badgePaid || Style.badgeConfirmed },
      CC: { label: 'Hoàn thành', className: Style.badgeCompleted },
      AB: { label: 'Đã hủy', className: Style.badgeCancelled }
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

  const handleViewBooking = (booking: ApiBooking) => {
    setViewingBooking(booking);
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
      case 'CF': // Confirmed
        return <CheckCircle className={`${Style.statusIcon} text-green-500`} />;
      case 'R': // Reserved/Pending
        return <Clock className={`${Style.statusIcon} text-yellow-500`} />;
      case 'AB': // Aborted/Cancelled
        return <XCircle className={`${Style.statusIcon} text-red-500`} />;
      case 'CC': // Checked-out/Completed
        return <CheckCircle className={`${Style.statusIcon} text-blue-500`} />;
      default:
        return <Clock className={`${Style.statusIcon} text-gray-500`} />;
    }
  };

  const filteredBookings = (bookings || []).filter(booking => {
    const guestName = booking.khachHang?.tenKhachHang || booking.customerName || '';
    const email = booking.khachHang?.email || booking.customerEmail || '';
    const bookingId = booking.maDatPhong || '';
    
    const matchesSearch = guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.trangThai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (paginatedBookings.length > 0 && paginatedBookings.every(booking => selectedBookings.includes(booking.maDatPhong))) {
      setSelectedBookings(prev => prev.filter(id => !paginatedBookings.map(b => b.maDatPhong).includes(id)));
    } else {
      setSelectedBookings(prev => [...new Set([...prev, ...paginatedBookings.map(booking => booking.maDatPhong)])]);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredBookings.map(booking => {
        // Get room info from first chiTiet
        const firstChiTiet = booking.chiTiet?.[0];
        const roomName = (firstChiTiet?.phong && 'tenPhong' in firstChiTiet.phong) 
          ? (firstChiTiet.phong as { tenPhong: string }).tenPhong 
          : (firstChiTiet?.phong?.moTa || 'N/A');
        
        // Get total guests
        const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => 
          sum + (ct.soNguoiLon || 0) + (ct.soTreEm || 0), 0
        );

        // Get status label
        const getStatusLabel = (status: string) => {
          switch (status) {
            case 'CF': return 'Đã xác nhận';
            case 'R': return 'Chờ xác nhận';
            case 'AB': return 'Đã hủy';
            case 'CC': return 'Hoàn thành';
            default: return status;
          }
        };

        return {
          'Mã booking': booking.maDatPhong,
          'Khách hàng': booking.khachHang?.tenKhachHang || booking.customerName || 'N/A',
          'Email': booking.khachHang?.email || booking.customerEmail || 'N/A',
          'Số điện thoại': booking.khachHang?.soDienThoai || booking.customerPhone || 'N/A',
          'Phòng': roomName,
          'Cơ sở': booking.coSo?.tenCoSo || 'N/A',
          'Ngày đặt': booking.ngayDat ? formatDate(booking.ngayDat) : 'N/A',
          'Check-in': booking.checkinDuKien ? formatDate(booking.checkinDuKien) : 'N/A',
          'Check-out': booking.checkoutDuKien ? formatDate(booking.checkoutDuKien) : 'N/A',
          'Số khách': totalGuests,
          'Tổng tiền': booking.totalAmount ? formatPrice(booking.totalAmount) : '0đ',
          'Trạng thái': getStatusLabel(booking.trangThai || ''),
          'Phương thức thanh toán': booking.phuongThucThanhToan || 'N/A',
          'Ghi chú': booking.notes || ''
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đặt phòng');

      const filename = `DanhSachDatPhong_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success('Xuất Excel thành công!', {
        description: `File ${filename} đã được tải xuống.`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi xuất Excel', {
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        duration: 5000,
      });
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
            <button className={Style.exportButton} onClick={handleExportExcel}>
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
                  <option value="R">Chờ xác nhận</option>
                  <option value="CF">Đã xác nhận</option>
                  <option value="CC">Hoàn thành</option>
                  <option value="AB">Đã hủy</option>
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
              {(bookings || []).filter(b => b.trangThai === 'AB').length}
            </div>
            <div className={Style.statLabel}>
              Đã hủy
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(bookings || []).filter(b => b.trangThai === 'CC').length}
            </div>
            <div className={Style.statLabel}>
              Hoàn thành
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(() => {
                // Prefer server-side revenue summary if available
                const serverTotal = revenueSummary?.data?.totalRevenue;
                if (typeof serverTotal === 'number') {
                  return formatPrice(serverTotal);
                }

                // Fallback: sum bookings that have been paid (paymentStatus === 'paid')
                const fallbackTotal = (bookings || []).reduce((sum, b) => {
                  const paid = b.paymentStatus === 'paid' || b.totalPaid != null;
                  const amount = b.totalPaid ?? b.totalAmount ?? 0;
                  if (paid && !isNaN(Number(amount)) && Number(amount) > 0) {
                    return sum + Number(amount);
                  }
                  return sum;
                }, 0);

                // Last-resort: keep previous behavior (CC) if nothing else
                if (fallbackTotal === 0) {
                  const ccTotal = (bookings || []).reduce((sum, b) => {
                    if (b.trangThai === 'CC') {
                      const amount = b.totalAmount ?? 0;
                      if (!isNaN(Number(amount))) return sum + Number(amount);
                    }
                    return sum;
                  }, 0);
                  return formatPrice(ccTotal);
                }

                return formatPrice(fallbackTotal);
              })()}
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
                      checked={paginatedBookings.length > 0 && paginatedBookings.every(booking => selectedBookings.includes(booking.maDatPhong))}
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
                {paginatedBookings.map((booking, index) => {
                  // Get total guests from chiTiet
                  const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => 
                    sum + (ct.soNguoiLon || 0) + (ct.soTreEm || 0), 0
                  );
                  // Get room info from first chiTiet
                  const firstRoom = booking.chiTiet?.[0];
                  
                  return (
                    <tr key={booking.maDatPhong || `booking-${index}`} className={Style.tableRow}>
                      <td className={Style.tableCell}>
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.maDatPhong)}
                          onChange={() => handleSelectBooking(booking.maDatPhong)}
                          className={Style.checkbox}
                        />
                      </td>
                      <td className={Style.tableCell}>
                        <div>
                          <div className={Style.bookingId}>
                            {booking.maDatPhong}
                          </div>
                          <div className={Style.bookingDate}>
                            {formatDate(booking.ngayDat)}
                          </div>
                        </div>
                      </td>
                      <td className={Style.tableCell}>
                        <div>
                          <div className={Style.guestName}>
                            {booking.khachHang?.tenKhachHang || booking.customerName || 'N/A'}
                          </div>
                          <div className={Style.contactInfo}>
                            <Mail className={Style.contactIcon} />
                            <span>{booking.khachHang?.email || booking.customerEmail || 'N/A'}</span>
                          </div>
                          <div className={Style.contactInfo}>
                            <Phone className={Style.contactIcon} />
                            <span>{booking.khachHang?.soDienThoai || booking.customerPhone || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className={Style.tableCell}>
                        <div>
                          <div className={Style.roomName}>
                            {firstRoom?.phong?.tenPhong || 'N/A'}
                          </div>
                          <div className={Style.guestCount}>
                            <Users className={Style.contactIcon} />
                            <span>{totalGuests || 0} khách</span>
                          </div>
                        </div>
                      </td>
                      <td className={Style.tableCell}>
                        <div className={Style.dateInfo}>
                          <div>Nhận: {formatDate(booking.checkinDuKien)}</div>
                          <div>Trả: {formatDate(booking.checkoutDuKien)}</div>
                        </div>
                      </td>
                      <td className={Style.tableCell}>
                        <div className={Style.totalAmount}>
                          {formatPrice(booking.totalAmount || 0)}
                        </div>
                        <div className={Style.paymentMethod}>
                          {booking.phuongThucThanhToan || booking.paymentMethod || 'N/A'}
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
                          <button 
                            className={Style.actionButton}
                            onClick={() => handleViewBooking(booking)}
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className={Style.actionButton}
                            onClick={() => handleEditBooking(booking)}
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className={`${Style.actionButton} ${Style.actionButtonDanger}`}
                            onClick={() => handleDeleteBooking(booking.maDatPhong)}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <div className={Style.pagination}>
            <div className={Style.paginationInfo}>
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} trong tổng số {filteredBookings.length} booking
            </div>
            <div className={Style.paginationControls}>
              <button
                className={Style.paginationButton}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </button>
              
              <div className={Style.paginationNumbers}>
                {getPageNumbers().map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className={Style.paginationEllipsis}>
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      className={`${Style.paginationNumber} ${currentPage === page ? Style.paginationNumberActive : ''}`}
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                className={Style.paginationButton}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
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

      {/* Booking Detail Modal */}
      {viewingBooking && (
        <BookingDetail
          booking={viewingBooking}
          onClose={() => setViewingBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingsManagementPage;
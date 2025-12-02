"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as XLSX from 'xlsx';
import { 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Star,
  DollarSign,
  Calendar,
  Home,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import Style from "../../styles/roomsmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { phongApi, coSoApi, donDatPhongApi, danhGiaApi, ReviewStatsResponse } from "../../../lib/api";
import { ApiRoom, ApiBooking } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { RoomForm } from "../../components/room-form";
import { RoomDetail } from "../../components/room-detail";
import { toast } from "sonner";

// Using ApiRoom type from types/api.ts

const RoomsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ApiRoom | null>(null);
  const [viewingRoom, setViewingRoom] = useState<ApiRoom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [roomReviewStats, setRoomReviewStats] = useState<Record<string, ReviewStatsResponse>>({});

  // Fetch data from API
  const { data: rooms = [], loading: roomsLoading, error: roomsError, refetch: refetchRooms } = useApi<ApiRoom[]>(
    () => phongApi.getAll(),
    []
  );

  const { data: coSoList = [] } = useApi<Array<{
    maCoSo: string;
    tenCoSo: string;
    diaChi: string;
    sdt: string;
    hinhAnh?: string;
  }>>(
    () => coSoApi.getAll(),
    []
  );

  // Fetch bookings to calculate revenue
  const { data: bookings = [] } = useApi<ApiBooking[]>(
    () => donDatPhongApi.getAll(),
    []
  );


  // Filter functions
  const filteredRooms = (rooms || []).filter(room => {
    const matchesSearch = room.moTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.tenPhong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.coSo?.tenCoSo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || room.tenPhong === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Load review stats for each room
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const statsEntries = await Promise.all(
          (rooms || []).map(async (room) => {
            if (!room.maPhong) return null;
            try {
              const stats = await danhGiaApi.getStats(room.maPhong);
              return [room.maPhong, stats] as [string, ReviewStatsResponse];
            } catch (error) {
              console.error("Error fetching review stats for room", room.maPhong, error);
              return null;
            }
          })
        );

        const statsMap: Record<string, ReviewStatsResponse> = {};
        for (const entry of statsEntries) {
          if (entry) {
            const [roomId, stats] = entry;
            statsMap[roomId] = stats;
          }
        }
        setRoomReviewStats(statsMap);
      } catch (error) {
        console.error("Error loading room review stats:", error);
      }
    };

    if ((rooms || []).length > 0) {
      loadStats();
    }
  }, [rooms]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị (không kể ellipsis)
    
    if (totalPages <= maxPagesToShow + 2) {
      // Nếu tổng số trang ít, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang 1
      pages.push(1);
      
      if (currentPage <= 3) {
        // Nếu ở đầu: 1 2 3 4 ... 15
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Nếu ở cuối: 1 ... 12 13 14 15
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Nếu ở giữa: 1 ... 6 7 8 ... 15
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
  }, [searchTerm, typeFilter, statusFilter]);

  // Selection functions
  const handleSelectAll = () => {
    if (selectedRooms.length === filteredRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(filteredRooms.map(room => room.maPhong));
    }
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setShowRoomForm(true);
  };

  const handleViewRoom = (room: ApiRoom) => {
    setViewingRoom(room);
  };

  const handleEditRoom = (room: ApiRoom) => {
    setEditingRoom(room);
    setShowRoomForm(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      const deleteToast = toast.loading('Đang xóa phòng...', {
        description: `Đang xóa phòng #${roomId}`,
      });
      
      try {
        await phongApi.delete(roomId);
        await refetchRooms();
        toast.success('Xóa phòng thành công!', {
          id: deleteToast,
          description: `Phòng #${roomId} đã được xóa khỏi hệ thống.`,
          duration: 4000,
        });
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Lỗi xóa phòng', {
          id: deleteToast,
          description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phòng',
          duration: 5000,
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRooms.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRooms.length} phòng đã chọn?`)) {
      const deleteToast = toast.loading(`Đang xóa ${selectedRooms.length} phòng...`);
      try {
        await Promise.all(selectedRooms.map(id => phongApi.delete(id)));
        await refetchRooms();
        setSelectedRooms([]);
        toast.success('Xóa phòng thành công!', {
          id: deleteToast,
          description: `Đã xóa ${selectedRooms.length} phòng khỏi hệ thống.`,
          duration: 4000,
        });
      } catch (error) {
        console.error('Error deleting rooms:', error);
        toast.error('Lỗi xóa phòng', {
          id: deleteToast,
          description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phòng',
          duration: 5000,
        });
      }
    }
  };

  const handleFormSuccess = (isEdit: boolean) => {
    refetchRooms();
    setShowRoomForm(false);
    setEditingRoom(null);
    
    if (isEdit) {
      toast.success('Cập nhật phòng thành công!', {
        description: 'Thông tin phòng đã được cập nhật.',
        duration: 4000,
      });
    } else {
      toast.success('Thêm phòng mới thành công!', {
        description: 'Phòng mới đã được thêm vào hệ thống.',
        duration: 4000,
      });
    }
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get room price directly from room
  const getRoomPrice = (room: ApiRoom) => {
    return room.donGiaQuaDem || room.donGia4h || null;
  };
  
  // Get unique room types from rooms
  const uniqueRoomTypes = React.useMemo(() => {
    const types = new Set((rooms || []).map(r => r.tenPhong).filter(Boolean));
    return Array.from(types).sort();
  }, [rooms]);

  // Calculate statistics from real data
  const totalRooms = (rooms || []).length;
  const roomsWithCoSo = (rooms || []).filter(r => r.coSo?.tenCoSo).length;
  const uniqueRoomTypesCount = uniqueRoomTypes.length;
  
  // Calculate total revenue from bookings
  // Chỉ tính doanh thu từ các booking đã hoàn thành (CC - Checked-out/Completed)
  const totalRevenue = React.useMemo(() => {
    const revenue = (bookings || []).reduce((sum, booking) => {
      // Chỉ tính với booking có trạng thái hoàn thành
      if (booking.trangThai === 'CC') {
        const amount = booking.totalAmount;
        // Handle null, undefined, NaN, and ensure it's a valid number
        if (amount == null || isNaN(Number(amount))) {
          return sum;
        }
        return sum + Number(amount);
      }
      return sum;
    }, 0);
    // Ensure we return a valid number (not NaN)
    return isNaN(revenue) ? 0 : revenue;
  }, [bookings]);

  // Get booking count & revenue per room from bookings data
  const getRoomBookingStats = (roomId: string) => {
    const relatedBookings = (bookings || []).filter((booking) =>
      (booking.chiTiet || []).some((ct) => ct.phong?.maPhong === roomId)
    );

    const bookingCount = relatedBookings.length;
    // Chỉ tính doanh thu từ các booking đã hoàn thành (CC - Checked-out/Completed)
    const revenue = relatedBookings.reduce((sum, booking) => {
      // Chỉ tính với booking có trạng thái hoàn thành
      if (booking.trangThai === 'CC') {
        const amount = booking.totalAmount;
        // Handle null, undefined, NaN, and ensure it's a valid number
        if (amount == null || isNaN(Number(amount))) {
          return sum;
        }
        return sum + Number(amount);
      }
      return sum;
    }, 0);

    // Ensure we return a valid number (not NaN)
    return { bookingCount, revenue: isNaN(revenue) ? 0 : revenue };
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredRooms.map(room => {
        const getStatusLabel = (status: string | undefined) => {
          switch (status) {
            case 'available': return 'Có sẵn';
            case 'maintenance': return 'Bảo trì';
            case 'blocked': return 'Đã chặn';
            case 'booked': return 'Đã đặt';
            default: return 'Có sẵn';
          }
        };

        return {
          'Mã phòng': room.maPhong,
          'Hạng phòng': room.tenPhong || 'N/A',
          'Mô tả': room.moTa || 'Chưa có mô tả',
          'Cơ sở': room.coSo?.tenCoSo || 'N/A',
          'Sức chứa': room.sucChua || 0,
          'Giá qua đêm': room.donGiaQuaDem ? formatPrice(room.donGiaQuaDem) : 'N/A',
          'Giá 4 giờ': room.donGia4h ? formatPrice(room.donGia4h) : 'N/A',
          'Trạng thái': getStatusLabel(room.status),
          'Hình ảnh': room.hinhAnh || 'N/A'
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách phòng');

      const filename = `DanhSachPhong_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  if (roomsLoading) {
    return <LoadingSpinner text="Đang tải ..." />;
  }

  if (roomsError) {
    return (
      <div className={Style.roomsManagement}>
        <div className={Style.errorContainer}>
          <AlertCircle className={Style.errorIcon} />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{roomsError}</p>
          <button onClick={refetchRooms} className={Style.retryButton}>
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={Style.roomsManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Quản lý phòng</h1>
            <p>Quản lý thông tin và trạng thái các phòng tại KatHome In Town</p>
          </div>
          <div className={Style.headerActions}>
            <button className={Style.exportButton} onClick={handleExportExcel}>
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
            <button className={Style.addButton} onClick={handleCreateRoom}>
              <Plus className="w-4 h-4" />
              <span>Thêm phòng</span>
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
                placeholder="Tìm theo tên phòng, loại phòng..."
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
                  <option value="available">Có sẵn</option>
                  <option value="occupied">Đã thuê</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="cleaning">Dọn dẹp</option>
                </select>
              </div>
              
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`${Style.selectTrigger} ${Style.selectTriggerSmall}`}
              >
                <option value="all">Tất cả</option>
                {uniqueRoomTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={Style.statsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {totalRooms}
            </div>
            <div className={Style.statLabel}>
              Tổng phòng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {roomsWithCoSo}
            </div>
            <div className={Style.statLabel}>
              Có cơ sở
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(totalRevenue)}
            </div>
            <div className={Style.statLabel}>
              Tổng doanh thu
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className={Style.tableCard}>
        <div className={Style.tableHeader}>
          <div className={Style.tableHeaderContent}>
            <h3 className={Style.tableTitle}>
              Danh sách phòng ({filteredRooms.length})
            </h3>
            {selectedRooms.length > 0 && (
              <div className={Style.bulkActions}>
                <span className={Style.bulkText}>
                  Đã chọn {selectedRooms.length} phòng
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
                      checked={paginatedRooms.length > 0 && paginatedRooms.every(room => selectedRooms.includes(room.maPhong))}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Phòng</th>
                  <th className={Style.tableHeadCell}>Hình ảnh</th>
                  <th className={Style.tableHeadCell}>Giá</th>
                  <th className={Style.tableHeadCell}>Mô tả</th>
                  <th className={Style.tableHeadCell}>Đánh giá</th>
                  <th className={Style.tableHeadCell}>Thống kê</th>
                  <th className={Style.tableHeadCell}>Trạng thái</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRooms.map((room, index) => (
                  <tr key={room.maPhong || `room-${index}`} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.maPhong)}
                        onChange={() => handleSelectRoom(room.maPhong)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.roomName}>
                          {room.tenPhong || room.moTa || 'Chưa có tên'}
                        </div>
                        <div className={Style.roomId}>
                          ID: {room.maPhong}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className="w-20 h-20">
                        <Image src={room.hinhAnh || ''} alt="Room Image" width={80} height={80} />
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.priceInfo}>
                        <div className={Style.currentPrice}>
                          {(() => {
                            const price = getRoomPrice(room);
                            return price ? formatPrice(price) + '/đêm' : 'Chưa có giá';
                          })()}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.descriptionInfo}>
                        <span className={Style.descriptionText}>
                          {room.moTa || 'Chưa có mô tả'}
                        </span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.ratingInfo}>
                        {(() => {
                          const stats = roomReviewStats[room.maPhong];
                          const average =
                            stats && stats.totalReviews > 0
                              ? Number(stats.averageRating)
                              : null;
                          const totalReviews = stats?.totalReviews ?? 0;
                          return (
                            <>
                              <div className={Style.ratingValue}>
                                <Star className={Style.starIcon} />
                                <span className={Style.ratingNumber}>
                                  {average !== null ? average.toFixed(1) : "--"}
                                </span>
                              </div>
                              <div className={Style.reviewCount}>
                                {totalReviews} đánh giá
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statsInfo}>
                        {(() => {
                          const { bookingCount, revenue } = getRoomBookingStats(
                            room.maPhong
                          );
                          return (
                            <>
                              <div className={Style.statItem}>
                                <Calendar className={Style.statIcon} />
                                <span className={Style.statText}>
                                  {bookingCount} booking
                                </span>
                              </div>
                              <div className={Style.statItem}>
                                <DollarSign className={Style.statIcon} />
                                <span className={Style.statText}>
                                  {formatPrice(revenue)}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statusInfo}>
                        {room.status === 'available' && (
                          <span className={`${Style.statusBadge} ${Style.statusAvailable}`}>
                            Có sẵn
                          </span>
                        )}
                        {room.status === 'maintenance' && (
                          <span className={`${Style.statusBadge} ${Style.statusMaintenance}`}>
                            Bảo trì
                          </span>
                        )}
                        {room.status === 'blocked' && (
                          <span className={`${Style.statusBadge} ${Style.statusBlocked}`}>
                            Đã chặn
                          </span>
                        )}
                        {room.status === 'booked' && (
                          <span className={`${Style.statusBadge} ${Style.statusBooked}`}>
                            Đã đặt
                          </span>
                        )}
                        {!room.status && (
                          <span className={`${Style.statusBadge} ${Style.statusAvailable}`}>
                            Có sẵn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.actions}>
                        <button 
                          className={Style.actionButton}
                          onClick={() => handleViewRoom(room)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className={Style.actionButton}
                          onClick={() => handleEditRoom(room)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`${Style.actionButton} ${Style.actionButtonDanger}`}
                          onClick={() => handleDeleteRoom(room.maPhong)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRooms.length === 0 && (
              <div className={Style.emptyState}>
                <Home className={Style.emptyIcon} />
                <p>Không tìm thấy phòng nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredRooms.length > 0 && (
          <div className={Style.pagination}>
            <div className={Style.paginationInfo}>
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredRooms.length)} trong tổng số {filteredRooms.length} phòng
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

      {/* Room Form Modal */}
      {showRoomForm && (
        <RoomForm
          room={editingRoom}
          coSoList={coSoList || []}
          onClose={() => {
            setShowRoomForm(false);
            setEditingRoom(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Room Detail Modal */}
      {viewingRoom && (
        <RoomDetail
          room={viewingRoom}
          onClose={() => setViewingRoom(null)}
        />
      )}
    </div>
  );
};

export default RoomsManagementPage;
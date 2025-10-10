"use client";

import React, { useState } from "react";
import { 
  Search,
  Filter,
  Bed,
  Users,
  Bath,
  Maximize2,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Star,
  DollarSign,
  Calendar,
  Wifi,
  Wind,
  Tv,
  Home,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import Style from "../../styles/roomsmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { phongApi, hangPhongApi } from "../../../lib/api";
import { ApiRoom, ApiRoomType } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { ImageUpload } from "../../components/image-upload";
import { RoomForm } from "../../components/room-form";

// Using ApiRoom type from types/api.ts

const RoomsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ApiRoom | null>(null);

  // Fetch data from API
  const { data: rooms = [], loading: roomsLoading, error: roomsError, refetch: refetchRooms } = useApi<ApiRoom[]>(
    () => phongApi.getAll(),
    []
  );

  const { data: roomTypes = [] } = useApi<ApiRoomType[]>(
    () => hangPhongApi.getAll(),
    []
  );


  // Filter functions
  const filteredRooms = (rooms || []).filter(room => {
    const matchesSearch = room.moTa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.hangPhong?.tenHangPhong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (room.coSo?.tenCoSo || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || room.hangPhong?.tenHangPhong === typeFilter;
    
    return matchesSearch && matchesType;
  });

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

  const handleImageUpload = async (roomId: string, file: File) => {
    setUploadingImages(prev => new Set(prev).add(roomId));
    try {
      await phongApi.uploadImage(roomId, file);
      // Refresh rooms data to get updated image URL
      await refetchRooms();
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setShowRoomForm(true);
  };

  const handleEditRoom = (room: ApiRoom) => {
    setEditingRoom(room);
    setShowRoomForm(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await phongApi.delete(roomId);
        await refetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Có lỗi xảy ra khi xóa phòng');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRooms.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedRooms.length} phòng đã chọn?`)) {
      try {
        await Promise.all(selectedRooms.map(id => phongApi.delete(id)));
        await refetchRooms();
        setSelectedRooms([]);
      } catch (error) {
        console.error('Error deleting rooms:', error);
        alert('Có lỗi xảy ra khi xóa phòng');
      }
    }
  };

  const handleFormSuccess = () => {
    refetchRooms();
    setShowRoomForm(false);
    setEditingRoom(null);
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className={Style.amenityIcon} />;
      case 'điều hòa':
        return <Wind className={Style.amenityIcon} />;
      case 'tivi':
        return <Tv className={Style.amenityIcon} />;
      default:
        return <Star className={Style.amenityIcon} />;
    }
  };

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
            <button className={Style.exportButton}>
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
                {(roomTypes || []).map((type) => (
                  <option key={type.maHangPhong} value={type.tenHangPhong}>
                    {type.tenHangPhong}
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
              {(rooms || []).length}
            </div>
            <div className={Style.statLabel}>
              Tổng phòng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(rooms || []).filter(r => r.hangPhong?.tenHangPhong).length}
            </div>
            <div className={Style.statLabel}>
              Có hạng phòng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(rooms || []).filter(r => r.coSo?.tenCoSo).length}
            </div>
            <div className={Style.statLabel}>
              Có cơ sở
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(0)}
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
                      checked={selectedRooms.length === filteredRooms.length}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Phòng</th>
                  <th className={Style.tableHeadCell}>Hình ảnh</th>
                  <th className={Style.tableHeadCell}>Giá & Loại</th>
                  <th className={Style.tableHeadCell}>Chi tiết</th>
                  <th className={Style.tableHeadCell}>Tiện nghi</th>
                  <th className={Style.tableHeadCell}>Đánh giá</th>
                  <th className={Style.tableHeadCell}>Thống kê</th>
                  <th className={Style.tableHeadCell}>Trạng thái</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room, index) => (
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
                          {room.moTa}
                        </div>
                        <div className={Style.roomId}>
                          ID: {room.maPhong}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className="w-20 h-20">
                        <ImageUpload
                          onImageUpload={(file) => handleImageUpload(room.maPhong, file)}
                          currentImageUrl={room.hinhAnh}
                          entityType="room"
                          entityId={room.maPhong}
                          className="w-full h-full"
                        />
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.priceInfo}>
                        <div className={Style.currentPrice}>
                          Chưa có giá
                        </div>
                        <span className={Style.roomType}>
                          {room.hangPhong?.tenHangPhong || 'Chưa phân loại'}
                        </span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.roomDetails}>
                        <div className={Style.detailItem}>
                          <Users className={Style.detailIcon} />
                          <span>{room.hangPhong?.sucChua || 0} khách</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Bed className={Style.detailIcon} />
                          <span>1 giường</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Bath className={Style.detailIcon} />
                          <span>1 phòng tắm</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Maximize2 className={Style.detailIcon} />
                          <span>25m²</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.amenitiesList}>
                        {['Wifi', 'Điều hòa'].slice(0, 3).map((amenity, index) => (
                          <div key={index} className={Style.amenityItem}>
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.ratingInfo}>
                        <div className={Style.ratingValue}>
                          <Star className={Style.starIcon} />
                          <span className={Style.ratingNumber}>
                            4.5
                          </span>
                        </div>
                        <div className={Style.reviewCount}>
                          0 đánh giá
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statsInfo}>
                        <div className={Style.statItem}>
                          <Calendar className={Style.statIcon} />
                          <span className={Style.statText}>
                            0 booking
                          </span>
                        </div>
                        <div className={Style.statItem}>
                          <DollarSign className={Style.statIcon} />
                          <span className={Style.statText}>
                            {formatPrice(0)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statusInfo}>
                        <span className={Style.statusLabel}>Hạng:</span>
                        <span className={Style.statusValue}>
                          {room.hangPhong?.tenHangPhong || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.actions}>
                        <button className={Style.actionButton}>
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
      </div>

      {/* Room Form Modal */}
      {showRoomForm && (
        <RoomForm
          room={editingRoom}
          roomTypes={roomTypes || []}
          onClose={() => {
            setShowRoomForm(false);
            setEditingRoom(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default RoomsManagementPage;
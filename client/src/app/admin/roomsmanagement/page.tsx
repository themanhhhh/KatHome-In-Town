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
  Home
} from "lucide-react";

import Style from "../../styles/roomsmanagement.module.css";

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  rating: number;
  reviews: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  description: string;
  totalBookings: number;
  revenue: number;
}

const RoomsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [rooms] = useState<Room[]>([
    {
      id: 1,
      name: "Phòng Deluxe với Ban công",
      type: "Deluxe",
      price: 1200000,
      originalPrice: 1500000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 35,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Ban công"],
      rating: 4.8,
      reviews: 124,
      status: "available",
      description: "Phòng sang trọng với ban công riêng và tầm nhìn đẹp",
      totalBookings: 45,
      revenue: 54000000
    },
    {
      id: 2,
      name: "Phòng Superior",
      type: "Superior",
      price: 900000,
      originalPrice: 1100000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 28,
      amenities: ["Wifi", "Điều hòa", "Tivi"],
      rating: 4.5,
      reviews: 89,
      status: "occupied",
      description: "Phòng tiện nghi với không gian thoải mái",
      totalBookings: 38,
      revenue: 34200000
    },
    {
      id: 3,
      name: "Phòng Standard",
      type: "Standard",
      price: 600000,
      originalPrice: 750000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 22,
      amenities: ["Wifi", "Điều hòa"],
      rating: 4.2,
      reviews: 67,
      status: "available",
      description: "Phòng cơ bản với đầy đủ tiện nghi cần thiết",
      totalBookings: 32,
      revenue: 19200000
    },
    {
      id: 4,
      name: "Suite Gia đình",
      type: "Suite",
      price: 2000000,
      originalPrice: 2400000,
      maxGuests: 4,
      beds: 2,
      bathrooms: 2,
      size: 55,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Bếp nhỏ", "Ban công", "Phòng khách"],
      rating: 4.9,
      reviews: 156,
      status: "maintenance",
      description: "Suite rộng rãi dành cho gia đình với đầy đủ tiện nghi",
      totalBookings: 28,
      revenue: 56000000
    },
    {
      id: 5,
      name: "Phòng VIP",
      type: "VIP",
      price: 1800000,
      originalPrice: 2200000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 45,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Ban công", "Minibar", "Jacuzzi"],
      rating: 4.7,
      reviews: 98,
      status: "cleaning",
      description: "Phòng VIP cao cấp với jacuzzi riêng",
      totalBookings: 22,
      revenue: 39600000
    }
  ]);

  // Filter functions
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Selection functions
  const handleSelectAll = () => {
    if (selectedRooms.length === filteredRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(filteredRooms.map(room => room.id));
    }
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className={`${Style.badge} ${Style.badgeAvailable}`}>Có sẵn</span>;
      case 'occupied':
        return <span className={`${Style.badge} ${Style.badgeOccupied}`}>Đã thuê</span>;
      case 'maintenance':
        return <span className={`${Style.badge} ${Style.badgeMaintenance}`}>Bảo trì</span>;
      case 'cleaning':
        return <span className={`${Style.badge} ${Style.badgeCleaning}`}>Dọn dẹp</span>;
      default:
        return <span className={Style.badge}>{status}</span>;
    }
  };

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
            <button className={Style.addButton}>
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
                <option value="Standard">Standard</option>
                <option value="Superior">Superior</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
                <option value="VIP">VIP</option>
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
              {rooms.length}
            </div>
            <div className={Style.statLabel}>
              Tổng phòng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {rooms.filter(r => r.status === 'available').length}
            </div>
            <div className={Style.statLabel}>
              Có sẵn
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {rooms.filter(r => r.status === 'occupied').length}
            </div>
            <div className={Style.statLabel}>
              Đã thuê
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(rooms.reduce((sum, r) => sum + r.revenue, 0))}
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
                <button className={Style.bulkButton}>
                  Thao tác hàng loạt
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
                {filteredRooms.map((room) => (
                  <tr key={room.id} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.id)}
                        onChange={() => handleSelectRoom(room.id)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.roomName}>
                          {room.name}
                        </div>
                        <div className={Style.roomId}>
                          ID: {room.id}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.priceInfo}>
                        <div className={Style.currentPrice}>
                          {formatPrice(room.price)}
                        </div>
                        {room.originalPrice > room.price && (
                          <div className={Style.originalPrice}>
                            {formatPrice(room.originalPrice)}
                          </div>
                        )}
                        <span className={Style.roomType}>
                          {room.type}
                        </span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.roomDetails}>
                        <div className={Style.detailItem}>
                          <Users className={Style.detailIcon} />
                          <span>{room.maxGuests} khách</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Bed className={Style.detailIcon} />
                          <span>{room.beds} giường</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Bath className={Style.detailIcon} />
                          <span>{room.bathrooms} phòng tắm</span>
                        </div>
                        <div className={Style.detailItem}>
                          <Maximize2 className={Style.detailIcon} />
                          <span>{room.size}m²</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.amenitiesList}>
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <div key={index} className={Style.amenityItem}>
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className={Style.amenityMore}>
                            +{room.amenities.length - 3} khác
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.ratingInfo}>
                        <div className={Style.ratingValue}>
                          <Star className={Style.starIcon} />
                          <span className={Style.ratingNumber}>
                            {room.rating}
                          </span>
                        </div>
                        <div className={Style.reviewCount}>
                          {room.reviews} đánh giá
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statsInfo}>
                        <div className={Style.statItem}>
                          <Calendar className={Style.statIcon} />
                          <span className={Style.statText}>
                            {room.totalBookings} booking
                          </span>
                        </div>
                        <div className={Style.statItem}>
                          <DollarSign className={Style.statIcon} />
                          <span className={Style.statText}>
                            {formatPrice(room.revenue)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      {getStatusBadge(room.status)}
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
            
            {filteredRooms.length === 0 && (
              <div className={Style.emptyState}>
                <Home className={Style.emptyIcon} />
                <p>Không tìm thấy phòng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsManagementPage;
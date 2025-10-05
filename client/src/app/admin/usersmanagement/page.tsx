"use client";

import React, { useState } from "react";
import { 
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Download,
  UserPlus,
  Calendar,
  DollarSign,
  Star
} from "lucide-react";

import Style from "../../styles/usersmanagement.module.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  registrationDate: string;
  lastLogin: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'banned';
  averageRating: number;
}

const UsersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [users] = useState<User[]>([
    {
      id: 1,
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyenvana@email.com",
      phone: "0987654321",
      city: "TP. Hồ Chí Minh",
      registrationDate: "2024-01-15",
      lastLogin: "2024-12-25",
      totalBookings: 5,
      totalSpent: 8500000,
      status: "active",
      averageRating: 4.8
    },
    {
      id: 2,
      firstName: "Trần",
      lastName: "Thị B",
      email: "tranthib@email.com",
      phone: "0976543210",
      city: "Hà Nội",
      registrationDate: "2024-02-20",
      lastLogin: "2024-12-20",
      totalBookings: 3,
      totalSpent: 4200000,
      status: "active",
      averageRating: 4.5
    },
    {
      id: 3,
      firstName: "Lê",
      lastName: "Văn C",
      email: "levanc@email.com",
      phone: "0965432109",
      city: "Đà Nẵng",
      registrationDate: "2024-03-10",
      lastLogin: "2024-12-15",
      totalBookings: 2,
      totalSpent: 3100000,
      status: "active",
      averageRating: 4.2
    },
    {
      id: 4,
      firstName: "Phạm",
      lastName: "Thị D",
      email: "phamthid@email.com",
      phone: "0954321098",
      city: "Đà Lạt",
      registrationDate: "2024-04-05",
      lastLogin: "2024-11-30",
      totalBookings: 1,
      totalSpent: 1600000,
      status: "inactive",
      averageRating: 4.0
    },
    {
      id: 5,
      firstName: "Hoàng",
      lastName: "Văn E",
      email: "hoangvane@email.com",
      phone: "0943210987",
      city: "Nha Trang",
      registrationDate: "2024-05-12",
      lastLogin: "2024-10-15",
      totalBookings: 0,
      totalSpent: 0,
      status: "inactive",
      averageRating: 0
    },
    {
      id: 6,
      firstName: "Vũ",
      lastName: "Thị F",
      email: "vuthif@email.com",
      phone: "0932109876",
      city: "Hội An",
      registrationDate: "2024-06-18",
      lastLogin: "2024-09-20",
      totalBookings: 1,
      totalSpent: 1200000,
      status: "banned",
      averageRating: 2.0
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
      active: { label: 'Hoạt động', className: Style.badgeActive },
      inactive: { label: 'Không hoạt động', className: Style.badgeInactive },
      banned: { label: 'Bị cấm', className: Style.badgeBanned }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: Style.badge };
    
    return (
      <span className={`${Style.badge} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <div className={Style.usersManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Quản lý người dùng</h1>
            <p>Quản lý thông tin và hoạt động của khách hàng</p>
          </div>
          
          <div className={Style.headerActions}>
            <button className={Style.exportButton}>
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
            <button className={Style.addButton}>
              <UserPlus className="w-4 h-4" />
              <span>Thêm người dùng</span>
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
                placeholder="Tìm theo tên, email, số điện thoại..."
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
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="banned">Bị cấm</option>
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
              {users.length}
            </div>
            <div className={Style.statLabel}>
              Tổng người dùng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className={Style.statLabel}>
              Đang hoạt động
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {users.reduce((sum, u) => sum + u.totalBookings, 0)}
            </div>
            <div className={Style.statLabel}>
              Tổng booking
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(users.reduce((sum, u) => sum + u.totalSpent, 0))}
            </div>
            <div className={Style.statLabel}>
              Tổng chi tiêu
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={Style.tableCard}>
        <div className={Style.tableHeader}>
          <div className={Style.tableHeaderContent}>
            <h3 className={Style.tableTitle}>
              Danh sách người dùng ({filteredUsers.length})
            </h3>
            {selectedUsers.length > 0 && (
              <div className={Style.bulkActions}>
                <span className={Style.bulkText}>
                  Đã chọn {selectedUsers.length} người dùng
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
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Người dùng</th>
                  <th className={Style.tableHeadCell}>Liên hệ</th>
                  <th className={Style.tableHeadCell}>Địa điểm</th>
                  <th className={Style.tableHeadCell}>Hoạt động</th>
                  <th className={Style.tableHeadCell}>Thống kê</th>
                  <th className={Style.tableHeadCell}>Trạng thái</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div>
                        <div className={Style.userName}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className={Style.userId}>
                          ID: {user.id}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.contactInfo}>
                        <div className={Style.contactItem}>
                          <Mail className={Style.contactIcon} />
                          <span>{user.email}</span>
                        </div>
                        <div className={Style.contactItem}>
                          <Phone className={Style.contactIcon} />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.locationInfo}>
                        <MapPin className={Style.locationIcon} />
                        <span className={Style.locationText}>{user.city}</span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.activityInfo}>
                        <div>
                          <span className={Style.activityLabel}>Đăng ký: </span>
                          {formatDate(user.registrationDate)}
                        </div>
                        <div>
                          <span className={Style.activityLabel}>Truy cập: </span>
                          {formatDate(user.lastLogin)}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statsInfo}>
                        <div className={Style.statItem}>
                          <Calendar className={Style.statIcon} />
                          <span className={Style.statText}>
                            {user.totalBookings} booking
                          </span>
                        </div>
                        <div className={Style.statItem}>
                          <DollarSign className={Style.statIcon} />
                          <span className={Style.statText}>
                            {formatPrice(user.totalSpent)}
                          </span>
                        </div>
                        {user.averageRating > 0 && (
                          <div className={Style.statItem}>
                            <Star className={Style.statIcon} />
                            <span className={Style.statText}>
                              {user.averageRating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      {getStatusBadge(user.status)}
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
            
            {filteredUsers.length === 0 && (
              <div className={Style.emptyState}>
                <Users className={Style.emptyIcon} />
                <p>Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;

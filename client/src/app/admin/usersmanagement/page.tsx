"use client";

import React, { useState } from "react";
import * as XLSX from 'xlsx';
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
  Calendar,
  DollarSign,
  Star,
  AlertCircle,
  RefreshCw
} from "lucide-react";

import Style from "../../styles/usersmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { usersApi, khachHangApi, donDatPhongApi } from "../../../lib/api";
import { ApiUser, ApiCustomer, ApiBooking } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { UserForm } from "../../components/user-form";
import { toast } from "sonner";

// Using ApiUser and ApiCustomer types from types/api.ts

const UsersManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'customers'>('users');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data from API
  const { data: users = [], loading: usersLoading, error: usersError, refetch: refetchUsers } = useApi<ApiUser[]>(
    () => usersApi.getAll(),
    []
  );

  const { data: customers = [], loading: customersLoading, error: customersError, refetch: refetchCustomers } = useApi<ApiCustomer[]>(
    () => khachHangApi.getAll(),
    []
  );

  // Fetch bookings to calculate real statistics
  const { data: bookings = [] } = useApi<ApiBooking[]>(
    () => donDatPhongApi.getAll(),
    []
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };


  // Calculate real statistics from bookings
  const userStats = React.useMemo(() => {
    const stats: Record<string, { bookings: number; spent: number }> = {};
    
    (bookings || []).forEach(booking => {
      const email = booking.customerEmail || booking.khachHang?.email;
      if (email) {
        if (!stats[email]) {
          stats[email] = { bookings: 0, spent: 0 };
        }
        stats[email].bookings += 1;
        stats[email].spent += booking.totalAmount || 0;
      }
    });
    
    return stats;
  }, [bookings]);

  // Combine users and customers for unified display
  const allUsers = [
    ...(users || []).map(user => {
      const email = user.gmail || '';
      const stats = email ? userStats[email] : null;
      return {
        ...user,
        id: user.id.toString(),
        name: user.taiKhoan || 'N/A',
        email: email || 'N/A',
        phone: user.soDienThoai || 'N/A',
        city: user.diaChi || 'N/A',
        registrationDate: user.createdAt || 'N/A',
        lastLogin: 'N/A',
        status: 'active' as const,
        type: 'user' as const,
        totalBookings: stats?.bookings || 0,
        totalSpent: stats?.spent || 0,
        averageRating: 0 // Placeholder
      };
    }),
    ...(customers || []).map(customer => {
      const stats = customer.email ? userStats[customer.email] : null;
      return {
        ...customer,
        id: customer.maKhachHang,
        name: customer.tenKhachHang,
        email: customer.email,
        phone: customer.soDienThoai,
        city: customer.diaChi || 'N/A',
        registrationDate: customer.ngayTao || 'N/A',
        lastLogin: 'N/A',
        status: 'active' as const,
        type: 'customer' as const,
        totalBookings: stats?.bookings || 0,
        totalSpent: stats?.spent || 0,
        averageRating: 0 // Placeholder
      };
    })
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesTab = activeTab === 'users' ? user.type === 'user' : user.type === 'customer';
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
  }, [searchTerm, statusFilter, activeTab]);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };


  const handleEditUser = (user: ApiUser) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await usersApi.delete(userId);
        await refetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa người dùng');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng đã chọn?`)) {
      try {
        await Promise.all(selectedUsers.map(id => usersApi.delete(id)));
        await refetchUsers();
        setSelectedUsers([]);
      } catch (error) {
        console.error('Error deleting users:', error);
        alert('Có lỗi xảy ra khi xóa người dùng');
      }
    }
  };

  const handleFormSuccess = () => {
    refetchUsers();
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleSelectAll = () => {
    if (paginatedUsers.length > 0 && paginatedUsers.every(user => selectedUsers.includes(user.id))) {
      setSelectedUsers(prev => prev.filter(id => !paginatedUsers.map(u => u.id).includes(id)));
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...paginatedUsers.map(user => user.id)])]);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = filteredUsers.map(user => ({
        'ID': user.id,
        'Tên': user.name || 'N/A',
        'Loại': user.type === 'user' ? 'Người dùng hệ thống' : 'Khách hàng',
        'Email': user.email || 'N/A',
        'Số điện thoại': user.phone || 'N/A',
        'Địa chỉ': user.city || 'N/A',
        'Tổng booking': user.totalBookings || 0,
        'Tổng chi tiêu': user.totalSpent ? formatPrice(user.totalSpent) : '0đ'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách người dùng');

      const filename = `DanhSachNguoiDung_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  const isLoading = usersLoading || customersLoading;
  const hasError = usersError || customersError;

  if (isLoading) {
    return <LoadingSpinner text="Đang tải ..." />;
  }

  if (hasError) {
    return (
      <div className={Style.usersManagement}>
        <div className={Style.errorContainer}>
          <AlertCircle className={Style.errorIcon} />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{usersError || customersError}</p>
          <button onClick={() => { refetchUsers(); refetchCustomers(); }} className={Style.retryButton}>
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={Style.usersManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Quản lý người dùng</h1>
            <p>Quản lý thông tin và hoạt động của người dùng và khách hàng</p>
          </div>
          
          <div className={Style.headerActions}>
            <button className={Style.exportButton} onClick={handleExportExcel}>
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={Style.tabNavigation}>
        <button
          className={`${Style.tabButton} ${activeTab === 'users' ? Style.tabButtonActive : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users className="w-4 h-4" />
          <span>Người dùng hệ thống ({(users || []).length})</span>
        </button>
        <button
          className={`${Style.tabButton} ${activeTab === 'customers' ? Style.tabButtonActive : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users className="w-4 h-4" />
          <span>Khách hàng ({(customers || []).length})</span>
        </button>
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
              {allUsers.length}
            </div>
            <div className={Style.statLabel}>
              Tổng người dùng
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {allUsers.filter(u => u.status === 'active').length}
            </div>
            <div className={Style.statLabel}>
              Đang hoạt động
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {allUsers.reduce((sum, u) => sum + u.totalBookings, 0)}
            </div>
            <div className={Style.statLabel}>
              Tổng booking
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {formatPrice(allUsers.reduce((sum, u) => sum + u.totalSpent, 0))}
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
                      checked={paginatedUsers.length > 0 && paginatedUsers.every(user => selectedUsers.includes(user.id))}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Người dùng</th>
                  <th className={Style.tableHeadCell}>Liên hệ</th>
                  <th className={Style.tableHeadCell}>Địa điểm</th>
                  <th className={Style.tableHeadCell}>Thống kê</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id || `user-${index}`} className={Style.tableRow}>
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
                          {user.name || 'N/A'}
                        </div>
                        <div className={Style.userId}>
                          ID: {user.id}
                        </div>
                        <div className={Style.userType}>
                          {user.type === 'user' ? 'Người dùng hệ thống' : 'Khách hàng'}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.contactInfo}>
                        <div className={Style.contactItem}>
                          <Mail className={Style.contactIcon} />
                          <span>{user.email || 'N/A'}</span>
                        </div>
                        <div className={Style.contactItem}>
                          <Phone className={Style.contactIcon} />
                          <span>{user.phone || 'N/A'}</span>
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
                      <div className={Style.actions}>
                        <button className={Style.actionButton}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.type === 'user' && (
                          <>
                            <button 
                              className={Style.actionButton}
                              onClick={() => {
                                const apiUser = (users || []).find(u => u.id.toString() === user.id);
                                if (apiUser) handleEditUser(apiUser);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className={`${Style.actionButton} ${Style.actionButtonDanger}`}
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
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

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className={Style.pagination}>
            <div className={Style.paginationInfo}>
              Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
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

      {/* Additional Sections: Reviews, Complaints, Notifications */}
      <div className={Style.additionalSections}>
        {/* Reviews Section */}
        <div className={Style.sectionCard}>
          <div className={Style.sectionHeader}>
            <Star className={Style.sectionIcon} />
            <h3 className={Style.sectionTitle}>Đánh giá</h3>
          </div>
          <div className={Style.sectionContent}>
            <p className={Style.sectionPlaceholder}>
              Phần đánh giá sẽ được hiển thị tại đây
            </p>
          </div>
        </div>

        {/* Complaints Section */}
        <div className={Style.sectionCard}>
          <div className={Style.sectionHeader}>
            <AlertCircle className={Style.sectionIcon} />
            <h3 className={Style.sectionTitle}>Khiếu nại</h3>
          </div>
          <div className={Style.sectionContent}>
            <p className={Style.sectionPlaceholder}>
              Phần khiếu nại sẽ được hiển thị tại đây
            </p>
          </div>
        </div>

        {/* Notifications Section */}
        <div className={Style.sectionCard}>
          <div className={Style.sectionHeader}>
            <Calendar className={Style.sectionIcon} />
            <h3 className={Style.sectionTitle}>Thông báo</h3>
          </div>
          <div className={Style.sectionContent}>
            <p className={Style.sectionPlaceholder}>
              Phần thông báo sẽ được hiển thị tại đây
            </p>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default UsersManagementPage;

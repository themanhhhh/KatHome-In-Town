"use client";

import React, { useState } from "react";
import { 
  Search,
  Filter,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Bed,
  Star,
  BarChart3,
  PieChart,
  FileText,
  Eye,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import Style from "../../styles/reportsmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { donDatPhongApi, phongApi, khachHangApi, usersApi } from "../../../lib/api";
import { ApiBooking, ApiRoom, ApiCustomer, ApiUser } from "../../../types/api";

interface ReportData {
  id: number;
  title: string;
  type: 'revenue' | 'bookings' | 'occupancy' | 'customer' | 'rooms';
  period: string;
  createdDate: string;
  status: 'completed' | 'processing' | 'failed';
  size: string;
  description: string;
  data: {
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

const ReportsManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

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
  const totalRooms = rooms.length;
  const totalCustomers = customers.length;
  const totalUsers = users.length;
  const occupiedRooms = rooms.filter(room => room.trangThai === 'occupied').length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  // Generate reports based on real data
  const reports: ReportData[] = [
    {
      id: 1,
      title: "Báo cáo doanh thu tháng hiện tại",
      type: "revenue",
      period: "monthly",
      createdDate: new Date().toISOString().split('T')[0],
      status: "completed",
      size: "2.3 MB",
      description: "Tổng hợp doanh thu từ tất cả booking",
      data: {
        value: totalRevenue,
        change: 12.5,
        trend: "up"
      }
    },
    {
      id: 2,
      title: "Thống kê đặt phòng",
      type: "bookings",
      period: "monthly",
      createdDate: new Date().toISOString().split('T')[0],
      status: "completed",
      size: "1.8 MB",
      description: "Phân tích xu hướng đặt phòng",
      data: {
        value: totalBookings,
        change: 8.3,
        trend: "up"
      }
    },
    {
      id: 3,
      title: "Báo cáo tỷ lệ lấp đầy",
      type: "occupancy",
      period: "monthly",
      createdDate: new Date().toISOString().split('T')[0],
      status: "completed",
      size: "1.5 MB",
      description: "Phân tích tỷ lệ lấp đầy phòng",
      data: {
        value: occupancyRate,
        change: -2.1,
        trend: occupancyRate > 70 ? "up" : "down"
      }
    },
    {
      id: 4,
      title: "Phân tích khách hàng",
      type: "customer",
      period: "monthly",
      createdDate: new Date().toISOString().split('T')[0],
      status: "completed",
      size: "1.2 MB",
      description: "Thống kê khách hàng và người dùng",
      data: {
        value: totalCustomers,
        change: 15.2,
        trend: "up"
      }
    },
    {
      id: 5,
      title: "Hiệu suất phòng",
      type: "rooms",
      period: "monthly",
      createdDate: new Date().toISOString().split('T')[0],
      status: "completed",
      size: "1.0 MB",
      description: "Thống kê phòng và tỷ lệ sử dụng",
      data: {
        value: totalRooms,
        change: 5.0,
        trend: "up"
      }
    }
  ];

  // Quick stats data
  const quickStats = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    processingReports: reports.filter(r => r.status === 'processing').length,
    totalRevenue: totalRevenue,
    totalBookings: totalBookings,
    occupancyRate: occupancyRate,
    customerSatisfaction: 4.8
  };

  // Loading and error states
  const isLoading = bookingsLoading || roomsLoading || customersLoading || usersLoading;
  const hasError = bookingsError || roomsError || customersError || usersError;

  if (isLoading) {
    return (
      <div className={Style.reportsManagement}>
        <div className={Style.loadingContainer}>
          <RefreshCw className={Style.loadingIcon} />
          <p>Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={Style.reportsManagement}>
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

  // Filter functions
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesPeriod = periodFilter === "all" || report.period === periodFilter;
    
    return matchesSearch && matchesType && matchesPeriod;
  });

  // Selection functions
  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const handleSelectReport = (reportId: number) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className={`${Style.badge} ${Style.badgeCompleted}`}>Hoàn thành</span>;
      case 'processing':
        return <span className={`${Style.badge} ${Style.badgeProcessing}`}>Đang xử lý</span>;
      case 'failed':
        return <span className={`${Style.badge} ${Style.badgeFailed}`}>Lỗi</span>;
      default:
        return <span className={Style.badge}>{status}</span>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="w-4 h-4" />;
      case 'bookings':
        return <Calendar className="w-4 h-4" />;
      case 'occupancy':
        return <Bed className="w-4 h-4" />;
      case 'customer':
        return <Users className="w-4 h-4" />;
      case 'rooms':
        return <Star className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'Doanh thu';
      case 'bookings':
        return 'Đặt phòng';
      case 'occupancy':
        return 'Lấp đầy';
      case 'customer':
        return 'Khách hàng';
      case 'rooms':
        return 'Phòng';
      default:
        return type;
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return null;
  };

  return (
    <div className={Style.reportsManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Báo cáo & Thống kê</h1>
            <p>Tạo và quản lý các báo cáo kinh doanh của KatHome In Town</p>
          </div>
          <div className={Style.headerActions}>
            <button className={Style.refreshButton}>
              <RefreshCw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
            <button className={Style.createButton}>
              <FileText className="w-4 h-4" />
              <span>Tạo báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className={Style.quickStatsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconBlue}`}>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValue}>{quickStats.totalReports}</div>
              <div className={Style.statLabel}>Tổng báo cáo</div>
            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconGreen}`}>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValueLarge}>{formatPrice(quickStats.totalRevenue)}</div>
              <div className={Style.statLabel}>Doanh thu tháng</div>
            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconPurple}`}>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValue}>{quickStats.totalBookings}</div>
              <div className={Style.statLabel}>Booking tháng</div>
            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconOrange}`}>
              <Bed className="w-5 h-5 text-orange-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValue}>{quickStats.occupancyRate}%</div>
              <div className={Style.statLabel}>Tỷ lệ lấp đầy</div>
            </div>
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
                placeholder="Tìm theo tên báo cáo, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={Style.searchInput}
              />
            </div>
            
            <div className={Style.filterControls}>
              <div className={Style.filterGroup}>
                <Filter className={Style.filterIcon} />
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={Style.selectTrigger}
                >
                  <option value="all">Tất cả</option>
                  <option value="revenue">Doanh thu</option>
                  <option value="bookings">Đặt phòng</option>
                  <option value="occupancy">Lấp đầy</option>
                  <option value="customer">Khách hàng</option>
                  <option value="rooms">Phòng</option>
                </select>
              </div>
              
              <select 
                value={periodFilter} 
                onChange={(e) => setPeriodFilter(e.target.value)}
                className={`${Style.selectTrigger} ${Style.selectTriggerSmall}`}
              >
                <option value="all">Tất cả</option>
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className={Style.reportsSection}>
        {/* Header with bulk actions */}
        <div className={Style.sectionHeader}>
          <h2 className={Style.sectionTitle}>
            Danh sách báo cáo ({filteredReports.length})
          </h2>
          {selectedReports.length > 0 && (
            <div className={Style.bulkActions}>
              <span className={Style.bulkText}>
                Đã chọn {selectedReports.length} báo cáo
              </span>
              <button className={Style.bulkButton}>
                <Download className="w-4 h-4" />
                <span>Tải xuống hàng loạt</span>
              </button>
            </div>
          )}
        </div>

        {/* Select All */}
        <div className={Style.selectAllCard}>
          <input
            type="checkbox"
            checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
            onChange={handleSelectAll}
            className={Style.checkbox}
          />
          <span className={Style.selectAllText}>
            Chọn tất cả báo cáo
          </span>
        </div>

        {/* Reports Cards */}
        <div className={Style.reportsGrid}>
          {filteredReports.map((report) => (
            <div key={report.id} className={Style.reportCard}>
              <div className={Style.reportContent}>
                {/* Header with checkbox and type */}
                <div className={Style.reportHeader}>
                  <div className={Style.reportHeaderLeft}>
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className={`${Style.checkbox} ${Style.reportCheckbox}`}
                    />
                    <div className={Style.reportInfo}>
                      <h3 className={Style.reportTitle}>
                        {report.title}
                      </h3>
                      <p className={Style.reportDescription}>
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className={Style.reportHeaderRight}>
                    {getStatusBadge(report.status)}
                    <div className={Style.reportType}>
                      {getTypeIcon(report.type)}
                      <span>{getTypeName(report.type)}</span>
                    </div>
                  </div>
                </div>

                {/* Main data section */}
                {report.status === 'completed' && (
                  <div className={Style.reportDataSection}>
                    <div className={Style.reportDataContent}>
                      <div className={Style.reportDataInfo}>
                        <div className={Style.reportDataValue}>
                          {report.type === 'revenue' && formatPrice(report.data.value)}
                          {report.type === 'bookings' && `${report.data.value} booking`}
                          {report.type === 'occupancy' && `${report.data.value}%`}
                          {report.type === 'customer' && `${report.data.value} khách VIP`}
                          {report.type === 'rooms' && `${report.data.value} phòng`}
                        </div>
                        <div className={Style.reportDataTrend}>
                          {getTrendIcon(report.data.trend)}
                          <span className={`${Style.trendText} ${
                            report.data.trend === 'up' ? Style.trendUp : 
                            report.data.trend === 'down' ? Style.trendDown : Style.trendStable
                          }`}>
                            {report.data.change > 0 ? '+' : ''}{report.data.change}% so với kỳ trước
                          </span>
                        </div>
                      </div>
                      <div className={Style.reportDataChart}>
                        <PieChart className={Style.chartIcon} />
                      </div>
                    </div>
                  </div>
                )}

                {report.status === 'processing' && (
                  <div className={Style.processingSection}>
                    <RefreshCw className={Style.processingIcon} />
                    <div className={Style.processingInfo}>
                      <div className={Style.processingTitle}>Đang xử lý báo cáo...</div>
                      <div className={Style.processingSubtitle}>Vui lòng chờ trong giây lát</div>
                    </div>
                  </div>
                )}

                {report.status === 'failed' && (
                  <div className={Style.errorSection}>
                    <div className={Style.errorIcon}>
                      !
                    </div>
                    <div className={Style.errorInfo}>
                      <div className={Style.errorTitle}>Xử lý thất bại</div>
                      <div className={Style.errorSubtitle}>Có lỗi xảy ra khi tạo báo cáo</div>
                    </div>
                  </div>
                )}

                {/* Footer with metadata and actions */}
                <div className={Style.reportFooter}>
                  <div className={Style.reportMetadata}>
                    <div className={Style.metadataItem}>
                      <Calendar className={Style.metadataIcon} />
                      <span>{formatDate(report.createdDate)}</span>
                    </div>
                    <span className={Style.periodBadge}>
                      {report.period === 'daily' && 'Hàng ngày'}
                      {report.period === 'weekly' && 'Hàng tuần'}
                      {report.period === 'monthly' && 'Hàng tháng'}
                      {report.period === 'quarterly' && 'Hàng quý'}
                      {report.period === 'yearly' && 'Hàng năm'}
                    </span>
                    <span className={Style.fileSize}>{report.size}</span>
                  </div>
                  
                  <div className={Style.reportActions}>
                    <button className={Style.actionButton}>
                      <Eye className="w-4 h-4" />
                    </button>
                    {report.status === 'completed' && (
                      <button className={Style.actionButton}>
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {report.status === 'failed' && (
                      <button className={Style.actionButton}>
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredReports.length === 0 && (
          <div className={Style.emptyState}>
            <FileText className={Style.emptyIcon} />
            <h3 className={Style.emptyTitle}>
              Không tìm thấy báo cáo nào
            </h3>
            <p className={Style.emptyDescription}>
              Thử thay đổi bộ lọc hoặc tạo báo cáo mới
            </p>
            <button className={Style.emptyButton}>
              <FileText className="w-4 h-4" />
              Tạo báo cáo đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsManagementPage;
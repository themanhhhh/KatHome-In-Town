"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  DollarSign,
  Calendar,
  Bed,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  BarChart3
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as XLSX from 'xlsx';

import Style from "../../styles/reportsmanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { revenueApi, type RevenueSummaryResponse, type TrendDataResponse, type StatusStatsResponse, type BookingsDetailResponse } from "../../../lib/api";
import LoadingSpinner from "../../components/loading-spinner";
import { toast } from "sonner";

const ReportsManagementPage = () => {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Fetch data from new Reports API
  const { data: summaryData, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useApi<RevenueSummaryResponse>(
    () => revenueApi.getSummary(),
    []
  );

  const { data: trendData, loading: trendLoading, error: trendError, refetch: refetchTrend } = useApi<TrendDataResponse>(
    () => revenueApi.getTrend(dateRange, dateRange === 'week' ? 8 : dateRange === 'quarter' ? 4 : dateRange === 'year' ? 3 : 6),
    [dateRange]
  );

  const { data: statusStatsData, loading: statusLoading, error: statusError, refetch: refetchStatus } = useApi<StatusStatsResponse>(
    () => revenueApi.getStatusStats(),
    []
  );

  const { data: bookingsDetailData, loading: bookingsDetailLoading, error: bookingsDetailError } = useApi<BookingsDetailResponse>(
    () => revenueApi.getBookingsDetail(),
    []
  );

  // Debug: Log API responses
  console.log('🔍 Summary data:', summaryData);
  console.log('🔍 Trend data:', trendData);
  console.log('🔍 Status stats:', statusStatsData);
  console.log('🔍 Bookings detail:', bookingsDetailData);

  // Process data from API responses
  const stats = useMemo(() => {
    console.log('📊 Processing API data...');

    // Get data from API responses
    const summary = summaryData?.data || {
      totalRevenue: 0,
      totalBookings: 0,
      averageRevenue: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      completedBookings: 0,
      successRate: 0
    };

    const trend = trendData?.data || [];
    const statusStats = statusStatsData?.data || [];

    console.log('📈 Processed data:', { summary, trend, statusStats });

    // Calculate trend percentage
    const currentPeriodRevenue = trend[trend.length - 1]?.revenue || 0;
    const previousPeriodRevenue = trend[trend.length - 2]?.revenue || 1;
    const revenueTrend = previousPeriodRevenue > 0
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue * 100)
      : 0;

    return {
      totalRevenue: summary.totalRevenue,
      totalBookings: summary.totalBookings,
      averageRevenue: summary.averageRevenue,
      confirmedBookings: summary.confirmedBookings,
      cancelledBookings: summary.cancelledBookings,
      completedBookings: summary.completedBookings,
      monthlyRevenue: trend.map(t => ({
        month: t.period,
        revenue: t.revenue,
        bookings: t.bookings
      })),
      statusData: statusStats,
      revenueTrend: revenueTrend
    };
  }, [summaryData, trendData, statusStatsData]);

  // Export to Excel
  const handleExportExcel = () => {
    try {
      // Prepare summary data
      const summaryData = [
        { 'Chỉ số': 'Tổng doanh thu', 'Giá trị': stats.totalRevenue },
        { 'Chỉ số': 'Tổng booking', 'Giá trị': stats.totalBookings },
        { 'Chỉ số': 'Doanh thu trung bình', 'Giá trị': stats.averageRevenue },
        { 'Chỉ số': 'Booking đã xác nhận', 'Giá trị': stats.confirmedBookings },
        { 'Chỉ số': 'Booking hoàn thành', 'Giá trị': stats.completedBookings },
        { 'Chỉ số': 'Booking đã hủy', 'Giá trị': stats.cancelledBookings },
      ];

      // Prepare monthly revenue data
      const monthlyData = stats.monthlyRevenue.map(item => ({
        'Tháng': item.month,
        'Doanh thu': item.revenue,
        'Số booking': item.bookings
      }));

      // Prepare detailed bookings data from API
      const bookingsData = (bookingsDetailData?.data || []).map(booking => ({
        'Mã booking': booking.maDatPhong,
        'Khách hàng': booking.customerName,
        'Email': booking.customerEmail,
        'Số điện thoại': booking.customerPhone,
        'Ngày đặt': new Date(booking.ngayDat).toLocaleDateString('vi-VN'),
        'Check-in': new Date(booking.checkinDuKien).toLocaleDateString('vi-VN'),
        'Check-out': new Date(booking.checkoutDuKien).toLocaleDateString('vi-VN'),
        'Trạng thái': booking.trangThai === 'CF' ? 'Đã xác nhận' :
          booking.trangThai === 'R' ? 'Chờ xác nhận' :
            booking.trangThai === 'AB' ? 'Đã hủy' :
              booking.trangThai === 'CC' ? 'Hoàn thành' : booking.trangThai,
        'Tổng tiền': booking.totalAmount,
        'Phương thức thanh toán': booking.paymentMethod,
        'Trạng thái thanh toán': booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
        'Cơ sở': booking.coSo
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Add summary sheet
      const ws1 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

      // Add monthly revenue sheet
      const ws2 = XLSX.utils.json_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Doanh thu theo tháng');

      // Add bookings detail sheet
      const ws3 = XLSX.utils.json_to_sheet(bookingsData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Chi tiết booking');

      // Generate filename with current date
      const filename = `BaoCaoDoanhThu_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Write file
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

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchSummary(),
        refetchTrend(),
        refetchStatus()
      ]);
      toast.success('Đã làm mới dữ liệu!');
    } catch {
      toast.error('Lỗi khi làm mới dữ liệu');
    }
  };

  // Loading and error states
  const isLoading = summaryLoading || trendLoading || statusLoading || bookingsDetailLoading;
  const hasError = summaryError || trendError || statusError || bookingsDetailError;

  if (isLoading) {
    return <LoadingSpinner text="Đang tải báo cáo..." />;
  }

  if (hasError) {
    return (
      <div className={Style.reportsManagement}>
        <div className={Style.errorContainer}>
          <AlertCircle className={Style.errorIcon} />
          <h3>Lỗi tải dữ liệu</h3>
          <p>{summaryError || trendError || statusError || bookingsDetailError || 'Có lỗi xảy ra'}</p>
          <button onClick={() => window.location.reload()} className={Style.retryButton}>
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className={Style.reportsManagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Báo cáo Doanh thu</h1>
            <p>Thống kê và phân tích doanh thu của KatHome In Town</p>
          </div>
          <div className={Style.headerActions}>
            <button className={Style.refreshButton} onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              <span>Làm mới</span>
            </button>
            <button className={Style.exportButton} onClick={handleExportExcel}>
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={Style.quickStatsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconGreen}`}>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValueLarge}>{formatPrice(stats.totalRevenue)}</div>
              <div className={Style.statLabel}>Tổng doanh thu</div>

            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconBlue}`}>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValue}>{stats.totalBookings}</div>
              <div className={Style.statLabel}>Tổng booking</div>
            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconPurple}`}>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValueLarge}>{formatPrice(stats.averageRevenue)}</div>
              <div className={Style.statLabel}>Trung bình/booking</div>
            </div>
          </div>
        </div>

        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={`${Style.statIcon} ${Style.statIconOrange}`}>
              <Bed className="w-5 h-5 text-orange-600" />
            </div>
            <div className={Style.statInfo}>
              <div className={Style.statValue}>{stats.confirmedBookings}</div>
              <div className={Style.statLabel}>Booking đã xác nhận</div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className={Style.filtersCard}>
        <div className={Style.filtersContent}>
          <div className={Style.filterLabel}>
            <Calendar className="w-4 h-4" />
            <span>Khoảng thời gian:</span>
          </div>
          <div className={Style.dateRangeButtons}>
            <button
              className={`${Style.dateRangeButton} ${dateRange === 'month' ? Style.active : ''}`}
              onClick={() => setDateRange('month')}
            >
              Tháng
            </button>
            <button
              className={`${Style.dateRangeButton} ${dateRange === 'quarter' ? Style.active : ''}`}
              onClick={() => setDateRange('quarter')}
            >
              Quý
            </button>
            <button
              className={`${Style.dateRangeButton} ${dateRange === 'year' ? Style.active : ''}`}
              onClick={() => setDateRange('year')}
            >
              Năm
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={Style.chartsGrid}>
        {/* Revenue Bar Chart */}
        <div className={Style.chartCard}>
          <div className={Style.chartHeader}>
            <h3 className={Style.chartTitle}>Doanh thu theo {dateRange === 'week' ? 'tuần' : dateRange === 'quarter' ? 'quý' : dateRange === 'year' ? 'năm' : 'tháng'}</h3>
            <Download className="w-4 h-4 text-gray-400 cursor-pointer" onClick={handleExportExcel} />
          </div>
          <div className={Style.chartContainer}>
            {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatPrice(value)}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>Không có dữ liệu</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Bookings: {bookingsDetailData?.data?.length || 0} |
                    Stats data: {stats.monthlyRevenue?.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Line Chart */}
        <div className={Style.chartCard}>
          <div className={Style.chartHeader}>
            <h3 className={Style.chartTitle}>Số lượng booking theo {dateRange === 'week' ? 'tuần' : dateRange === 'quarter' ? 'quý' : dateRange === 'year' ? 'năm' : 'tháng'}</h3>
            <Download className="w-4 h-4 text-gray-400 cursor-pointer" onClick={handleExportExcel} />
          </div>
          <div className={Style.chartContainer}>
            {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Số booking"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>Không có dữ liệu booking</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <div className={Style.chartCard}>
          <div className={Style.chartHeader}>
            <h3 className={Style.chartTitle}>Phân bố trạng thái booking</h3>
            <Download className="w-4 h-4 text-gray-400 cursor-pointer" onClick={handleExportExcel} />
          </div>
          <div className={Style.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.statusData.map((entry: { name: string; value: number; color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats Card */}
        <div className={Style.chartCard}>
          <div className={Style.chartHeader}>
            <h3 className={Style.chartTitle}>Tổng quan thống kê</h3>
          </div>
          <div className={Style.summaryStats}>
            <div className={Style.summaryItem}>
              <div className={Style.summaryLabel}>Booking đã xác nhận</div>
              <div className={Style.summaryValue}>{stats.confirmedBookings}</div>
              <div className={Style.summaryPercent}>
                {((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(1)}%
              </div>
            </div>
            <div className={Style.summaryItem}>
              <div className={Style.summaryLabel}>Booking hoàn thành</div>
              <div className={Style.summaryValue}>{stats.completedBookings}</div>
              <div className={Style.summaryPercent}>
                {((stats.completedBookings / stats.totalBookings) * 100).toFixed(1)}%
              </div>
            </div>
            <div className={Style.summaryItem}>
              <div className={Style.summaryLabel}>Booking đã hủy</div>
              <div className={Style.summaryValue}>{stats.cancelledBookings}</div>
              <div className={Style.summaryPercent}>
                {((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1)}%
              </div>
            </div>
            <div className={Style.summaryItem}>
              <div className={Style.summaryLabel}>Tỷ lệ thành công</div>
              <div className={Style.summaryValue}>
                {(((stats.confirmedBookings + stats.completedBookings) / stats.totalBookings) * 100).toFixed(1)}%
              </div>
              <div className={Style.summaryPercent}>
                {stats.confirmedBookings + stats.completedBookings}/{stats.totalBookings}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagementPage;

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
  DateRange
} from "lucide-react";

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

export function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [reports] = useState<ReportData[]>([
    {
      id: 1,
      title: "Báo cáo doanh thu tháng 12/2024",
      type: "revenue",
      period: "monthly",
      createdDate: "2024-12-25",
      status: "completed",
      size: "2.3 MB",
      description: "Tổng hợp doanh thu, chi phí và lợi nhuận tháng 12",
      data: {
        value: 485200000,
        change: 12.5,
        trend: "up"
      }
    },
    {
      id: 2,
      title: "Thống kê đặt phòng quý 4/2024",
      type: "bookings",
      period: "quarterly",
      createdDate: "2024-12-20",
      status: "completed",
      size: "1.8 MB",
      description: "Phân tích xu hướng đặt phòng và tỷ lệ hủy",
      data: {
        value: 342,
        change: 8.3,
        trend: "up"
      }
    },
    {
      id: 3,
      title: "Báo cáo tỷ lệ lấp đầy năm 2024",
      type: "occupancy",
      period: "yearly",
      createdDate: "2024-12-15",
      status: "processing",
      size: "Đang xử lý...",
      description: "Phân tích tỷ lệ lấp đầy theo từng tháng và loại phòng",
      data: {
        value: 78.5,
        change: -2.1,
        trend: "down"
      }
    },
    {
      id: 4,
      title: "Phân tích khách hàng VIP",
      type: "customer",
      period: "monthly",
      createdDate: "2024-12-10",
      status: "completed",
      size: "1.2 MB",
      description: "Danh sách và hành vi khách hàng có giá trị cao",
      data: {
        value: 45,
        change: 15.2,
        trend: "up"
      }
    },
    {
      id: 5,
      title: "Hiệu suất phòng theo loại",
      type: "rooms",
      period: "quarterly",
      createdDate: "2024-12-05",
      status: "failed",
      size: "0 MB",
      description: "So sánh doanh thu và tỷ lệ đặt phòng theo từng loại",
      data: {
        value: 0,
        change: 0,
        trend: "stable"
      }
    }
  ]);

  // Quick stats data
  const quickStats = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    processingReports: reports.filter(r => r.status === 'processing').length,
    totalRevenue: 485200000,
    totalBookings: 342,
    occupancyRate: 78.5,
    customerSatisfaction: 4.8
  };

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
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Lỗi</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#D91A73' }}>
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-600 mt-2">
            Tạo và quản lý các báo cáo kinh doanh của Rose Homestay
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            style={{ borderColor: '#D91A73', color: '#D91A73' }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới</span>
          </Button>
          <Button
            size="sm"
            className="flex items-center space-x-2 text-white"
            style={{ backgroundColor: '#D91A73' }}
          >
            <FileText className="w-4 h-4" />
            <span>Tạo báo cáo</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">{quickStats.totalReports}</div>
                <div className="text-sm text-gray-500">Tổng báo cáo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">{formatPrice(quickStats.totalRevenue)}</div>
                <div className="text-sm text-gray-500">Doanh thu tháng</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">{quickStats.totalBookings}</div>
                <div className="text-sm text-gray-500">Booking tháng</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bed className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">{quickStats.occupancyRate}%</div>
                <div className="text-sm text-gray-500">Tỷ lệ lấp đầy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                <Input
                  placeholder="Tìm theo tên báo cáo, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" style={{ color: '#D91A73' }} />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="revenue">Doanh thu</SelectItem>
                    <SelectItem value="bookings">Đặt phòng</SelectItem>
                    <SelectItem value="occupancy">Lấp đầy</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="rooms">Phòng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="daily">Hàng ngày</SelectItem>
                  <SelectItem value="weekly">Hàng tuần</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="quarterly">Hàng quý</SelectItem>
                  <SelectItem value="yearly">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="space-y-4">
        {/* Header with bulk actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: '#D91A73' }}>
            Danh sách báo cáo ({filteredReports.length})
          </h2>
          {selectedReports.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm" style={{ color: '#D91A73' }}>
                Đã chọn {selectedReports.length} báo cáo
              </span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                style={{ borderColor: '#D91A73', color: '#D91A73' }}
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống hàng loạt</span>
              </Button>
            </div>
          )}
        </div>

        {/* Select All */}
        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
          <input
            type="checkbox"
            checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
            onChange={handleSelectAll}
            style={{ accentColor: '#D91A73' }}
          />
          <span className="text-sm font-medium" style={{ color: '#D91A73' }}>
            Chọn tất cả báo cáo
          </span>
        </div>

        {/* Reports Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with checkbox and type */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                        style={{ accentColor: '#D91A73' }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg leading-tight" style={{ color: '#D91A73' }}>
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(report.status)}
                      <div className="flex items-center space-x-2 text-sm" style={{ color: '#D91A73' }}>
                        {getTypeIcon(report.type)}
                        <span>{getTypeName(report.type)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main data section */}
                  {report.status === 'completed' && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
                            {report.type === 'revenue' && formatPrice(report.data.value)}
                            {report.type === 'bookings' && `${report.data.value} booking`}
                            {report.type === 'occupancy' && `${report.data.value}%`}
                            {report.type === 'customer' && `${report.data.value} khách VIP`}
                            {report.type === 'rooms' && `${report.data.value} phòng`}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getTrendIcon(report.data.trend, report.data.change)}
                            <span className={`text-sm font-medium ${
                              report.data.trend === 'up' ? 'text-green-500' : 
                              report.data.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {report.data.change > 0 ? '+' : ''}{report.data.change}% so với kỳ trước
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <PieChart className="w-12 h-12 opacity-20" style={{ color: '#D91A73' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {report.status === 'processing' && (
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                      <div>
                        <div className="font-medium text-blue-700">Đang xử lý báo cáo...</div>
                        <div className="text-sm text-blue-600">Vui lòng chờ trong giây lát</div>
                      </div>
                    </div>
                  )}

                  {report.status === 'failed' && (
                    <div className="bg-red-50 rounded-lg p-4 flex items-center space-x-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <div>
                        <div className="font-medium text-red-700">Xử lý thất bại</div>
                        <div className="text-sm text-red-600">Có lỗi xảy ra khi tạo báo cáo</div>
                      </div>
                    </div>
                  )}

                  {/* Footer with metadata and actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(report.createdDate)}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.period === 'daily' && 'Hàng ngày'}
                        {report.period === 'weekly' && 'Hàng tuần'}
                        {report.period === 'monthly' && 'Hàng tháng'}
                        {report.period === 'quarterly' && 'Hàng quý'}
                        {report.period === 'yearly' && 'Hàng năm'}
                      </Badge>
                      <span className="text-xs">{report.size}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {report.status === 'completed' && (
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      {report.status === 'failed' && (
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredReports.length === 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#D91A73' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: '#D91A73' }}>
                Không tìm thấy báo cáo nào
              </h3>
              <p className="text-gray-500 mb-6">
                Thử thay đổi bộ lọc hoặc tạo báo cáo mới
              </p>
              <Button
                className="text-white"
                style={{ backgroundColor: '#D91A73' }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Tạo báo cáo đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

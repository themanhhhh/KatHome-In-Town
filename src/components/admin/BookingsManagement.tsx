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
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface Booking {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  room: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentMethod: string;
  bookingDate: string;
  specialRequests?: string;
}

export function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [bookings] = useState<Booking[]>([
    {
      id: "BK1735123456",
      guestName: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0987654321",
      room: "Phòng Deluxe với Ban công",
      checkIn: "2024-12-28",
      checkOut: "2024-12-30",
      guests: 2,
      total: 2400000,
      status: "confirmed",
      paymentMethod: "Thẻ tín dụng",
      bookingDate: "2024-12-20",
      specialRequests: "Tầng cao, view đẹp"
    },
    {
      id: "BK1735123457",
      guestName: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0976543210",
      room: "Phòng Superior",
      checkIn: "2024-12-29",
      checkOut: "2024-12-31",
      guests: 4,
      total: 1800000,
      status: "pending",
      paymentMethod: "Chuyển khoản",
      bookingDate: "2024-12-21"
    },
    {
      id: "BK1735123458",
      guestName: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0965432109",
      room: "Phòng Standard",
      checkIn: "2024-12-30",
      checkOut: "2025-01-02",
      guests: 2,
      total: 2100000,
      status: "confirmed",
      paymentMethod: "Thanh toán tại chỗ",
      bookingDate: "2024-12-22"
    },
    {
      id: "BK1735123459",
      guestName: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0954321098",
      room: "Phòng Deluxe",
      checkIn: "2024-12-25",
      checkOut: "2024-12-27",
      guests: 3,
      total: 1600000,
      status: "completed",
      paymentMethod: "Thẻ tín dụng",
      bookingDate: "2024-12-15",
      specialRequests: "Giường đôi"
    },
    {
      id: "BK1735123460",
      guestName: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0943210987",
      room: "Phòng Superior",
      checkIn: "2024-12-26",
      checkOut: "2024-12-28",
      guests: 2,
      total: 1200000,
      status: "cancelled",
      paymentMethod: "Chuyển khoản",
      bookingDate: "2024-12-18"
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
      confirmed: { label: 'Đã xác nhận', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
      completed: { label: 'Hoàn thành', className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
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
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#D91A73' }}>
            Quản lý đặt phòng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả booking của khách hàng
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            style={{ borderColor: '#D91A73', color: '#D91A73' }}
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                <Input
                  placeholder="Tìm theo tên khách, mã booking, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" style={{ color: '#D91A73' }} />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {bookings.length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng booking
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Chờ xác nhận
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Đã xác nhận
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {formatPrice(bookings.reduce((sum, b) => sum + b.total, 0))}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng doanh thu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#D91A73' }}>
              Danh sách đặt phòng ({filteredBookings.length})
            </CardTitle>
            {selectedBookings.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: '#D91A73' }}>
                  Đã chọn {selectedBookings.length} booking
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#D91A73', color: '#D91A73' }}
                >
                  Xác nhận hàng loạt
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#F2A7C3' }}>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === filteredBookings.length}
                      onChange={handleSelectAll}
                      style={{ accentColor: '#D91A73' }}
                    />
                  </th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Booking</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Khách hàng</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Phòng</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Ngày</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Tổng tiền</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Trạng thái</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-white/50" style={{ borderColor: '#F2A7C3' }}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => handleSelectBooking(booking.id)}
                        style={{ accentColor: '#D91A73' }}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium" style={{ color: '#D91A73' }}>
                          {booking.id}
                        </div>
                        <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                          {formatDate(booking.bookingDate)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium" style={{ color: '#D91A73' }}>
                          {booking.guestName}
                        </div>
                        <div className="text-sm opacity-80 flex items-center space-x-2" style={{ color: '#D91A73' }}>
                          <Mail className="w-3 h-3" />
                          <span>{booking.email}</span>
                        </div>
                        <div className="text-sm opacity-80 flex items-center space-x-2" style={{ color: '#D91A73' }}>
                          <Phone className="w-3 h-3" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium" style={{ color: '#D91A73' }}>
                          {booking.room}
                        </div>
                        <div className="text-sm opacity-80 flex items-center space-x-1" style={{ color: '#D91A73' }}>
                          <Users className="w-3 h-3" />
                          <span>{booking.guests} khách</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm" style={{ color: '#D91A73' }}>
                        <div>Nhận: {formatDate(booking.checkIn)}</div>
                        <div>Trả: {formatDate(booking.checkOut)}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold" style={{ color: '#D91A73' }}>
                        {formatPrice(booking.total)}
                      </div>
                      <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                        {booking.paymentMethod}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBookings.length === 0 && (
              <div className="text-center py-12 opacity-60" style={{ color: '#D91A73' }}>
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>Không tìm thấy booking nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

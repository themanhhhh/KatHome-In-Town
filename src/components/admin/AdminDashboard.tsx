import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Bed,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

export function AdminDashboard() {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = {
    totalBookings: 156,
    totalRevenue: 485200000,
    totalUsers: 89,
    occupancyRate: 78,
    monthlyGrowth: 12.5,
    averageRating: 4.8
  };

  const recentBookings = [
    {
      id: "BK1735123456",
      guestName: "Nguyễn Văn A",
      room: "Phòng Deluxe với Ban công",
      checkIn: "2024-12-28",
      checkOut: "2024-12-30",
      total: 2400000,
      status: "confirmed"
    },
    {
      id: "BK1735123457",
      guestName: "Trần Thị B",
      room: "Phòng Superior",
      checkIn: "2024-12-29",
      checkOut: "2024-12-31",
      total: 1800000,
      status: "pending"
    },
    {
      id: "BK1735123458",
      guestName: "Lê Văn C",
      room: "Phòng Standard",
      checkIn: "2024-12-30",
      checkOut: "2025-01-02",
      total: 2100000,
      status: "confirmed"
    }
  ];

  const upcomingCheckIns = [
    {
      id: 1,
      guestName: "Phạm Thị D",
      room: "Phòng Deluxe",
      checkIn: "2024-12-28 14:00",
      phone: "0987654321",
      guests: 2
    },
    {
      id: 2,
      guestName: "Hoàng Văn E",
      room: "Phòng Superior",
      checkIn: "2024-12-28 16:30",
      phone: "0976543210",
      guests: 4
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#C599B6' }}>
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Chào mừng trở lại! Đây là tổng quan hoạt động của KatHome In Town .
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">15</div>
                <div className="text-sm text-gray-500">Check In</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-500">Check Out</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bed className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-500">Có sẵn</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-500">Đã đặt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ color: '#C599B6' }}>
              <Calendar className="w-5 h-5" />
              <span>Đặt phòng gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-white/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium" style={{ color: '#C599B6' }}>
                        {booking.guestName}
                      </h4>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm opacity-80 mb-1" style={{ color: '#C599B6' }}>
                      {booking.room}
                    </p>
                    <p className="text-sm opacity-60" style={{ color: '#C599B6' }}>
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: '#C599B6' }}>
                      {formatPrice(booking.total)}
                    </p>
                    <p className="text-xs opacity-60" style={{ color: '#C599B6' }}>
                      {booking.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Check-ins */}
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ color: '#C599B6' }}>
              <Clock className="w-5 h-5" />
              <span>Khách nhận phòng hôm nay</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingCheckIns.map((checkin) => (
                <div key={checkin.id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/50">
                  <div className="p-2 rounded-full" style={{ backgroundColor: '#C599B6' }}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium" style={{ color: '#C599B6' }}>
                      {checkin.guestName}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
                      {checkin.room} • {checkin.guests} khách
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm opacity-60" style={{ color: '#C599B6' }}>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{checkin.checkIn}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{checkin.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingCheckIns.length === 0 && (
                <div className="text-center py-8 opacity-60" style={{ color: '#C599B6' }}>
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>Không có khách nhận phòng hôm nay</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full inline-flex mb-4" style={{ backgroundColor: '#C599B6' }}>
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#C599B6' }}>
              {stats.averageRating}/5
            </h3>
            <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
              Đánh giá trung bình
            </p>
            <p className="text-xs opacity-60 mt-1" style={{ color: '#C599B6' }}>
              Từ 127 đánh giá
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full inline-flex mb-4" style={{ backgroundColor: '#C599B6' }}>
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#C599B6' }}>
              98%
            </h3>
            <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
              Tỷ lệ xác nhận
            </p>
            <p className="text-xs opacity-60 mt-1" style={{ color: '#C599B6' }}>
              Booking được xác nhận
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
          <CardContent className="p-6 text-center">
            <div className="p-3 rounded-full inline-flex mb-4" style={{ backgroundColor: '#C599B6' }}>
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#C599B6' }}>
              2%
            </h3>
            <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
              Tỷ lệ hủy phòng
            </p>
            <p className="text-xs opacity-60 mt-1" style={{ color: '#C599B6' }}>
              Booking bị hủy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

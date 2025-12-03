'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/badge/badge';
import { useAuth } from '../../contexts/AuthContext';
import { ApiBooking } from '../../types/api';
import { useApi } from '../../hooks/useApi';
import { donDatPhongApi } from '../../lib/api';
import { 
  Calendar, 
  Users, 
  AlertCircle,
  ArrowLeft,
  Building2,
  Bed
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch bookings using useApi hook (consistent with admin pages)
  const { data: bookingsData, loading, error } = useApi<ApiBooking[]>(
    () => {
      if (!user?.gmail) {
        return Promise.resolve([]);
      }
      return donDatPhongApi.getByEmail(user.gmail);
    },
    [user?.gmail]
  );

  // Ensure bookings is always an array
  const bookings = bookingsData || [];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      'R': { label: 'Đã đặt', variant: 'outline', color: '#3B82F6' },
      'CF': { label: 'Đã xác nhận', variant: 'default', color: '#10B981' },
      'CC': { label: 'Đã hoàn thành', variant: 'default', color: '#6B7280' },
      'AB': { label: 'Đã hủy', variant: 'destructive', color: '#EF4444' },
    };

    const statusInfo = statusMap[status] || { label: status, variant: 'outline', color: '#6B7280' };
    
    return (
      <Badge 
        variant={statusInfo.variant}
        style={{ backgroundColor: statusInfo.variant === 'default' ? statusInfo.color : undefined }}
      >
        {statusInfo.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    const statusMap: Record<string, { label: string; bgColor: string; textColor: string }> = {
      'pending': { label: 'Chờ thanh toán', bgColor: '#FEF3C7', textColor: '#92400E' },
      'waiting_confirmation': { label: 'Chờ xác nhận', bgColor: '#DBEAFE', textColor: '#1E40AF' },
      'paid': { label: 'Đã thanh toán', bgColor: '#DCFCE7', textColor: '#166534' },
      'failed': { label: 'Thanh toán thất bại', bgColor: '#FEE2E2', textColor: '#991B1B' },
    };

    const status = paymentStatus?.toLowerCase() || 'pending';
    const statusInfo = statusMap[status] || { label: status, bgColor: '#F3F4F6', textColor: '#374151' };
    
    return (
      <Badge style={{ backgroundColor: statusInfo.bgColor, color: statusInfo.textColor, border: 'none' }}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price?: number | null) => {
    if (price == null || isNaN(Number(price))) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(Number(price)) + 'đ';
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: '#82213D' }}>
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600 mt-2">
              Lịch sử đặt phòng của bạn
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" style={{ color: '#82213D' }}>
                <Users className="w-5 h-5" />
                <span>Thông tin tài khoản</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên đăng nhập</p>
                  <p className="font-semibold" style={{ color: '#82213D' }}>{user.taiKhoan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold" style={{ color: '#82213D' }}>{user.gmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings History */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" style={{ color: '#82213D' }}>
                <Calendar className="w-5 h-5" />
                <span>Lịch sử đặt phòng ({bookings.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#82213D' }}></div>
                  <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <p className="text-red-500">{error}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Bạn chưa có đơn đặt phòng nào</p>
                  <Link href="/">
                    <Button className="mt-4" style={{ backgroundColor: '#82213D' }}>
                      Đặt phòng ngay
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.maDatPhong} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          {/* Left: Booking Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold" style={{ color: '#82213D' }}>
                                    Đơn #{booking.maDatPhong}
                                  </h3>
                                  {getStatusBadge(booking.trangThai)}
                                </div>
                                <p className="text-sm text-gray-600">
                                  Đặt ngày: {formatDate(booking.ngayDat)}
                                </p>
                              </div>
                            </div>

                            {/* Co So Info */}
                            {booking.coSo && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Building2 className="w-4 h-4" style={{ color: '#82213D' }} />
                                <span className="font-medium">{booking.coSo.tenCoSo}</span>
                              </div>
                            )}

                            {/* Room Details */}
                            {booking.chiTiet && booking.chiTiet.length > 0 && (
                              <div className="space-y-2">
                                {booking.chiTiet.map((chiTiet) => (
                                  <div key={chiTiet.maChiTiet} className="flex items-start space-x-2 text-sm">
                                    <Bed className="w-4 h-4 mt-0.5" style={{ color: '#82213D' }} />
                                    <div>
                                      <p className="font-medium">
                                        {chiTiet.phong?.tenPhong || chiTiet.phong?.moTa || 'Phòng không xác định'}
                                      </p>
                                      <p className="text-gray-600">
                                        {formatDate(chiTiet.checkInDate)} - {formatDate(chiTiet.checkOutDate)}
                                      </p>
                                      <p className="text-gray-600">
                                        {chiTiet.soNguoiLon} người lớn, {chiTiet.soTreEm} trẻ em
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Nhận phòng</p>
                                <p className="font-medium">{formatDate(booking.checkinDuKien)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Trả phòng</p>
                                <p className="font-medium">{formatDate(booking.checkoutDuKien)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Right: Payment Info */}
                          <div className="md:w-64 space-y-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                              <p className="text-xl font-bold" style={{ color: '#82213D' }}>
                                {formatPrice(booking.totalAmount)}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</p>
                              {getPaymentStatusBadge(booking.paymentStatus)}
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán</p>
                              <p className="text-sm font-medium">
                                {booking.paymentMethod === 'Card' ? '💳 Thẻ tín dụng' : 
                                 booking.paymentMethod === 'Cash' ? '💵 Tiền mặt' :
                                 booking.phuongThucThanhToan === 'Card' ? '💳 Thẻ tín dụng' :
                                 booking.phuongThucThanhToan === 'Cash' ? '💵 Tiền mặt' :
                                 booking.paymentMethod || booking.phuongThucThanhToan || 'Chưa xác định'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}


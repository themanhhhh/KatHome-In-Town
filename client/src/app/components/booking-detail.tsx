'use client';

import React from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Calendar, Users, Phone, Mail, MapPin, Bed, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ApiBooking } from '../../types/api';

interface BookingDetailProps {
  booking: ApiBooking;
  onClose: () => void;
}

const formatPrice = (price: number | undefined | null) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0đ';
  }
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const formatDate = (dateString: string | undefined) => {
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

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    CF: { label: 'Đã xác nhận', className: 'bg-green-100 text-green-800' },
    R: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-800' },
    AB: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    CC: { label: 'Hoàn thành', className: 'bg-blue-100 text-blue-800' }
  };
  
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'CF':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'R':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'AB':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'CC':
      return <CheckCircle className="w-5 h-5 text-blue-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

export function BookingDetail({ booking, onClose }: BookingDetailProps) {
  const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => 
    sum + (ct.soNguoiLon || 0) + (ct.soTreEm || 0), 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn đặt phòng</h2>
              <p className="text-sm text-gray-600 mt-1">Mã booking: {booking.maDatPhong}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(booking.trangThai)}
                {getStatusBadge(booking.trangThai)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin khách hàng */}
            <Card className="border border-gray-200">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Thông tin khách hàng</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium">
                      {booking.khachHang?.tenKhachHang || booking.khachHang?.ten || booking.customerName || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">
                        {booking.khachHang?.email || booking.customerEmail || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">
                        {booking.khachHang?.soDienThoai || booking.khachHang?.sdt || booking.customerPhone || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {booking.khachHang && 'diaChi' in booking.khachHang && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">{(booking.khachHang as { diaChi?: string }).diaChi || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Thông tin cơ sở và nhân viên */}
            <Card className="border border-gray-200">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Thông tin cơ sở</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tên cơ sở</p>
                    <p className="font-medium">{booking.coSo?.tenCoSo || 'N/A'}</p>
                  </div>
                  {booking.coSo && 'diaChi' in booking.coSo && (
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium">{(booking.coSo as { diaChi?: string }).diaChi || 'N/A'}</p>
                    </div>
                  )}
                  {booking.coSo && 'soDienThoai' in booking.coSo && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">{(booking.coSo as { soDienThoai?: string }).soDienThoai || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                  {booking.nhanVien && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Nhân viên phụ trách</p>
                      <p className="font-medium">
                        {booking.nhanVien.tenNhanVien || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Thông tin đặt phòng */}
            <Card className="border border-gray-200 md:col-span-2">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span>Thông tin đặt phòng</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium">{formatDate(booking.ngayDat)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-in dự kiến</p>
                    <p className="font-medium">{formatDate(booking.checkinDuKien)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out dự kiến</p>
                    <p className="font-medium">{formatDate(booking.checkoutDuKien)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng số khách</p>
                    <p className="font-medium flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{totalGuests} người</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chi tiết phòng */}
            <Card className="border border-gray-200 md:col-span-2">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <span>Chi tiết phòng</span>
                </h3>
                <div className="space-y-4">
                  {booking.chiTiet && booking.chiTiet.length > 0 ? (
                    booking.chiTiet.map((ct, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Phòng</p>
                            <p className="font-medium">
                              {ct.phong && 'tenPhong' in ct.phong 
                                ? (ct.phong as { tenPhong?: string }).tenPhong || ct.phong.moTa || 'N/A'
                                : (ct.phong?.moTa || 'N/A')}
                            </p>
                            {ct.phong?.maPhong && (
                              <p className="text-xs text-gray-400">Mã: {ct.phong.maPhong}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Ngày</p>
                            <p className="font-medium">
                              {formatDate(ct.checkInDate)} - {formatDate(ct.checkOutDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Số khách</p>
                            <p className="font-medium">
                              {ct.soNguoiLon || 0} người lớn, {ct.soTreEm || 0} trẻ em
                            </p>
                          </div>
                          {ct.donGia && (
                            <div>
                              <p className="text-sm text-gray-500">Đơn giá</p>
                              <p className="font-medium">{formatPrice(ct.donGia)}</p>
                            </div>
                          )}
                          {ct.thanhTien && (
                            <div>
                              <p className="text-sm text-gray-500">Thành tiền</p>
                              <p className="font-medium">{formatPrice(ct.thanhTien)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Không có thông tin phòng</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Thông tin thanh toán */}
            <Card className="border border-gray-200 md:col-span-2">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Thông tin thanh toán</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatPrice(booking.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                    <p className="font-medium">
                      {booking.phuongThucThanhToan || booking.paymentMethod || 'N/A'}
                    </p>
                  </div>
                  {booking.paymentStatus && (
                    <div>
                      <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                      <p className="font-medium">{booking.paymentStatus}</p>
                    </div>
                  )}
                  {booking.paymentRef && (
                    <div>
                      <p className="text-sm text-gray-500">Mã tham chiếu</p>
                      <p className="font-medium">{booking.paymentRef}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Ghi chú */}
            {booking.notes && (
              <Card className="border border-gray-200 md:col-span-2">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Ghi chú</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{booking.notes}</p>
                </div>
              </Card>
            )}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Đóng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


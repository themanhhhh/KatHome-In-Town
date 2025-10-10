'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { Alert, AlertDescription } from './alert/alert';
import { X, Save } from 'lucide-react';
import { ApiBooking, ApiCustomer, ApiRoom } from '../../types/api';  
import { donDatPhongApi, khachHangApi, phongApi } from '../../lib/api';

interface BookingFormProps {
  booking?: ApiBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingForm({ booking, onClose, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    ngayDat: '',
    ngayNhan: '',
    ngayTra: '',
    soLuongKhach: 1,
    tongTien: 0,
    trangThai: 'pending' as 'confirmed' | 'pending' | 'cancelled' | 'completed',
    phuongThucThanhToan: 'cash',
    ghiChu: '',
    maKhachHang: '',
    maPhong: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);

  useEffect(() => {
    // Load customers and rooms
    const loadData = async () => {
      try {
        const [customersData, roomsData] = await Promise.all([
          khachHangApi.getAll(),
          phongApi.getAll()
        ]);
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (booking) {
      setFormData({
        ngayDat: booking.ngayDat || '',
        ngayNhan: booking.ngayNhan || '',
        ngayTra: booking.ngayTra || '',
        soLuongKhach: booking.soLuongKhach || 1,
        tongTien: booking.tongTien || 0,
        trangThai: booking.trangThai || 'pending',
        phuongThucThanhToan: booking.phuongThucThanhToan || 'cash',
        ghiChu: booking.ghiChu || '',
        maKhachHang: booking.khachHang?.maKhachHang || '',
        maPhong: booking.phong?.maPhong || ''
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (booking) {
        // Update existing booking
        await donDatPhongApi.update(booking.maDonDatPhong, formData);
      } else {
        // Create new booking
        await donDatPhongApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalPrice = useCallback(() => {
    const selectedRoom = rooms.find(room => room.maPhong === formData.maPhong);
    if (selectedRoom && formData.ngayNhan && formData.ngayTra) {
      const checkIn = new Date(formData.ngayNhan);
      const checkOut = new Date(formData.ngayTra);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      // Since ApiRoom doesn't have giaPhong, use a default price
      const defaultPrice = 500000; // 500k VND per night
      const total = nights * defaultPrice;
      setFormData(prev => ({ ...prev, tongTien: total }));
    }
  }, [rooms, formData.maPhong, formData.ngayNhan, formData.ngayTra]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {booking ? 'Chỉnh sửa đặt phòng' : 'Thêm đặt phòng mới'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ngày đặt</label>
                <input
                  type="date"
                  value={formData.ngayDat}
                  onChange={(e) => setFormData({ ...formData, ngayDat: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày nhận phòng</label>
                <input
                  type="date"
                  value={formData.ngayNhan}
                  onChange={(e) => setFormData({ ...formData, ngayNhan: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày trả phòng</label>
                <input
                  type="date"
                  value={formData.ngayTra}
                  onChange={(e) => setFormData({ ...formData, ngayTra: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số lượng khách</label>
                <input
                  type="number"
                  min="1"
                  value={formData.soLuongKhach}
                  onChange={(e) => setFormData({ ...formData, soLuongKhach: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tổng tiền (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.tongTien}
                  onChange={(e) => setFormData({ ...formData, tongTien: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value as 'confirmed' | 'pending' | 'cancelled' | 'completed' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phương thức thanh toán</label>
                <select
                  value={formData.phuongThucThanhToan}
                  onChange={(e) => setFormData({ ...formData, phuongThucThanhToan: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="bank_transfer">Chuyển khoản</option>
                  <option value="credit_card">Thẻ tín dụng</option>
                  <option value="momo">MoMo</option>
                  <option value="zalopay">ZaloPay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Khách hàng</label>
                <select
                  value={formData.maKhachHang}
                  onChange={(e) => setFormData({ ...formData, maKhachHang: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map((customer) => (
                    <option key={customer.maKhachHang} value={customer.maKhachHang}>
                      {customer.tenKhachHang} - {customer.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phòng</label>
                <select
                  value={formData.maPhong}
                  onChange={(e) => setFormData({ ...formData, maPhong: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((room) => (
                    <option key={room.maPhong} value={room.maPhong}>
                      {room.moTa} - {room.hangPhong?.tenHangPhong} - 500,000đ/đêm
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ghi chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Ghi chú đặc biệt..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang lưu...' : (booking ? 'Cập nhật' : 'Tạo mới')}</span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

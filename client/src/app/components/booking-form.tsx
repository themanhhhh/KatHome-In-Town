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
    checkinDuKien: '',
    checkoutDuKien: '',
    soNguoiLon: 1,
    soTreEm: 0,
    totalAmount: 0,
    trangThai: 'R' as string, // R, CF, AB, CC
    phuongThucThanhToan: 'Cash',
    notes: '',
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
      const firstRoom = booking.chiTiet?.[0];
      const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soNguoiLon || 0), 0);
      const totalChildren = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soTreEm || 0), 0);
      
      setFormData({
        ngayDat: booking.ngayDat?.split('T')[0] || '',
        checkinDuKien: booking.checkinDuKien?.split('T')[0] || '',
        checkoutDuKien: booking.checkoutDuKien?.split('T')[0] || '',
        soNguoiLon: totalGuests || 1,
        soTreEm: totalChildren || 0,
        totalAmount: booking.totalAmount || 0,
        trangThai: booking.trangThai || 'R',
        phuongThucThanhToan: booking.phuongThucThanhToan || 'Cash',
        notes: booking.notes || '',
        maKhachHang: booking.khachHang?.maKhachHang || '',
        maPhong: firstRoom?.phong?.maPhong || ''
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
        await donDatPhongApi.update(booking.maDatPhong, formData);
      } else {
        // Create new booking - note: API expects different format
        // This is simplified, in reality you'd need to call the proper create endpoint
        // with the correct payload structure (coSoId, customerEmail, rooms array, etc.)
        setError('Chức năng tạo booking mới đang được phát triển. Vui lòng sử dụng trang booking của khách hàng.');
        setIsSubmitting(false);
        return;
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
    if (selectedRoom && formData.checkinDuKien && formData.checkoutDuKien) {
      const checkIn = new Date(formData.checkinDuKien);
      const checkOut = new Date(formData.checkoutDuKien);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      // Since ApiRoom doesn't have giaPhong, use a default price
      const defaultPrice = 500000; // 500k VND per night
      const total = nights * defaultPrice;
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [rooms, formData.maPhong, formData.checkinDuKien, formData.checkoutDuKien]);

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
                  value={formData.checkinDuKien}
                  onChange={(e) => setFormData({ ...formData, checkinDuKien: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày trả phòng</label>
                <input
                  type="date"
                  value={formData.checkoutDuKien}
                  onChange={(e) => setFormData({ ...formData, checkoutDuKien: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số người lớn</label>
                <input
                  type="number"
                  min="1"
                  value={formData.soNguoiLon}
                  onChange={(e) => setFormData({ ...formData, soNguoiLon: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số trẻ em</label>
                <input
                  type="number"
                  min="0"
                  value={formData.soTreEm}
                  onChange={(e) => setFormData({ ...formData, soTreEm: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tổng tiền (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="R">Chờ xác nhận</option>
                  <option value="CF">Đã xác nhận</option>
                  <option value="AB">Đã hủy</option>
                  <option value="CC">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phương thức thanh toán</label>
                <select
                  value={formData.phuongThucThanhToan}
                  onChange={(e) => setFormData({ ...formData, phuongThucThanhToan: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Cash">Tiền mặt</option>
                  <option value="Card">Thẻ</option>
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
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

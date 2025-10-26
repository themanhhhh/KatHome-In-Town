'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ApiBooking, ApiCustomer, ApiRoom, ApiCoSo, ApiNhanVien } from '../../types/api';  
import { donDatPhongApi, khachHangApi, phongApi, cosoApi, nhanVienApi } from '../../lib/api';
import { toast } from 'sonner';

interface BookingFormProps {
  booking?: ApiBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingForm({ booking, onClose, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    // Basic booking info
    ngayDat: '',
    checkinDuKien: '',
    checkoutDuKien: '',
    trangThai: 'R' as string, // R, CF, AB, CC
    phuongThucThanhToan: 'Cash',
    notes: '',
    
    // Required fields for creation
    coSoId: '',
    nhanVienId: '',
    customerEmail: '',
    customerPhone: '',
    customerName: '',
    
    // Room details
    rooms: [{
      roomId: '',
      checkIn: '',
      checkOut: '',
      adults: 1,
      children: 0,
      price: 0
    }],
    
    // Legacy fields for backward compatibility
    maKhachHang: '',
    maPhong: '',
    soNguoiLon: 1,
    soTreEm: 0,
    totalAmount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [cosos, setCosos] = useState<ApiCoSo[]>([]);
  const [nhanViens, setNhanViens] = useState<ApiNhanVien[]>([]);

  useEffect(() => {
    // Load all required data
    const loadData = async () => {
      try {
        const [customersData, roomsData, cososData, nhanViensData] = await Promise.all([
          khachHangApi.getAll(),
          phongApi.getAll(),
          cosoApi.getAll(),
          nhanVienApi.getAll()
        ]);
        setCustomers(Array.isArray(customersData) ? customersData : []);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setCosos(Array.isArray(cososData) ? cososData : []);
        setNhanViens(Array.isArray(nhanViensData) ? nhanViensData : []);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Lỗi khi tải dữ liệu', {
          description: 'Không thể tải danh sách khách hàng, phòng, cơ sở hoặc nhân viên.'
        });
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
        // Basic booking info
        ngayDat: booking.ngayDat?.split('T')[0] || '',
        checkinDuKien: booking.checkinDuKien?.split('T')[0] || '',
        checkoutDuKien: booking.checkoutDuKien?.split('T')[0] || '',
        trangThai: booking.trangThai || 'R',
        phuongThucThanhToan: booking.phuongThucThanhToan || 'Cash',
        notes: booking.notes || '',
        
        // Required fields for creation
        coSoId: booking.coSo?.maCoSo || '',
        nhanVienId: booking.nhanVien?.maNhanVien || '',
        customerEmail: booking.customerEmail || '',
        customerPhone: booking.customerPhone || '',
        customerName: booking.customerName || '',
        
        // Room details
        rooms: booking.chiTiet?.map(ct => ({
          roomId: ct.phong?.maPhong || '',
          checkIn: ct.checkInDate?.split('T')[0] || '',
          checkOut: ct.checkOutDate?.split('T')[0] || '',
          adults: ct.soNguoiLon || 1,
          children: ct.soTreEm || 0,
          price: ct.donGia || 0
        })) || [{
          roomId: '',
          checkIn: '',
          checkOut: '',
          adults: 1,
          children: 0,
          price: 0
        }],
        
        // Legacy fields for backward compatibility
        maKhachHang: booking.khachHang?.maKhachHang || '',
        maPhong: firstRoom?.phong?.maPhong || '',
        soNguoiLon: totalGuests || 1,
        soTreEm: totalChildren || 0,
        totalAmount: booking.totalAmount || 0
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (booking) {
        // Update existing booking
        await donDatPhongApi.update(booking.maDatPhong, formData);
        toast.success('Cập nhật đặt phòng thành công!', {
          description: `Đặt phòng đã được cập nhật thành công.`
        });
      } else {
        // Create new booking with proper format
        const bookingData = {
          coSoId: formData.coSoId,
          nhanVienId: formData.nhanVienId,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerName: formData.customerName,
          rooms: [{
            roomId: formData.maPhong || formData.rooms[0]?.roomId || '',
            checkIn: formData.checkinDuKien,
            checkOut: formData.checkoutDuKien,
            adults: formData.soNguoiLon,
            children: formData.soTreEm,
            price: formData.totalAmount
          }],
          notes: formData.notes
        };

        // Validate required fields
        if (!bookingData.coSoId || !bookingData.customerEmail || !bookingData.customerPhone || !bookingData.customerName || bookingData.rooms.length === 0) {
          toast.error('Thiếu thông tin bắt buộc', {
            description: 'Vui lòng điền đầy đủ thông tin cơ sở, khách hàng và phòng.'
          });
          setIsSubmitting(false);
          return;
        }

        // Validate dates
        if (!formData.checkinDuKien || !formData.checkoutDuKien) {
          toast.error('Thiếu thông tin ngày tháng', {
            description: 'Vui lòng chọn ngày nhận phòng và ngày trả phòng.'
          });
          setIsSubmitting(false);
          return;
        }

        const checkInDate = new Date(formData.checkinDuKien);
        const checkOutDate = new Date(formData.checkoutDuKien);
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
          toast.error('Ngày tháng không hợp lệ', {
            description: 'Vui lòng kiểm tra lại ngày nhận phòng và ngày trả phòng.'
          });
          setIsSubmitting(false);
          return;
        }
        
        if (checkOutDate <= checkInDate) {
          toast.error('Ngày trả phòng không hợp lệ', {
            description: 'Ngày trả phòng phải sau ngày nhận phòng.'
          });
          setIsSubmitting(false);
          return;
        }

        await donDatPhongApi.create(bookingData);
        toast.success('Tạo đặt phòng thành công!', {
          description: `Đặt phòng đã được tạo thành công.`
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý đặt phòng', {
        description: errorMessage
      });
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
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {booking ? 'Chỉnh sửa đặt phòng' : 'Thêm đặt phòng mới'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {booking ? 'Cập nhật thông tin đặt phòng hiện tại' : 'Nhập thông tin để tạo đặt phòng mới'}
              </p>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Required fields for creation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cơ sở <span className="text-red-500">*</span></label>
                <select
                  value={formData.coSoId}
                  onChange={(e) => setFormData({ ...formData, coSoId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Chọn cơ sở</option>
                  {cosos.map((coso) => (
                    <option key={coso.maCoSo} value={coso.maCoSo}>
                      {coso.tenCoSo} - {coso.diaChi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nhân viên</label>
                <select
                  value={formData.nhanVienId}
                  onChange={(e) => setFormData({ ...formData, nhanVienId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Chọn nhân viên</option>
                  {nhanViens.map((nv) => (
                    <option key={nv.maNhanVien} value={nv.maNhanVien}>
                      {nv.ten} - {nv.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email khách hàng <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại khách hàng <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0123456789"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên khách hàng <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Họ và tên khách hàng"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày đặt</label>
                <input
                  type="date"
                  value={formData.ngayDat}
                  onChange={(e) => setFormData({ ...formData, ngayDat: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Room booking details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày nhận phòng</label>
                <input
                  type="date"
                  value={formData.checkinDuKien}
                  onChange={(e) => setFormData({ ...formData, checkinDuKien: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày trả phòng</label>
                <input
                  type="date"
                  value={formData.checkoutDuKien}
                  onChange={(e) => setFormData({ ...formData, checkoutDuKien: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số người lớn</label>
                <input
                  type="number"
                  min="1"
                  value={formData.soNguoiLon}
                  onChange={(e) => setFormData({ ...formData, soNguoiLon: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số trẻ em</label>
                <input
                  type="number"
                  min="0"
                  value={formData.soTreEm}
                  onChange={(e) => setFormData({ ...formData, soTreEm: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tổng tiền (VNĐ)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={formData.trangThai}
                  onChange={(e) => setFormData({ ...formData, trangThai: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="R">Chờ xác nhận</option>
                  <option value="CF">Đã xác nhận</option>
                  <option value="AB">Đã hủy</option>
                  <option value="CC">Hoàn thành</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phương thức thanh toán</label>
                <select
                  value={formData.phuongThucThanhToan}
                  onChange={(e) => setFormData({ ...formData, phuongThucThanhToan: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="Cash">Tiền mặt</option>
                  <option value="Card">Thẻ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Khách hàng (Legacy)</label>
                <select
                  value={formData.maKhachHang}
                  onChange={(e) => setFormData({ ...formData, maKhachHang: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phòng (Legacy)</label>
                <select
                  value={formData.maPhong}
                  onChange={(e) => setFormData({ ...formData, maPhong: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="Ghi chú đặc biệt..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">
                  {isSubmitting ? 'Đang lưu...' : (booking ? 'Cập nhật đặt phòng' : 'Tạo đặt phòng mới')}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

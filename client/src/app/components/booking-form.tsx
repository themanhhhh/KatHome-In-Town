'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ApiBooking, ApiRoom, ApiCoSo, ApiNhanVien, ApiCustomer } from '../../types/api';  
import { donDatPhongApi, phongApi, cosoApi, nhanVienApi, khachHangApi } from '../../lib/api';
import { toast } from 'sonner';

interface BookingFormProps {
  booking?: ApiBooking | null;
  onClose: () => void;
  onSuccess: () => void;
}

const formatPrice = (value: number) => {
  if (!value) return "0 VND";
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
};

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
    khachHangId: '',
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
    maPhong: '',
    soNguoiLon: 1,
    soTreEm: 0,
    totalAmount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [cosos, setCosos] = useState<ApiCoSo[]>([]);
  const [nhanViens, setNhanViens] = useState<ApiNhanVien[]>([]);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);

  useEffect(() => {
    // Load all required data
    const loadData = async () => {
      try {
        const [roomsData, cososData, nhanViensData, customersData] = await Promise.all([
          phongApi.getAll(),
          cosoApi.getAll(),
          nhanVienApi.getAll(),
          khachHangApi.getAll()
        ]);
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setCosos(Array.isArray(cososData) ? cososData : []);
        setNhanViens(Array.isArray(nhanViensData) ? nhanViensData : []);
        setCustomers(Array.isArray(customersData) ? customersData as ApiCustomer[] : []);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Lỗi khi tải dữ liệu', {
          description: 'Không thể tải danh sách phòng, cơ sở hoặc nhân viên.'
        });
      }
    };
    loadData();
  }, []);

  // Effect: Tự điền form khi có booking và các danh sách đã load
  useEffect(() => {
    if (!booking) {
      // Reset form khi không có booking (tạo mới)
      setFormData({
        ngayDat: '',
        checkinDuKien: '',
        checkoutDuKien: '',
        trangThai: 'R',
        phuongThucThanhToan: 'Cash',
        notes: '',
        coSoId: '',
        nhanVienId: '',
        khachHangId: '',
        customerEmail: '',
        customerPhone: '',
        customerName: '',
        rooms: [{
          roomId: '',
          checkIn: '',
          checkOut: '',
          adults: 1,
          children: 0,
          price: 0
        }],
        maPhong: '',
        soNguoiLon: 1,
        soTreEm: 0,
        totalAmount: 0
      });
      return;
    }
    
    // Chỉ set khi đã có booking
    const firstRoom = booking.chiTiet?.[0];
    const totalGuests = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soNguoiLon || 0), 0);
    const totalChildren = (booking.chiTiet || []).reduce((sum, ct) => sum + (ct.soTreEm || 0), 0);
    
    // Get coSoId from booking - tự điền cơ sở
    const coSoId = booking.coSo?.maCoSo || '';
    
    // Get roomId from first chiTiet - tự điền phòng
    const maPhong = firstRoom?.phong?.maPhong || '';
    
    // Tự điền nhân viên từ booking
    const nhanVienId = booking.nhanVien?.maNhanVien || '';
    
    // Tự điền khách hàng từ booking
    const khachHangId = booking.khachHang?.maKhachHang || '';
    
    // Tìm khách hàng trong danh sách nếu đã load
    const selectedCustomer = customers.length > 0 && khachHangId 
      ? customers.find(c => c.maKhachHang === khachHangId)
      : null;
    
    // Lấy thông tin khách hàng từ booking hoặc từ danh sách
    const customerEmail = booking.customerEmail || booking.khachHang?.email || selectedCustomer?.email || '';
    const customerPhone = booking.customerPhone || booking.khachHang?.soDienThoai || booking.khachHang?.sdt || selectedCustomer?.soDienThoai || selectedCustomer?.sdt || '';
    const customerName = booking.customerName || booking.khachHang?.tenKhachHang || booking.khachHang?.ten || selectedCustomer?.tenKhachHang || selectedCustomer?.ten || '';
    
    // Set form data - ưu tiên giá trị từ booking, không fallback về prev nếu booking có giá trị
    setFormData({
      // Basic booking info
      ngayDat: booking.ngayDat?.split('T')[0] || '',
      checkinDuKien: booking.checkinDuKien?.split('T')[0] || '',
      checkoutDuKien: booking.checkoutDuKien?.split('T')[0] || '',
      trangThai: booking.trangThai || 'R',
      phuongThucThanhToan: booking.phuongThucThanhToan || booking.paymentMethod || 'Cash',
      notes: booking.notes || '',
      
      // Tự điền đầy đủ thông tin cơ sở, nhân viên, khách hàng - set trực tiếp từ booking
      coSoId: coSoId,
      nhanVienId: nhanVienId,
      khachHangId: khachHangId,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerName: customerName,
      
      // Room details
      rooms: booking.chiTiet && booking.chiTiet.length > 0 ? booking.chiTiet.map(ct => ({
        roomId: ct.phong?.maPhong || '',
        checkIn: ct.checkInDate?.split('T')[0] || '',
        checkOut: ct.checkOutDate?.split('T')[0] || '',
        adults: ct.soNguoiLon || 1,
        children: ct.soTreEm || 0,
        price: ct.donGia || 0
      })) : [{
        roomId: '',
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        price: 0
      }],
      
      // Legacy fields for backward compatibility
      maPhong: maPhong,
      soNguoiLon: totalGuests > 0 ? totalGuests : 1,
      soTreEm: totalChildren > 0 ? totalChildren : 0,
      totalAmount: booking.totalAmount || 0
    });
  }, [booking, customers]);

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
          khachHangId: formData.khachHangId || undefined,
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
        if (!bookingData.coSoId || !bookingData.khachHangId || !bookingData.customerEmail || !bookingData.customerPhone || !bookingData.customerName || bookingData.rooms.length === 0) {
          toast.error('Thiếu thông tin bắt buộc', {
            description: 'Vui lòng chọn khách hàng từ danh sách, điền đầy đủ thông tin cơ sở và phòng.'
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

    // Chỉ tính khi đã chọn phòng và đủ ngày nhận/trả phòng
    if (!selectedRoom || !formData.checkinDuKien || !formData.checkoutDuKien) {
      return;
    }

      const checkIn = new Date(formData.checkinDuKien);
      const checkOut = new Date(formData.checkoutDuKien);
    const diffTime = checkOut.getTime() - checkIn.getTime();

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || diffTime <= 0) {
      return;
    }

    const nights = Math.max(
      1,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    );

    // Lấy giá thực tế của phòng (ưu tiên đơn giá qua đêm)
    const pricePerNight = selectedRoom.donGiaQuaDem || selectedRoom.donGia4h || 0;
    const total = nights * pricePerNight;

      setFormData(prev => ({ ...prev, totalAmount: total }));
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
                  onChange={(e) => {
                    const newCoSoId = e.target.value;
                    // Reset phòng đã chọn nếu phòng đó không thuộc cơ sở mới
                    const selectedRoom = rooms.find(r => r.maPhong === formData.maPhong);
                    const shouldResetRoom = newCoSoId && selectedRoom && selectedRoom.coSo?.maCoSo !== newCoSoId;
                    
                    setFormData({ 
                      ...formData, 
                      coSoId: newCoSoId,
                      maPhong: shouldResetRoom ? '' : formData.maPhong
                    });
                  }}
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
                  {nhanViens
                    // Ẩn các bản ghi nhân viên không có tên và email
                    .filter((nv) => (nv.ten && nv.ten.trim()) || (nv.email && nv.email.trim()))
                    .map((nv) => {
                      const hasEmail = nv.email && nv.email.trim().length > 0;
                      const label = hasEmail
                        ? `${nv.ten || nv.email} - ${nv.email}`
                        : nv.ten || nv.maNhanVien;
                      return (
                    <option key={nv.maNhanVien} value={nv.maNhanVien}>
                          {label}
                    </option>
                      );
                    })}
                </select>
              </div>

              {/* Chọn khách hàng từ danh sách đã quản lý */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Khách hàng <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.khachHangId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    const selected = customers.find((c) => c.maKhachHang === newId);
                    setFormData((prev) => ({
                      ...prev,
                      khachHangId: newId,
                      customerEmail: selected?.email || '',
                      customerPhone: selected?.soDienThoai || selected?.sdt || '',
                      customerName: selected?.tenKhachHang || selected?.ten || '',
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map((kh) => {
                    const name = kh.tenKhachHang || kh.ten;
                    const phone = kh.soDienThoai || kh.sdt;
                    return (
                      <option key={kh.maKhachHang} value={kh.maKhachHang}>
                        {name} - {phone}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Muốn thêm khách mới? Vào màn hình <strong>Quản lý khách hàng</strong> để tạo trước.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email khách hàng <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  readOnly
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
                  readOnly
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
                  readOnly
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tổng tiền (VNĐ)
                </label>
                <input
                  type="text"
                  value={formatPrice(formData.totalAmount)}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tự động tính theo số đêm và giá phòng đã chọn
                </p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phòng <span className="text-red-500">*</span></label>
                <select
                  value={formData.maPhong}
                  onChange={(e) => setFormData({ ...formData, maPhong: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                  disabled={!formData.coSoId}
                >
                  <option value="">
                    {formData.coSoId ? 'Chọn phòng' : 'Vui lòng chọn cơ sở trước'}
                  </option>
                  {rooms
                    .filter(room => {
                      // Chỉ hiển thị phòng thuộc cơ sở đã chọn
                      if (!formData.coSoId) return false;
                      return room.coSo?.maCoSo === formData.coSoId;
                    })
                    .map((room) => (
                    <option key={room.maPhong} value={room.maPhong}>
                        {formatPrice(room.donGiaQuaDem || room.donGia4h || 0)}/đêm
                    </option>
                  ))}
                </select>
                {!formData.coSoId && (
                  <p className="text-sm text-gray-500 mt-1">Vui lòng chọn cơ sở trước khi chọn phòng</p>
                )}
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

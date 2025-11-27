// API Response Types
export interface ApiRoom {
  maPhong: string;
  tenPhong: string;
  moTa: string;
  sucChua: number;
  donGia4h: number;
  donGiaQuaDem: number;
  hinhAnh?: string;
  status?: string; // 'available', 'maintenance', 'blocked', 'booked'
  coSo?: {
    maCoSo: string;
    tenCoSo: string;
    hinhAnh?: string;
  };
}

export interface ApiBooking {
  maDatPhong: string;
  ngayDat: string;
  ngayXacNhan?: string;
  ngayHuy?: string;
  checkinDuKien: string;
  checkoutDuKien: string;
  totalAmount?: number;
  trangThai: string; // "R" (Reserved), "CF" (Confirmed), "CC" (Checked-out/Completed), "AB" (Aborted/Cancelled)
  phuongThucThanhToan?: string; // "Card" or "Cash"
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  notes?: string;
  bookingSource?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentRef?: string;
  paidAt?: string;
  totalPaid?: number;
  otpCode?: string;
  otpExpiry?: string;
  isVerified?: boolean;
  khachHang?: {
    maKhachHang: string;
    ten: string;  // Field name from entity
    tenKhachHang?: string;  // Optional for backward compatibility
    email: string;
    sdt: string;  // Field name from entity
    soDienThoai?: string;  // Optional for backward compatibility
  };
  coSo?: {
    maCoSo: string;
    tenCoSo: string;
    hinhAnh?: string;
  };
  nhanVien?: {
    maNhanVien: string;
    tenNhanVien: string;
  };
  chiTiet?: Array<{
    maChiTiet: string;
    phong?: {
      maPhong: string;
      moTa: string;
      hinhAnh?: string;
    };
    soNguoiLon: number;
    soTreEm: number;
    checkInDate: string;
    checkOutDate: string;
    donGia?: number;
    thanhTien?: number;
    trangThai: string;
    actualCheckInTime?: string;
    actualCheckOutTime?: string;
  }>;
}

export interface ApiUser {
  id: string;
  taiKhoan: string;
  gmail: string;
  vaiTro: string;
  soDienThoai?: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  // Thông tin nhân viên (nếu có)
  maNhanVien?: string;
  ten?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
  maSoThue?: string;
  ngayBatDau?: string;
  ngayNghi?: string;
  hinhAnh?: string;
  chucVu?: {
    maChucVu: string;
    tenChucVu: string;
  };
}

export interface ApiNhanVien {
  maNhanVien: string;
  ten: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  email: string;
  sdt: string;
  maSoThue: string;
  ngayBatDau: string;
  ngayNghi?: string;
  hinhAnh?: string;
  chucVu?: {
    maChucVu: string;
    tenChucVu: string;
    moTa?: string;
  };
}

export interface ApiCustomer {
  maKhachHang: string;
  // Tên và SĐT chuẩn theo entity KhachHang
  ten: string;       // field chính từ backend
  sdt: string;       // field chính từ backend
  // Các tên cũ dùng cho tương thích ngược, nếu backend có map khác
  tenKhachHang?: string;
  soDienThoai?: string;
  email: string;
  diaChi?: string;
  ngayTao?: string;
}

export interface ApiRoomType {
  maHangPhong: string;
  tenHangPhong: string;
  sucChua: number;
  hinhAnh?: string;
}

export interface ApiCoSo {
  maCoSo: string;
  tenCoSo: string;
  diaChi?: string;
  soDienThoai: string;
  email?: string;
  moTa?: string;
  hinhAnh?: string;
  trangThai?: string; // 'active', 'inactive', 'maintenance'
}

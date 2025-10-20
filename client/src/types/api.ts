// API Response Types
export interface ApiRoom {
  maPhong: string;
  moTa: string;
  hinhAnh?: string;
  hangPhong?: {
    maHangPhong: string;
    tenHangPhong: string;
    sucChua: number;
    hinhAnh?: string;
  };
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
    tenKhachHang: string;
    email: string;
    soDienThoai: string;
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
  id: number;
  taiKhoan: string;
  email: string;
  vaiTro: string;
  avatar?: string;
  trangThai: 'active' | 'inactive' | 'banned';
  ngayTao: string;
  lanDangNhapCuoi?: string;
}

export interface ApiCustomer {
  maKhachHang: string;
  tenKhachHang: string;
  email: string;
  soDienThoai: string;
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
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  hinhAnh?: string;
}

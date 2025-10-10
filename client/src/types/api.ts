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
  maDonDatPhong: string;
  ngayDat: string;
  ngayNhan: string;
  ngayTra: string;
  soLuongKhach: number;
  tongTien: number;
  trangThai: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  phuongThucThanhToan: string;
  ghiChu?: string;
  khachHang?: {
    maKhachHang: string;
    tenKhachHang: string;
    email: string;
    soDienThoai: string;
  };
  phong?: {
    maPhong: string;
    moTa: string;
  };
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

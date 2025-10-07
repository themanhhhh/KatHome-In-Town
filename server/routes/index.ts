import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { CoSoController } from '../controllers/CoSoController';
import { HangPhongController } from '../controllers/HangPhongController';
import { PhongController } from '../controllers/PhongController';
import { KhachHangController } from '../controllers/KhachHangController';
import { NhanVienController } from '../controllers/NhanVienController';
import { ChucVuController } from '../controllers/ChucVuController';
import { DichVuController } from '../controllers/DichVuController';
import { DonDatPhongController } from '../controllers/DonDatPhongController';
import { ChiTietDonDatPhongController } from '../controllers/ChiTietDonDatPhongController';
import { DonGiaController } from '../controllers/DonGiaController';
import { DonDatDichVuController } from '../controllers/DonDatDichVuController';
import { CaLamController } from '../controllers/CaLamController';
import { DangKyCaLamController } from '../controllers/DangKyCaLamController';
import { TheoDoiCaLamController } from '../controllers/TheoDoiCaLamController';
import { KhieuNaiController } from '../controllers/KhieuNaiController';

const router = Router();

// ========== AUTH ROUTES ==========
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/verify-email', AuthController.verifyEmail);
router.post('/auth/resend-verification', AuthController.resendVerification);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);
router.get('/auth/me', AuthController.getCurrentUser);

// User routes
router.get('/users', UserController.getAll);
router.get('/users/:id', UserController.getById);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

// CoSo routes
router.get('/coso', CoSoController.getAll);
router.get('/coso/:id', CoSoController.getById);
router.post('/coso', CoSoController.create);
router.put('/coso/:id', CoSoController.update);
router.delete('/coso/:id', CoSoController.delete);

// HangPhong routes
router.get('/hangphong', HangPhongController.getAll);
router.get('/hangphong/:id', HangPhongController.getById);
router.post('/hangphong', HangPhongController.create);
router.put('/hangphong/:id', HangPhongController.update);
router.delete('/hangphong/:id', HangPhongController.delete);

// Phong routes
router.get('/phong', PhongController.getAll);
router.get('/phong/:id', PhongController.getById);
router.post('/phong', PhongController.create);
router.put('/phong/:id', PhongController.update);
router.delete('/phong/:id', PhongController.delete);
router.get('/availability', PhongController.searchAvailability);

// KhachHang routes
router.get('/khachhang', KhachHangController.getAll);
router.get('/khachhang/:id', KhachHangController.getById);
router.post('/khachhang', KhachHangController.create);
router.put('/khachhang/:id', KhachHangController.update);
router.delete('/khachhang/:id', KhachHangController.delete);

// NhanVien routes
router.get('/nhanvien', NhanVienController.getAll);
router.get('/nhanvien/:id', NhanVienController.getById);
router.post('/nhanvien', NhanVienController.create);
router.put('/nhanvien/:id', NhanVienController.update);
router.delete('/nhanvien/:id', NhanVienController.delete);

// ChucVu routes
router.get('/chucvu', ChucVuController.getAll);
router.get('/chucvu/:id', ChucVuController.getById);
router.post('/chucvu', ChucVuController.create);
router.put('/chucvu/:id', ChucVuController.update);
router.delete('/chucvu/:id', ChucVuController.delete);

// DichVu routes
router.get('/dichvu', DichVuController.getAll);
router.get('/dichvu/:id', DichVuController.getById);
router.post('/dichvu', DichVuController.create);
router.put('/dichvu/:id', DichVuController.update);
router.delete('/dichvu/:id', DichVuController.delete);

// DonDatPhong routes
router.get('/dondatphong', DonDatPhongController.getAll);
router.get('/dondatphong/:id', DonDatPhongController.getById);
router.post('/dondatphong', DonDatPhongController.create);
router.put('/dondatphong/:id', DonDatPhongController.update);
router.delete('/dondatphong/:id', DonDatPhongController.delete);

// ChiTietDonDatPhong routes
router.get('/chitietdondatphong', ChiTietDonDatPhongController.getAll);
router.get('/chitietdondatphong/:id', ChiTietDonDatPhongController.getById);
router.post('/chitietdondatphong', ChiTietDonDatPhongController.create);
router.put('/chitietdondatphong/:id', ChiTietDonDatPhongController.update);
router.delete('/chitietdondatphong/:id', ChiTietDonDatPhongController.delete);

// DonGia routes (composite key: maHangPhong + donViTinh)
router.get('/dongia', DonGiaController.getAll);
router.get('/dongia/:maHangPhong/:donViTinh', DonGiaController.getById);
router.post('/dongia', DonGiaController.create);
router.put('/dongia/:maHangPhong/:donViTinh', DonGiaController.update);
router.delete('/dongia/:maHangPhong/:donViTinh', DonGiaController.delete);

// DonDatDichVu routes
router.get('/dondatdichvu', DonDatDichVuController.getAll);
router.get('/dondatdichvu/:id', DonDatDichVuController.getById);
router.post('/dondatdichvu', DonDatDichVuController.create);
router.put('/dondatdichvu/:id', DonDatDichVuController.update);
router.delete('/dondatdichvu/:id', DonDatDichVuController.delete);

// CaLam routes
router.get('/calam', CaLamController.getAll);
router.get('/calam/:id', CaLamController.getById);
router.post('/calam', CaLamController.create);
router.put('/calam/:id', CaLamController.update);
router.delete('/calam/:id', CaLamController.delete);

// DangKyCaLam routes
router.get('/dangkycalam', DangKyCaLamController.getAll);
router.get('/dangkycalam/:id', DangKyCaLamController.getById);
router.post('/dangkycalam', DangKyCaLamController.create);
router.put('/dangkycalam/:id', DangKyCaLamController.update);
router.delete('/dangkycalam/:id', DangKyCaLamController.delete);

// TheoDoiCaLam routes
router.get('/theodoicalam', TheoDoiCaLamController.getAll);
router.get('/theodoicalam/:id', TheoDoiCaLamController.getById);
router.post('/theodoicalam', TheoDoiCaLamController.create);
router.put('/theodoicalam/:id', TheoDoiCaLamController.update);
router.delete('/theodoicalam/:id', TheoDoiCaLamController.delete);

// KhieuNai routes
router.get('/khieunai', KhieuNaiController.getAll);
router.get('/khieunai/:id', KhieuNaiController.getById);
router.post('/khieunai', KhieuNaiController.create);
router.put('/khieunai/:id', KhieuNaiController.update);
router.delete('/khieunai/:id', KhieuNaiController.delete);

export default router;


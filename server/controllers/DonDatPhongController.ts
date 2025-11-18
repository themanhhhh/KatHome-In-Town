import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { Revenue } from '../entities/Revenue';
import { BookingService } from '../services/BookingService';

const donDatPhongRepository = AppDataSource.getRepository(DonDatPhong);
const revenueRepository = AppDataSource.getRepository(Revenue);

export class DonDatPhongController {
  static async getAll(req: Request, res: Response) {
    try {
      console.log('🔍 Fetching all bookings...');
      
      // Try without relations first to see if that's the issue
      const donDatPhongs = await donDatPhongRepository.find({
        order: {
          ngayDat: 'DESC' // Sắp xếp theo ngày đặt mới nhất
        }
      });
      
      console.log(`📊 Found ${donDatPhongs.length} bookings`);
      console.log('📋 Sample booking:', donDatPhongs[0]?.maDatPhong);
      
      res.json(donDatPhongs);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const donDatPhong = await donDatPhongRepository.findOne({
        where: { maDatPhong: req.params.id },
        relations: ['coSo', 'nhanVien', 'khachHang', 'chiTiet', 'chiTiet.phong']
      });
      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      res.json(donDatPhong);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn đặt phòng', error });
    }
  }

  /**
   * Create a new booking
   * Body: {
   *   coSoId: string,
   *   khachHangId?: string,
   *   customerEmail: string,
   *   customerPhone: string,
   *   customerName: string,
   *   rooms: [{ roomId, checkIn, checkOut, adults, children, price }],
   *   notes?: string
   * }
   */
  static async create(req: Request, res: Response) {
    try {
      const { 
        coSoId, 
        khachHangId, 
        customerEmail, 
        customerPhone, 
        customerName,
        rooms, 
        notes 
      } = req.body;

      // Validation
      if (!coSoId || !customerEmail || !customerPhone || !customerName || !rooms || rooms.length === 0) {
        return res.status(400).json({ 
          message: 'Missing required fields: coSoId, customerEmail, customerPhone, customerName, rooms' 
        });
      }

      // Parse dates in rooms with validation
      const parsedRooms = rooms.map((room: any) => {
        const checkInDate = new Date(room.checkIn);
        const checkOutDate = new Date(room.checkOut);
        
        // Validate dates
        if (isNaN(checkInDate.getTime())) {
          throw new Error(`Invalid checkIn date: ${room.checkIn}`);
        }
        if (isNaN(checkOutDate.getTime())) {
          throw new Error(`Invalid checkOut date: ${room.checkOut}`);
        }
        if (checkOutDate <= checkInDate) {
          throw new Error('checkOut must be after checkIn');
        }
        
        return {
          ...room,
          checkIn: checkInDate,
          checkOut: checkOutDate,
        };
      });

      // Create booking using BookingService
      const booking = await BookingService.createBooking({
        coSoId,
        khachHangId,
        customerEmail,
        customerPhone,
        customerName,
        rooms: parsedRooms,
        notes,
        bookingSource: 'website',
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ 
        message: 'Lỗi khi tạo đơn đặt phòng', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const donDatPhong = await donDatPhongRepository.findOneBy({ maDatPhong: req.params.id });
      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      donDatPhongRepository.merge(donDatPhong, req.body);
      const result = await donDatPhongRepository.save(donDatPhong);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await donDatPhongRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      res.json({ message: 'Xóa đơn đặt phòng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đơn đặt phòng', error });
    }
  }

  /**
   * Finalize payment for a booking (chỉ nhân viên CSKH mới có thể gọi)
   * - Updates booking payment status
   * - Creates revenue record
   * - Creates HoaDon (Invoice)
   * - Uses transaction to ensure atomicity
   * 
   * Yêu cầu: req.user phải là nhân viên (có maNhanVien)
   */
  static async finalizePayment(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { bookingId } = req.params;
      const { totalAmount, paymentMethod, paymentRef, paidAt, ghiChu } = req.body;

      // Validate required fields
      if (!totalAmount || !paymentMethod) {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          success: false,
          message: 'totalAmount and paymentMethod are required'
        });
      }

      // Get booking with all relations
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['coSo', 'khachHang', 'chiTiet', 'chiTiet.phong']
      });

      if (!booking) {
        await queryRunner.rollbackTransaction();
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Validate booking status (should not be already paid)
      if (booking.paymentStatus === 'paid') {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          success: false,
          message: 'Booking is already paid'
        });
      }

      // Get staff user (nhan viên CSKH)
      const nhanVien = req.user;
      if (!nhanVien || !nhanVien.maNhanVien) {
        await queryRunner.rollbackTransaction();
        return res.status(403).json({
          success: false,
          message: 'Chỉ nhân viên CSKH mới có thể xác nhận thanh toán'
        });
      }

      const paidDate = paidAt ? new Date(paidAt) : new Date();

      // Update booking payment fields
      booking.paymentStatus = 'paid';
      booking.paymentMethod = paymentMethod;
      booking.paymentRef = paymentRef || null;
      booking.paidAt = paidDate;
      booking.totalPaid = totalAmount;
      booking.trangThai = 'CF'; // Confirmed
      booking.ngayXacNhan = paidDate;
      booking.nhanVien = nhanVien; // Gán nhân viên đã xác nhận

      await queryRunner.manager.save(DonDatPhong, booking);

      // Create revenue record
      const revenue = queryRunner.manager.create(Revenue, {
        donDatPhong: booking,
        amount: totalAmount,
        paymentMethod,
        paymentDate: paidDate,
        paymentRef: paymentRef || null
      });

      await queryRunner.manager.save(Revenue, revenue);

      // Create HoaDon (Invoice)
      const { HoaDon } = await import('../entities/HoaDon');
      const hoaDonRepo = queryRunner.manager.getRepository(HoaDon);
      const hoaDonCount = await hoaDonRepo.count();
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const maHoaDon = `HD-${today}-${String(hoaDonCount + 1).padStart(4, '0')}`;

      const hoaDon = hoaDonRepo.create({
        maHoaDon,
        donDatPhong: booking,
        tongTien: totalAmount,
        phuongThucThanhToan: paymentMethod,
        paymentRef: paymentRef || null,
        nhanVien: nhanVien,
        ngayThanhToan: paidDate,
        ghiChu: ghiChu || null
      });

      await queryRunner.manager.save(HoaDon, hoaDon);

      // Commit transaction
      await queryRunner.commitTransaction();

      return res.json({
        success: true,
        message: 'Thanh toán đã được xác nhận và hóa đơn đã được tạo',
        data: {
          booking: {
            maDatPhong: booking.maDatPhong,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            totalPaid: booking.totalPaid,
            paidAt: booking.paidAt
          },
          hoaDon: {
            id: hoaDon.id,
            maHoaDon: hoaDon.maHoaDon,
            tongTien: hoaDon.tongTien,
            phuongThucThanhToan: hoaDon.phuongThucThanhToan,
            ngayThanhToan: hoaDon.ngayThanhToan,
            nhanVien: {
              maNhanVien: nhanVien.maNhanVien,
              ten: nhanVien.ten
            }
          },
          revenue: {
            id: revenue.id,
            amount: revenue.amount,
            paymentMethod: revenue.paymentMethod,
            paymentDate: revenue.paymentDate
          }
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error finalizing payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xác nhận thanh toán',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * User xác nhận đã chuyển khoản
   * Chỉ cập nhật trạng thái thành "waiting_confirmation" - chờ nhân viên xác nhận
   */
  static async confirmPayment(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { paymentMethod = 'Bank Transfer', paymentRef } = req.body;

      const donDatPhongRepo = AppDataSource.getRepository(DonDatPhong);
      const booking = await donDatPhongRepo.findOne({
        where: { maDatPhong: bookingId },
        relations: ['coSo', 'khachHang', 'chiTiet']
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt phòng'
        });
      }

      if (booking.paymentStatus === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Đơn đặt phòng đã được thanh toán'
        });
      }

      // Cập nhật trạng thái chờ xác nhận
      booking.paymentStatus = 'waiting_confirmation';
      booking.paymentMethod = paymentMethod;
      booking.paymentRef = paymentRef || null;
      
      await donDatPhongRepo.save(booking);

      res.json({
        success: true,
        message: 'Đã ghi nhận. Vui lòng đợi nhân viên xác nhận thanh toán.',
        data: {
          maDatPhong: booking.maDatPhong,
          paymentStatus: booking.paymentStatus,
          message: 'Chúng tôi sẽ xác nhận trong vòng 5-10 phút'
        },
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xác nhận thanh toán',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check-in booking
   */
  static async checkIn(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.checkIn(bookingId);

      res.json({
        success: true,
        message: 'Checked in successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Error checking in:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi check-in',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Check-out booking
   */
  static async checkOut(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.checkOut(bookingId);

      res.json({
        success: true,
        message: 'Checked out successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Error checking out:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi check-out',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.cancelBooking(bookingId);

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi hủy đặt phòng',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get confirmation slip with QR codes
   * Trả về thông tin booking + QR code chuyển khoản
   */
  static async getConfirmationSlip(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;

      const booking = await donDatPhongRepository.findOne({
        where: { maDatPhong: bookingId },
        relations: ['coSo', 'khachHang', 'chiTiet', 'chiTiet.phong']
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt phòng'
        });
      }

      // Lấy thông tin QR code từ ảnh có sẵn
      const { QRCodeService } = await import('../services/QRCodeService');
      const paymentInfo = QRCodeService.getPaymentInfo(booking);

      // Format confirmation slip data
      const confirmationSlip = {
        maDatPhong: booking.maDatPhong,
        ngayDat: booking.ngayDat,
        trangThai: booking.trangThai,
        paymentStatus: booking.paymentStatus,
        expiresAt: booking.expiresAt, // Thời gian hết hạn
        
        thongTinKhachHang: {
          ten: booking.customerName || booking.khachHang?.ten,
          email: booking.customerEmail || booking.khachHang?.email,
          soDienThoai: booking.customerPhone || booking.khachHang?.sdt
        },
        
        thongTinCoSo: {
          tenCoSo: booking.coSo?.tenCoSo,
          diaChi: booking.coSo?.diaChi,
          soDienThoai: booking.coSo?.soDienThoai
        },
        
        thongTinPhong: booking.chiTiet?.map(ct => ({
          maPhong: ct.phong?.maPhong,
          tenPhong: ct.phong?.tenPhong,
          checkIn: ct.checkInDate,
          checkOut: ct.checkOutDate,
          soNguoiLon: ct.soNguoiLon,
          soTreEm: ct.soTreEm,
          donGia: ct.donGia,
          thanhTien: ct.thanhTien
        })) || [],
        
        // Chi tiết giá
        chiTietGia: {
          giaGoc: booking.basePrice,
          phiMuaCaoDiem: booking.seasonalSurcharge,
          phiNguoiThem: booking.guestSurcharge,
          VAT: booking.vatAmount,
          giamGia: booking.discount,
          maKhuyenMai: booking.promotionCode,
          tongCong: booking.totalAmount,
        },
        
        // QR code chuyển khoản (đường dẫn ảnh)
        qrCodeUrl: paymentInfo.qrCodeUrl,
        
        // Thông tin chuyển khoản
        thongTinChuyenKhoan: booking.paymentStatus === 'pending' || booking.paymentStatus === 'waiting_confirmation' ? {
          nganHang: paymentInfo.nganHang,
          soTaiKhoan: paymentInfo.soTaiKhoan,
          chuTaiKhoan: paymentInfo.chuTaiKhoan,
          soTien: paymentInfo.soTien,
          noiDung: paymentInfo.noiDung,
          ghiChu: 'Vui lòng chuyển khoản đúng nội dung để được xác nhận tự động'
        } : null,
        
        ghiChu: booking.notes,
      };

      return res.json({
        success: true,
        message: 'Thông tin đặt phòng và QR code thanh toán',
        data: confirmationSlip
      });
    } catch (error) {
      console.error('Error getting confirmation slip:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy phiếu xác nhận',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Verify OTP and confirm booking (DEPRECATED - Không còn sử dụng)
   */
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { otpCode } = req.body;

      if (!otpCode) {
        return res.status(400).json({
          success: false,
          message: 'OTP code is required'
        });
      }

      // Get booking
      const booking = await donDatPhongRepository.findOne({
        where: { maDatPhong: bookingId }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if already verified
      if (booking.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Booking already verified'
        });
      }

      // Check OTP expiry
      if (booking.otpExpiry && new Date() > new Date(booking.otpExpiry)) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new one.'
        });
      }

      // Verify OTP
      if (booking.otpCode !== otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP code'
        });
      }

      // Mark as verified
      booking.isVerified = true;
      booking.trangThai = 'CF'; // Confirmed
      booking.ngayXacNhan = new Date();
      await donDatPhongRepository.save(booking);

      res.json({
        success: true,
        message: 'Booking verified successfully',
        data: booking
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xác thực OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}


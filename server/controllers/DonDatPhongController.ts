import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { Revenue } from '../entities/Revenue';
import { BookingService } from '../services/BookingService';
import type { HoaDon } from '../entities/HoaDon';

const donDatPhongRepository = AppDataSource.getRepository(DonDatPhong);
const revenueRepository = AppDataSource.getRepository(Revenue);

export class DonDatPhongController {
  static async getAll(req: Request, res: Response) {
    try {
      console.log('🔍 Fetching all bookings with relations...');
      
      // Load với tất cả relations cần thiết để hiển thị đầy đủ thông tin
      // Filter out soft-deleted records
      const donDatPhongs = await donDatPhongRepository.find({
        where: {
          isDeleted: false
        },
        relations: [
          'coSo',           // Thông tin cơ sở
          'nhanVien',      // Thông tin nhân viên
          'khachHang',      // Thông tin khách hàng
          'chiTiet',        // Chi tiết đặt phòng
          'chiTiet.phong'   // Thông tin phòng trong chi tiết
        ],
        order: {
          ngayDat: 'DESC' // Sắp xếp theo ngày đặt mới nhất
        }
      });
      
      console.log(`📊 Found ${donDatPhongs.length} bookings`);
      if (donDatPhongs.length > 0) {
        console.log('📋 Sample booking:', donDatPhongs[0]?.maDatPhong);
        console.log('📋 Sample booking coSo:', donDatPhongs[0]?.coSo?.maCoSo || 'N/A');
      }
      
      res.json(donDatPhongs);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const donDatPhong = await donDatPhongRepository.findOne({
        where: { 
          maDatPhong: req.params.id,
          isDeleted: false
        },
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
        notes,
        paymentMethod
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
        paymentMethod
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
      const donDatPhong = await donDatPhongRepository.findOne({
        where: { 
          maDatPhong: req.params.id,
          isDeleted: false
        },
        relations: ['coSo', 'khachHang', 'chiTiet', 'chiTiet.phong']
      });
      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      
      // Lưu trạng thái cũ để kiểm tra xem có đổi thành "CC" (hoàn thành) không
      const oldStatus = donDatPhong.trangThai;
      const newStatus = req.body.trangThai;
      
      donDatPhongRepository.merge(donDatPhong, req.body);
      const result = await donDatPhongRepository.save(donDatPhong);
      
      // ✅ Nếu status được đổi thành "CC" (hoàn thành), gửi email xác nhận
      if (newStatus === 'CC' && oldStatus !== 'CC') {
        try {
          const { EmailService } = await import('../services/EmailService');
          await EmailService.sendPaymentConfirmation(result);
          console.log(`✅ Sent payment confirmation email to ${result.customerEmail} for completed booking ${result.maDatPhong}`);
        } catch (emailError) {
          console.error('❌ Failed to send payment confirmation email:', emailError);
          // Không throw error - việc gửi email thất bại không nên làm fail update booking
        }
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      // Soft delete: chỉ đánh dấu isDeleted = true thay vì xóa thật
      const donDatPhong = await donDatPhongRepository.findOne({
        where: { 
          maDatPhong: req.params.id,
          isDeleted: false
        }
      });

      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }

      // Soft delete: đánh dấu đã xóa
      donDatPhong.isDeleted = true;
      donDatPhong.deletedAt = new Date();
      await donDatPhongRepository.save(donDatPhong);

      res.json({ 
        message: 'Xóa đơn đặt phòng thành công (soft delete)',
        data: {
          maDatPhong: donDatPhong.maDatPhong,
          deletedAt: donDatPhong.deletedAt
        }
      });
    } catch (error) {
      console.error('Error soft deleting booking:', error);
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

      // Get booking with all relations (exclude soft-deleted)
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { 
          maDatPhong: bookingId,
          isDeleted: false
        },
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

      // Kiểm tra quyền: Nhân viên hoặc khách hàng finalize booking của chính họ
      const user = req.user;
      let nhanVien = null;
      
      if (user && user.maNhanVien) {
        // Là nhân viên - cho phép finalize bất kỳ booking nào
        nhanVien = user;
      } else {
        // Không phải nhân viên - kiểm tra booking thuộc về khách hàng này
        // Kiểm tra qua email trong booking
        const { customerEmail } = req.body;
        if (!customerEmail) {
          await queryRunner.rollbackTransaction();
          return res.status(400).json({
            success: false,
            message: 'customerEmail is required for customer finalization'
          });
        }
        
        // Kiểm tra email khớp với booking
        if (booking.customerEmail && booking.customerEmail.toLowerCase() !== customerEmail.toLowerCase()) {
          await queryRunner.rollbackTransaction();
          return res.status(403).json({
            success: false,
            message: 'Bạn chỉ có thể finalize booking của chính mình'
          });
        }
        
        // Nếu booking không có customerEmail, kiểm tra qua khachHang relation
        if (!booking.customerEmail && booking.khachHang) {
          if (booking.khachHang.email && booking.khachHang.email.toLowerCase() !== customerEmail.toLowerCase()) {
            await queryRunner.rollbackTransaction();
            return res.status(403).json({
              success: false,
              message: 'Bạn chỉ có thể finalize booking của chính mình'
            });
          }
        }
        
        // Khách hàng finalize booking của chính họ - không cần nhanVien
        console.log(`✅ Customer finalizing their own booking: ${bookingId} by ${customerEmail}`);
      }

      const paidDate = paidAt ? new Date(paidAt) : new Date();

      // Update booking payment fields
      booking.paymentStatus = 'paid';
      // Nếu client truyền `paymentMethod` thì ưu tiên dùng nó (ví dụ: Card),
      // nếu không thì giữ `phuongThucThanhToan` đã lưu trước đó, cuối cùng default 'Cash'.
      const finalPaymentMethod = (paymentMethod && String(paymentMethod).trim().length > 0)
        ? paymentMethod
        : (booking.phuongThucThanhToan || 'Cash');
      booking.phuongThucThanhToan = finalPaymentMethod;
      booking.paymentMethod = finalPaymentMethod; // Đồng bộ cả hai field
      booking.paymentRef = paymentRef || null;
      booking.paidAt = paidDate;
      booking.totalPaid = totalAmount;
      // Use 'CF' (Confirmed) instead of 'PA' to avoid enum error
      // 'PA' may not exist in database enum yet
      booking.trangThai = 'CF'; // Confirmed (Đã xác nhận và thanh toán)
      booking.ngayXacNhan = paidDate;
      booking.paymentTimeoutAt = undefined; // Clear payment timeout vì đã thanh toán
      // Chỉ gán nhanVien nếu có (nhân viên finalize)
      if (nhanVien) {
        booking.nhanVien = nhanVien;
      }

      await queryRunner.manager.save(DonDatPhong, booking);

      // Create revenue record
      const revenue = queryRunner.manager.create(Revenue, {
        donDatPhong: booking,
        amount: totalAmount,
        paymentMethod: finalPaymentMethod,
        paymentDate: paidDate,
        paymentRef: paymentRef || null
      });

      await queryRunner.manager.save(Revenue, revenue);

      // Create HoaDon (Invoice) - với error handling nếu bảng chưa tồn tại
      let hoaDonEntity: any = null;
      try {
        const { HoaDon } = await import('../entities/HoaDon');
        const hoaDonRepo = queryRunner.manager.getRepository(HoaDon);
        
        // Kiểm tra xem bảng có tồn tại không bằng cách thử count
        try {
          const hoaDonCount = await hoaDonRepo.count();
          const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
          const maHoaDon = `HD-${today}-${String(hoaDonCount + 1).padStart(4, '0')}`;

          // Tạo HoaDon object - chỉ gán nhanVien nếu có
          const hoaDonData: any = {
            maHoaDon,
            donDatPhong: booking,
            tongTien: totalAmount,
            phuongThucThanhToan: paymentMethod,
            paymentRef: paymentRef || undefined,
            ngayThanhToan: paidDate,
            ghiChu: ghiChu || undefined
          };
          
          // Chỉ gán nhanVien nếu có (nhân viên finalize)
          if (nhanVien) {
            hoaDonData.nhanVien = nhanVien;
          }
          
          const hoaDon = hoaDonRepo.create(hoaDonData);
          const savedHoaDon = await queryRunner.manager.save(HoaDon, hoaDon);
          
          // Ensure we have a single entity (not array)
          hoaDonEntity = Array.isArray(savedHoaDon) ? savedHoaDon[0] : savedHoaDon;
          console.log('✅ HoaDon created successfully:', hoaDonEntity.maHoaDon);
        } catch (tableError: any) {
          // Nếu bảng chưa tồn tại, bỏ qua việc tạo HoaDon
          if (tableError?.message?.includes('does not exist') || 
              tableError?.message?.includes('relation') ||
              tableError?.code === '42P01') {
            console.warn('⚠️ HoaDon table does not exist yet. Skipping invoice creation.');
            console.warn('💡 Please run migration: 1771300000000-CreateHoaDonTable');
          } else {
            // Nếu là lỗi khác, throw lại
            throw tableError;
          }
        }
      } catch (hoaDonError) {
        console.warn('⚠️ Error creating HoaDon:', hoaDonError);
        // Không throw error, chỉ log warning - booking vẫn được finalize thành công
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      return res.json({
        success: true,
        message: hoaDonEntity 
          ? 'Thanh toán đã được xác nhận và hóa đơn đã được tạo'
          : 'Thanh toán đã được xác nhận',
        data: {
          booking: {
            maDatPhong: booking.maDatPhong,
            paymentStatus: booking.paymentStatus,
            paymentMethod: booking.paymentMethod,
            totalPaid: booking.totalPaid,
            paidAt: booking.paidAt
          },
          hoaDon: hoaDonEntity ? {
            id: hoaDonEntity.id,
            maHoaDon: hoaDonEntity.maHoaDon,
            tongTien: hoaDonEntity.tongTien,
            phuongThucThanhToan: hoaDonEntity.phuongThucThanhToan,
            ngayThanhToan: hoaDonEntity.ngayThanhToan,
            nhanVien: nhanVien ? {
              maNhanVien: nhanVien.maNhanVien,
              ten: nhanVien.ten
            } : null
          } : null,
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
      booking.phuongThucThanhToan = paymentMethod; // Đồng bộ cả hai field
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
        where: { 
          maDatPhong: bookingId,
          isDeleted: false
        },
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
   * Gửi mã OTP cho booking
   */
  static async sendOTP(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;

      // Get booking
      const booking = await donDatPhongRepository.findOne({
        where: { 
          maDatPhong: bookingId,
          isDeleted: false
        },
        relations: ['coSo', 'khachHang']
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt phòng'
        });
      }

      // Generate OTP code (6 digits)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Update booking with OTP
      booking.otpCode = otpCode;
      booking.otpExpiry = otpExpiry;
      booking.isVerified = false; // Reset verification status
      await donDatPhongRepository.save(booking);

      // Send OTP email
      const { EmailService } = await import('../services/EmailService');
      const customerEmail = booking.customerEmail || booking.khachHang?.email;
      const customerName = booking.customerName || booking.khachHang?.ten || 'Khách hàng';

      if (!customerEmail) {
        return res.status(400).json({
          success: false,
          message: 'Không tìm thấy email khách hàng'
        });
      }

      try {
        await EmailService.sendBookingOTP(
          customerEmail,
          otpCode,
          customerName,
          booking.maDatPhong
        );
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        // Don't fail the request if email fails, but log it
      }

      res.json({
        success: true,
        message: 'Mã OTP đã được gửi đến email của bạn',
        data: {
          bookingId: booking.maDatPhong,
          email: customerEmail,
          expiresAt: otpExpiry
        }
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi mã OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Verify OTP and confirm booking
   */
  static async verifyOTP(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { otpCode } = req.body;

      if (!otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Mã OTP là bắt buộc'
        });
      }

      // Get booking
      const booking = await donDatPhongRepository.findOne({
        where: { 
          maDatPhong: bookingId,
          isDeleted: false
        }
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn đặt phòng'
        });
      }

      // Check if already verified
      if (booking.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'Đơn đặt phòng đã được xác nhận'
        });
      }

      // Check if OTP exists
      if (!booking.otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Chưa có mã OTP. Vui lòng yêu cầu gửi mã OTP trước.'
        });
      }

      // Check OTP expiry
      if (booking.otpExpiry && new Date() > new Date(booking.otpExpiry)) {
        return res.status(400).json({
          success: false,
          message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.'
        });
      }

      // Verify OTP
      if (booking.otpCode !== otpCode) {
        return res.status(400).json({
          success: false,
          message: 'Mã OTP không đúng. Vui lòng thử lại.'
        });
      }

      // Mark as verified
      booking.isVerified = true;
      booking.trangThai = 'CF'; // Confirmed
      booking.ngayXacNhan = new Date();
      // Set payment timeout: 10 phút để thanh toán
      booking.paymentTimeoutAt = new Date(Date.now() + 10 * 60 * 1000);
      // Clear OTP after successful verification
      booking.otpCode = undefined;
      booking.otpExpiry = undefined;
      await donDatPhongRepository.save(booking);

      res.json({
        success: true,
        message: 'Xác nhận đặt phòng thành công!',
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

  /**
   * Get booking history by customer email
   * GET /api/dondatphong/by-email/:email
   */
  static async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ 
          message: 'Email is required' 
        });
      }

      // Decode email if it's URL encoded
      const decodedEmail = decodeURIComponent(email);

      // Query bookings by customerEmail or khachHang.email (exclude soft-deleted)
      const queryBuilder = donDatPhongRepository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.coSo', 'coSo')
        .leftJoinAndSelect('booking.nhanVien', 'nhanVien')
        .leftJoinAndSelect('booking.khachHang', 'khachHang')
        .leftJoinAndSelect('booking.chiTiet', 'chiTiet')
        .leftJoinAndSelect('chiTiet.phong', 'phong')
        .where('booking.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('(booking.customerEmail = :email OR khachHang.email = :email)', { email: decodedEmail })
        .orderBy('booking.ngayDat', 'DESC');

      const bookings = await queryBuilder.getMany();

      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings by email:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy lịch sử đặt phòng', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}


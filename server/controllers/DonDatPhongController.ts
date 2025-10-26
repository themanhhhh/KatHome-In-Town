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
        relations: ['coSo', 'nhanVien', 'khachHang', 'chiTiet', 'chiTiet.phong', 'chiTiet.phong.hangPhong']
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
   * Finalize payment for a booking
   * - Updates booking payment status
   * - Creates revenue record
   * - Uses transaction to ensure atomicity
   */
  static async finalizePayment(req: Request, res: Response) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { bookingId } = req.params;
      const { totalAmount, paymentMethod, paymentRef, paidAt, sendEmail } = req.body;

      // Validate required fields
      if (!totalAmount || !paymentMethod) {
        await queryRunner.rollbackTransaction();
        return res.status(400).json({
          success: false,
          message: 'totalAmount and paymentMethod are required'
        });
      }

      // Get booking
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['coSo', 'khachHang']
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

      // Update booking payment fields
      booking.paymentStatus = 'paid';
      booking.paymentMethod = paymentMethod;
      booking.paymentRef = paymentRef || null;
      booking.paidAt = paidAt ? new Date(paidAt) : new Date();
      booking.totalPaid = totalAmount;

      await queryRunner.manager.save(DonDatPhong, booking);

      // Create revenue record
      const revenue = queryRunner.manager.create(Revenue, {
        donDatPhong: booking,
        amount: totalAmount,
        paymentMethod,
        paymentDate: booking.paidAt,
        paymentRef: paymentRef || null
      });

      await queryRunner.manager.save(Revenue, revenue);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Optional: Send email confirmation (can be handled separately)
      if (sendEmail) {
        // Email logic can be added here or handled by frontend
        console.log('✅ Email notification requested for booking:', bookingId);
      }

      return res.json({
        success: true,
        message: 'Payment finalized successfully',
        data: {
          booking,
          revenue: {
            id: revenue.id,
            amount: revenue.amount,
            paymentMethod: revenue.paymentMethod,
            paymentDate: revenue.paymentDate,
            paymentRef: revenue.paymentRef
          }
        }
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error finalizing payment:', error);
      return res.status(500).json({
        success: false,
        message: 'Error finalizing payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Confirm payment for cash payment
   * For cash payments, staff confirms receipt manually
   */
  static async confirmPayment(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { paymentMethod = 'Cash' } = req.body;

      if (paymentMethod !== 'Cash') {
        return res.status(400).json({
          success: false,
          message: 'Only cash payment is supported currently'
        });
      }

      const booking = await BookingService.confirmPayment(bookingId, paymentMethod);

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: booking,
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
   * Verify OTP and confirm booking
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


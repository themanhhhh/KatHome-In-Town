import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { ChiTietDonDatPhong } from '../entities/ChiTietDonDatPhong';
import { Phong } from '../entities/Phong';
import { KhachHang } from '../entities/KhachHang';
import { CoSo } from '../entities/CoSo';
import { Between, In, Not } from 'typeorm';
import { PricingService } from './PricingService';
import { EmailService } from './EmailService';
import { NotificationService } from './NotificationService';

export interface CreateBookingParams {
  coSoId: string;
  khachHangId?: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  rooms: {
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    price?: number; // Optional - sẽ tính từ server nếu không có
  }[];
  notes?: string;
  bookingSource?: string;
  promotionCode?: string;
}

export class BookingService {
  /**
   * Check if rooms are available for the given date range
   */
  static async checkAvailability(
    roomIds: string[],
    checkIn: Date,
    checkOut: Date
  ): Promise<{ available: boolean; conflicts: string[] }> {
    const chiTietRepo = AppDataSource.getRepository(ChiTietDonDatPhong);

    // Find existing bookings for these rooms in the date range
    // Exclude cancelled bookings
    const conflictingBookings = await chiTietRepo
      .createQueryBuilder('ct')
      .leftJoin('ct.phong', 'phong')
      .where('phong.maPhong IN (:...roomIds)', { roomIds })
      .andWhere('ct.trangThai NOT IN (:...excludedStatuses)', { 
        excludedStatuses: ['cancelled'] 
      })
      .andWhere(`
        (ct.checkInDate < :checkOut AND ct.checkOutDate > :checkIn)
      `, { checkIn, checkOut })
      .getMany();

    const conflicts = conflictingBookings.map(ct => ct.phong?.maPhong || 'unknown');

    return {
      available: conflicts.length === 0,
      conflicts: [...new Set(conflicts)], // unique room IDs
    };
  }

  /**
   * Create a new booking (pending payment) - THEO FLOWCHART
   */
  static async createBooking(params: CreateBookingParams): Promise<DonDatPhong> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { 
        coSoId, 
        khachHangId, 
        customerEmail, 
        customerPhone, 
        customerName,
        rooms, 
        notes, 
        bookingSource = 'website',
        promotionCode
      } = params;

      // 1. Check availability (theo flowchart)
      const roomIds = rooms.map(r => r.roomId);
      const checkIn = rooms[0].checkIn;
      const checkOut = rooms[0].checkOut;

      const availability = await this.checkAvailability(roomIds, checkIn, checkOut);
      if (!availability.available) {
        throw new Error(`Rooms not available: ${availability.conflicts.join(', ')}`);
      }

      // 2. Get CoSo
      const coSo = await queryRunner.manager.findOne(CoSo, { 
        where: { maCoSo: coSoId } 
      });
      if (!coSo) {
        throw new Error('Branch not found');
      }

      // 3. LOCK PHÒNG TẠM THỜI với optimistic locking (theo flowchart)
      for (const roomId of roomIds) {
        const phong = await queryRunner.manager.findOne(Phong, {
          where: { maPhong: roomId }
        });

        if (!phong) {
          throw new Error(`Room ${roomId} not found`);
        }

        // Kiểm tra phòng có đang bị lock không
        if (phong.lockedUntil && phong.lockedUntil > new Date()) {
          throw new Error(`Room ${roomId} is temporarily locked by another booking`);
        }

        // Kiểm tra trạng thái phòng
        if (phong.status !== 'available') {
          throw new Error(`Room ${roomId} is not available (status: ${phong.status})`);
        }

        // Lock phòng (optimistic locking)
        const oldVersion = phong.version;
        phong.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
        phong.version = oldVersion + 1;

        const updateResult = await queryRunner.manager
          .createQueryBuilder()
          .update(Phong)
          .set({ 
            lockedUntil: phong.lockedUntil,
            version: phong.version
          })
          .where('maPhong = :maPhong AND version = :oldVersion', { 
            maPhong: roomId, 
            oldVersion 
          })
          .execute();

        if (updateResult.affected === 0) {
          throw new Error(`Room ${roomId} was just booked by another user (conflict)`);
        }
      }

      // 4. Get or create KhachHang
      let khachHang: KhachHang | null = null;
      if (khachHangId) {
        khachHang = await queryRunner.manager.findOne(KhachHang, { 
          where: { maKhachHang: khachHangId } 
        });
      } else {
        const khRepo = queryRunner.manager.getRepository(KhachHang);
        const khCount = await khRepo.count();
        const newMaKH = `KH${String(khCount + 1).padStart(4, '0')}`;
        
        khachHang = khRepo.create({
          maKhachHang: newMaKH,
          ten: customerName,
          sdt: customerPhone,
          email: customerEmail,
          ngaySinh: new Date('1990-01-01'),
          gioiTinh: 'Nam',
          quocTich: 'VN',
          cccd: '000000000000',
        });
        await queryRunner.manager.save(KhachHang, khachHang);
      }

      if (!khachHang) {
        throw new Error('Customer not found or could not be created');
      }

      // 5. TÍNH GIÁ CHI TIẾT (theo flowchart)
      let totalBasePrice = 0;
      let totalSeasonalSurcharge = 0;
      let totalGuestSurcharge = 0;
      let totalVatAmount = 0;
      let totalDiscount = 0;
      let totalAmount = 0;

      const roomPrices: Map<string, any> = new Map();

      for (const room of rooms) {
        const phong = await queryRunner.manager.findOne(Phong, { 
          where: { maPhong: room.roomId } 
        });

        if (!phong) {
          throw new Error(`Room ${room.roomId} not found`);
        }

        // Tính giá từ PricingService
        const priceBreakdown = PricingService.calculatePrice({
          room: phong,
          checkIn: room.checkIn,
          checkOut: room.checkOut,
          adults: room.adults,
          children: room.children,
          promotionCode,
        });

        roomPrices.set(room.roomId, priceBreakdown);

        totalBasePrice += priceBreakdown.basePrice;
        totalSeasonalSurcharge += priceBreakdown.seasonalSurcharge;
        totalGuestSurcharge += priceBreakdown.guestSurcharge;
        totalVatAmount += priceBreakdown.vatAmount;
        totalDiscount += priceBreakdown.discount;
        totalAmount += priceBreakdown.totalPrice;
      }

      // 6. Generate booking ID
      const bookingRepo = queryRunner.manager.getRepository(DonDatPhong);
      const bookingCount = await bookingRepo.count();
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const maDatPhong = `BOOK-${today}-${String(bookingCount + 1).padStart(4, '0')}`;

      // 7. Tạo booking HOLD với timeout 15 phút (theo flowchart)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      // Generate OTP code (6 digits) for email verification
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      const donDatPhong = bookingRepo.create({
        maDatPhong,
        coSo,
        khachHang,
        trangThai: 'R', // Reserved (PENDING theo flowchart)
        phuongThucThanhToan: 'Cash',
        checkinDuKien: checkIn,
        checkoutDuKien: checkOut,
        ngayDat: new Date(),
        customerEmail,
        customerPhone,
        customerName,
        notes,
        bookingSource,
        
        // Price breakdown (theo flowchart)
        basePrice: totalBasePrice,
        seasonalSurcharge: totalSeasonalSurcharge,
        guestSurcharge: totalGuestSurcharge,
        vatAmount: totalVatAmount,
        discount: totalDiscount,
        totalAmount,
        promotionCode,
        
        // Booking hold fields
        expiresAt,
        version: 0,
        
        paymentStatus: 'pending',
        isVerified: false, // Chưa verify OTP
        otpCode, // OTP code để xác nhận
        otpExpiry, // Thời gian hết hạn OTP
      });

      await queryRunner.manager.save(DonDatPhong, donDatPhong);

      // 8. Create ChiTietDonDatPhong for each room
      const chiTietRepo = queryRunner.manager.getRepository(ChiTietDonDatPhong);
      const chiTietCount = await chiTietRepo.count();

      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const phong = await queryRunner.manager.findOne(Phong, { 
          where: { maPhong: room.roomId } 
        });

        if (!phong) {
          throw new Error(`Room ${room.roomId} not found`);
        }

        const priceBreakdown = roomPrices.get(room.roomId);
        
        const maChiTiet = `CT${String(chiTietCount + i + 1).padStart(6, '0')}`;
        const chiTiet = chiTietRepo.create({
          maChiTiet,
          donDatPhong,
          phong,
          soNguoiLon: room.adults,
          soTreEm: room.children,
          checkInDate: room.checkIn,
          checkOutDate: room.checkOut,
          donGia: priceBreakdown.basePrice,
          thanhTien: priceBreakdown.totalPrice,
          trangThai: 'reserved',
        });

        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
      }

      await queryRunner.commitTransaction();

      // Reload with relations
      const result = await AppDataSource.getRepository(DonDatPhong).findOne({
        where: { maDatPhong },
        relations: ['coSo', 'khachHang', 'chiTiet', 'chiTiet.phong'],
      });

      // Gửi OTP email và thông báo staff
      if (result) {
        try {
          // Gửi OTP email cho khách hàng
          const customerEmail = result.customerEmail || result.khachHang?.email;
          const customerName = result.customerName || result.khachHang?.ten || 'Khách hàng';
          
          if (customerEmail && result.otpCode) {
            try {
              await EmailService.sendBookingOTP(
                customerEmail,
                result.otpCode,
                customerName,
                result.maDatPhong
              );
              console.log(`✅ OTP sent to ${customerEmail} for booking ${result.maDatPhong}`);
            } catch (emailError) {
              console.error('Failed to send OTP email:', emailError);
              // Don't throw - email failure shouldn't fail the booking
            }
          }

          // Thông báo staff
          await NotificationService.notifyStaffNewBooking(result);
        } catch (notifError) {
          console.error('Failed to notify staff:', notifError);
          // Don't throw - notification failure shouldn't fail the booking
        }
      }

      return result!;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Confirm payment and update booking status
   */
  static async confirmPayment(
    bookingId: string,
    paymentMethod: string = 'Cash'
  ): Promise<DonDatPhong> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['chiTiet'],
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus === 'paid') {
        throw new Error('Booking already paid');
      }

      // Update booking
      booking.paymentStatus = 'paid';
      booking.trangThai = 'CF'; // Confirmed
      booking.phuongThucThanhToan = paymentMethod;
      booking.paidAt = new Date();
      booking.totalPaid = booking.totalAmount;
      booking.ngayXacNhan = new Date();

      await queryRunner.manager.save(DonDatPhong, booking);

      // Update all ChiTietDonDatPhong to paid
      for (const chiTiet of booking.chiTiet) {
        chiTiet.trangThai = 'paid';
        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
      }

      // THEO FLOWCHART: Release room locks sau khi thanh toán
      for (const chiTiet of booking.chiTiet) {
        if (chiTiet.phong) {
          const phong = await queryRunner.manager.findOne(Phong, {
            where: { maPhong: chiTiet.phong.maPhong }
          });

          if (phong) {
            phong.lockedUntil = undefined;
            phong.status = 'booked';
            await queryRunner.manager.save(Phong, phong);
          }
        }
      }

      await queryRunner.commitTransaction();

      // THEO FLOWCHART: Gửi email xác nhận thanh toán
      try {
        await EmailService.sendPaymentConfirmation(booking);
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }

      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Check-in booking
   */
  static async checkIn(bookingId: string): Promise<DonDatPhong> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['chiTiet'],
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus !== 'paid') {
        throw new Error('Booking must be paid before check-in');
      }

      // Update all ChiTietDonDatPhong to checked_in
      for (const chiTiet of booking.chiTiet) {
        chiTiet.trangThai = 'checked_in';
        chiTiet.actualCheckInTime = new Date();
        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
      }

      booking.trangThai = 'CC'; // Currently Checked-in

      await queryRunner.manager.save(DonDatPhong, booking);
      await queryRunner.commitTransaction();

      // THEO FLOWCHART: Thông báo staff
      try {
        await NotificationService.notifyStaffCheckIn(booking);
      } catch (notifError) {
        console.error('Failed to notify staff about check-in:', notifError);
      }

      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Check-out booking
   */
  static async checkOut(bookingId: string): Promise<DonDatPhong> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['chiTiet'],
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update all ChiTietDonDatPhong to checked_out
      for (const chiTiet of booking.chiTiet) {
        chiTiet.trangThai = 'checked_out';
        chiTiet.actualCheckOutTime = new Date();
        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
        
        // Release room
        if (chiTiet.phong) {
          const phong = await queryRunner.manager.findOne(Phong, {
            where: { maPhong: chiTiet.phong.maPhong }
          });
          if (phong) {
            phong.status = 'available';
            await queryRunner.manager.save(Phong, phong);
          }
        }
      }

      await queryRunner.commitTransaction();

      // THEO FLOWCHART: Thông báo staff
      try {
        await NotificationService.notifyStaffCheckOut(booking);
      } catch (notifError) {
        console.error('Failed to notify staff about check-out:', notifError);
      }

      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string): Promise<DonDatPhong> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const booking = await queryRunner.manager.findOne(DonDatPhong, {
        where: { maDatPhong: bookingId },
        relations: ['chiTiet'],
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      booking.trangThai = 'AB'; // Aborted/Cancelled
      booking.ngayHuy = new Date();

      await queryRunner.manager.save(DonDatPhong, booking);

      // Update all ChiTietDonDatPhong to cancelled and release rooms
      for (const chiTiet of booking.chiTiet) {
        chiTiet.trangThai = 'cancelled';
        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
        
        // Release room locks
        if (chiTiet.phong) {
          const phong = await queryRunner.manager.findOne(Phong, {
            where: { maPhong: chiTiet.phong.maPhong }
          });
          if (phong) {
            phong.lockedUntil = undefined;
            phong.status = 'available';
            await queryRunner.manager.save(Phong, phong);
          }
        }
      }

      await queryRunner.commitTransaction();

      // THEO FLOWCHART: Thông báo staff
      try {
        await NotificationService.notifyStaffCancellation(booking);
      } catch (notifError) {
        console.error('Failed to notify staff about cancellation:', notifError);
      }

      return booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get available rooms for date range
   */
  static async getAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    coSoId?: string,
    guests?: number
  ): Promise<Phong[]> {
    const chiTietRepo = AppDataSource.getRepository(ChiTietDonDatPhong);
    
    // Get rooms that are booked in this date range
    // Join with phong table to get the actual room IDs
    const bookedRoomIds = await chiTietRepo
      .createQueryBuilder('ct')
      .leftJoin('ct.phong', 'phong')
      .select('phong.maPhong')
      .where('ct.trangThai NOT IN (:...excludedStatuses)', { 
        excludedStatuses: ['cancelled'] 
      })
      .andWhere(`
        (ct.checkInDate < :checkOut AND ct.checkOutDate > :checkIn)
      `, { checkIn, checkOut })
      .getRawMany()
      .then(results => results.map(r => r.phong_maPhong).filter(id => id !== null));

    // Query available rooms
    const phongRepo = AppDataSource.getRepository(Phong);
    const query = phongRepo.createQueryBuilder('phong')
      .leftJoinAndSelect('phong.coSo', 'coSo');

    if (bookedRoomIds.length > 0) {
      query.where('phong.maPhong NOT IN (:...bookedRoomIds)', { bookedRoomIds });
    }

    if (coSoId) {
      query.andWhere('phong.coSoMaCoSo = :coSoId', { coSoId });
    }

    if (guests) {
      query.andWhere('phong.sucChua >= :guests', { guests });
    }

    return query.getMany();
  }
}


import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { ChiTietDonDatPhong } from '../entities/ChiTietDonDatPhong';
import { Phong } from '../entities/Phong';
import { KhachHang } from '../entities/KhachHang';
import { CoSo } from '../entities/CoSo';
import { Between, In, Not } from 'typeorm';

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
    price: number;
  }[];
  notes?: string;
  bookingSource?: string;
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
      .where('ct.phongMaPhong IN (:...roomIds)', { roomIds })
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
   * Create a new booking (pending payment)
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
        bookingSource = 'website' 
      } = params;

      // 1. Check availability
      const roomIds = rooms.map(r => r.roomId);
      const checkIn = rooms[0].checkIn; // Assume all rooms same dates for now
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

      // 3. Get or create KhachHang
      let khachHang: KhachHang | null = null;
      if (khachHangId) {
        khachHang = await queryRunner.manager.findOne(KhachHang, { 
          where: { maKhachHang: khachHangId } 
        });
      } else {
        // Create guest customer
        const khRepo = queryRunner.manager.getRepository(KhachHang);
        const khCount = await khRepo.count();
        const newMaKH = `KH${String(khCount + 1).padStart(4, '0')}`;
        
        khachHang = khRepo.create({
          maKhachHang: newMaKH,
          ten: customerName,
          sdt: customerPhone,
          email: customerEmail,
          ngaySinh: new Date('1990-01-01'), // Default date
          gioiTinh: 'Nam', // Default gender
          quocTich: 'VN', // Default nationality
          cccd: '000000000000', // Placeholder CCCD
        });
        await queryRunner.manager.save(KhachHang, khachHang);
      }

      if (!khachHang) {
        throw new Error('Customer not found or could not be created');
      }

      // 4. Calculate total
      const totalAmount = rooms.reduce((sum, room) => sum + room.price, 0);

      // 5. Generate booking ID
      const bookingRepo = queryRunner.manager.getRepository(DonDatPhong);
      const bookingCount = await bookingRepo.count();
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const maDatPhong = `BOOK-${today}-${String(bookingCount + 1).padStart(4, '0')}`;

      // 5.1. Generate OTP (6 digits)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // 6. Create DonDatPhong
      const donDatPhong = bookingRepo.create({
        maDatPhong,
        coSo,
        khachHang,
        trangThai: 'R', // Reserved (pending verification)
        phuongThucThanhToan: 'Cash', // Default, will be updated on payment
        checkinDuKien: checkIn,
        checkoutDuKien: checkOut,
        ngayDat: new Date(),
        customerEmail,
        customerPhone,
        customerName,
        notes,
        bookingSource,
        totalAmount,
        paymentStatus: 'pending',
        otpCode,
        otpExpiry,
        isVerified: false,
      });

      await queryRunner.manager.save(DonDatPhong, donDatPhong);

      // 7. Create ChiTietDonDatPhong for each room
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

        const maChiTiet = `CT${String(chiTietCount + i + 1).padStart(6, '0')}`;
        const chiTiet = chiTietRepo.create({
          maChiTiet,
          donDatPhong,
          phong,
          soNguoiLon: room.adults,
          soTreEm: room.children,
          checkInDate: room.checkIn,
          checkOutDate: room.checkOut,
          donGia: room.price,
          thanhTien: room.price,
          trangThai: 'reserved', // Reserved until payment
        });

        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
      }

      await queryRunner.commitTransaction();

      // Send OTP email
      try {
        const { EmailService } = await import('../services/EmailService');
        await EmailService.sendOTPEmail(customerEmail, customerName, otpCode, maDatPhong);
        console.log(`✅ OTP sent to ${customerEmail}: ${otpCode}`);
      } catch (emailError) {
        console.error('❌ Failed to send OTP email:', emailError);
        // Don't fail the booking if email fails
      }

      // Reload with relations
      const result = await AppDataSource.getRepository(DonDatPhong).findOne({
        where: { maDatPhong },
        relations: ['coSo', 'khachHang', 'chiTiet', 'chiTiet.phong', 'chiTiet.phong.hangPhong'],
      });

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

      await queryRunner.commitTransaction();

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

      booking.trangThai = 'CC'; // Currently Checked-in (if this status exists)

      await queryRunner.manager.save(DonDatPhong, booking);
      await queryRunner.commitTransaction();

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
      }

      await queryRunner.commitTransaction();

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

      // Update all ChiTietDonDatPhong to cancelled
      for (const chiTiet of booking.chiTiet) {
        chiTiet.trangThai = 'cancelled';
        await queryRunner.manager.save(ChiTietDonDatPhong, chiTiet);
      }

      await queryRunner.commitTransaction();

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
    const bookedRoomIds = await chiTietRepo
      .createQueryBuilder('ct')
      .select('ct.phongMaPhong')
      .where('ct.trangThai NOT IN (:...excludedStatuses)', { 
        excludedStatuses: ['cancelled'] 
      })
      .andWhere(`
        (ct.checkInDate < :checkOut AND ct.checkOutDate > :checkIn)
      `, { checkIn, checkOut })
      .getRawMany()
      .then(results => results.map(r => r.ct_phongMaPhong));

    // Query available rooms
    const phongRepo = AppDataSource.getRepository(Phong);
    const query = phongRepo.createQueryBuilder('phong')
      .leftJoinAndSelect('phong.hangPhong', 'hangPhong')
      .leftJoinAndSelect('phong.coSo', 'coSo');

    if (bookedRoomIds.length > 0) {
      query.where('phong.maPhong NOT IN (:...bookedRoomIds)', { bookedRoomIds });
    }

    if (coSoId) {
      query.andWhere('phong.coSoMaCoSo = :coSoId', { coSoId });
    }

    if (guests) {
      query.andWhere('hangPhong.sucChua >= :guests', { guests });
    }

    return query.getMany();
  }
}


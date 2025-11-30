import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { Phong } from '../entities/Phong';
import { LessThan } from 'typeorm';

/**
 * Service để cleanup expired bookings (timeout 15 phút theo flowchart)
 */
export class BookingCleanupService {
  /**
   * Hủy các booking đã quá hạn (expiresAt hoặc paymentTimeoutAt)
   * Chạy định kỳ mỗi 1 phút để check chính xác hơn
   */
  static async cleanupExpiredBookings(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();
      
      // Tìm các booking PENDING (R) đã quá hạn expiresAt
      // Sử dụng query builder để tránh select field paymentTimeoutAt nếu chưa tồn tại
      const expiredPendingBookings = await queryRunner.manager
        .createQueryBuilder(DonDatPhong, 'booking')
        .leftJoinAndSelect('booking.chiTiet', 'chiTiet')
        .leftJoinAndSelect('chiTiet.phong', 'phong')
        .where('booking.trangThai = :status', { status: 'R' })
        .andWhere('booking.paymentStatus = :paymentStatus', { paymentStatus: 'pending' })
        .andWhere('booking.expiresAt < :now', { now })
        .getMany();

      // Tìm các booking đã xác nhận (CF) nhưng chưa thanh toán sau 10 phút
      // Chỉ query nếu field paymentTimeoutAt tồn tại trong database
      let expiredUnpaidBookings: DonDatPhong[] = [];
      try {
        // Kiểm tra xem column paymentTimeoutAt có tồn tại không
        const columnExists = await queryRunner.manager.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'don_dat_phong' 
          AND column_name = 'paymentTimeoutAt'
        `);
        
        if (columnExists && columnExists.length > 0) {
          expiredUnpaidBookings = await queryRunner.manager
        .createQueryBuilder(DonDatPhong, 'booking')
        .leftJoinAndSelect('booking.chiTiet', 'chiTiet')
        .leftJoinAndSelect('chiTiet.phong', 'phong')
        .where('booking.trangThai IN (:...statuses)', { statuses: ['R', 'CF'] })
        .andWhere('booking.paymentStatus != :paidStatus', { paidStatus: 'paid' })
        .andWhere('booking.paymentTimeoutAt IS NOT NULL')
        .andWhere('booking.paymentTimeoutAt < :now', { now })
            .andWhere('booking.isDeleted = :isDeleted', { isDeleted: false })
        .getMany();
        }
      } catch (error) {
        // Nếu có lỗi (column không tồn tại), bỏ qua query này
        console.log('⚠️ paymentTimeoutAt column does not exist, skipping payment timeout check');
      }

      const allExpiredBookings = [...expiredPendingBookings, ...expiredUnpaidBookings];
      
      // Remove duplicates by maDatPhong
      const uniqueExpiredBookings = Array.from(
        new Map(allExpiredBookings.map(b => [b.maDatPhong, b])).values()
      );

      console.log(`🧹 Found ${uniqueExpiredBookings.length} expired bookings to cleanup`);

      // Kiểm tra xem column paymentTimeoutAt có tồn tại không (chỉ check một lần)
      let hasPaymentTimeoutColumn = false;
      try {
        const columnCheck = await queryRunner.manager.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'don_dat_phong' 
          AND column_name = 'paymentTimeoutAt'
        `);
        hasPaymentTimeoutColumn = columnCheck && columnCheck.length > 0;
      } catch (error) {
        // Bỏ qua nếu có lỗi
      }

      for (const booking of uniqueExpiredBookings) {
        // Hủy booking
        booking.trangThai = 'AB'; // Aborted (Tự hủy)
        booking.ngayHuy = now;
        // Chỉ clear paymentTimeoutAt nếu field tồn tại
        if (hasPaymentTimeoutColumn) {
          (booking as any).paymentTimeoutAt = undefined; // Clear timeout
        }
        await queryRunner.manager.save(DonDatPhong, booking);

        // Release lock phòng
        if (booking.chiTiet) {
          for (const chiTiet of booking.chiTiet) {
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
        }

        console.log(`✅ Auto-cancelled expired booking: ${booking.maDatPhong} (status: ${booking.trangThai})`);
      }

      await queryRunner.commitTransaction();
      
      if (uniqueExpiredBookings.length > 0) {
        console.log(`✅ Cleaned up ${uniqueExpiredBookings.length} expired bookings`);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error cleaning up expired bookings:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Release các room lock đã hết hạn
   */
  static async releaseExpiredRoomLocks(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const now = new Date();
      
      const lockedRooms = await queryRunner.manager.find(Phong, {
        where: {
          lockedUntil: LessThan(now),
        },
      });

      if (lockedRooms.length > 0) {
        for (const room of lockedRooms) {
          room.lockedUntil = undefined;
          await queryRunner.manager.save(Phong, room);
        }

        console.log(`🔓 Released ${lockedRooms.length} expired room locks`);
      }
    } catch (error) {
      console.error('❌ Error releasing expired room locks:', error);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Start cleanup job (chạy mỗi 1 phút để check chính xác hơn)
   */
  static startCleanupJob(): void {
    console.log('🚀 Starting booking cleanup job (runs every 1 minute)');
    
    // Chạy ngay lần đầu
    this.runCleanup();
    
    // Sau đó chạy mỗi 1 phút để check chính xác hơn
    setInterval(() => {
      this.runCleanup();
    }, 1 * 60 * 1000); // 1 phút
  }

  private static async runCleanup(): Promise<void> {
    try {
      await this.cleanupExpiredBookings();
      await this.releaseExpiredRoomLocks();
    } catch (error) {
      console.error('❌ Cleanup job failed:', error);
    }
  }
}


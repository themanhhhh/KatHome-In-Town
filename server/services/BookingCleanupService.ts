import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { Phong } from '../entities/Phong';
import { LessThan } from 'typeorm';

/**
 * Service để cleanup expired bookings (timeout 15 phút theo flowchart)
 */
export class BookingCleanupService {
  /**
   * Hủy các booking đã quá hạn (expiresAt)
   * Chạy định kỳ mỗi 5 phút
   */
  static async cleanupExpiredBookings(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();
      
      // Tìm các booking PENDING đã quá hạn
      const expiredBookings = await queryRunner.manager.find(DonDatPhong, {
        where: {
          trangThai: 'R', // Reserved/Pending
          paymentStatus: 'pending',
          expiresAt: LessThan(now),
        },
        relations: ['chiTiet', 'chiTiet.phong'],
      });

      console.log(`🧹 Found ${expiredBookings.length} expired bookings to cleanup`);

      for (const booking of expiredBookings) {
        // Hủy booking
        booking.trangThai = 'AB'; // Aborted
        booking.ngayHuy = now;
        await queryRunner.manager.save(DonDatPhong, booking);

        // Release lock phòng
        if (booking.chiTiet) {
          for (const chiTiet of booking.chiTiet) {
            if (chiTiet.phong) {
              const phong = await queryRunner.manager.findOne(Phong, {
                where: { maPhong: chiTiet.phong.maPhong }
              });

              if (phong && phong.lockedUntil) {
                phong.lockedUntil = undefined;
                await queryRunner.manager.save(Phong, phong);
              }
            }
          }
        }

        console.log(`✅ Cancelled expired booking: ${booking.maDatPhong}`);
      }

      await queryRunner.commitTransaction();
      
      if (expiredBookings.length > 0) {
        console.log(`✅ Cleaned up ${expiredBookings.length} expired bookings`);
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
   * Start cleanup job (chạy mỗi 5 phút)
   */
  static startCleanupJob(): void {
    console.log('🚀 Starting booking cleanup job (runs every 5 minutes)');
    
    // Chạy ngay lần đầu
    this.runCleanup();
    
    // Sau đó chạy mỗi 5 phút
    setInterval(() => {
      this.runCleanup();
    }, 5 * 60 * 1000); // 5 phút
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


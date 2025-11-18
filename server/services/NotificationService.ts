import { DonDatPhong } from '../entities/DonDatPhong';
import { AppDataSource } from '../data/datasource';
import { User } from '../entities/User';

/**
 * Notification Service cho staff (theo flowchart)
 * Thông báo cho: Housekeeping, Reception, F&B, etc.
 */
export class NotificationService {
  /**
   * Thông báo cho staff về booking mới (theo flowchart)
   */
  static async notifyStaffNewBooking(booking: DonDatPhong): Promise<void> {
    try {
      console.log(`📢 Notifying staff about new booking: ${booking.maDatPhong}`);

      // Lấy danh sách staff (Housekeeping, Reception)
      const userRepo = AppDataSource.getRepository(User);
      
      // TODO: Thêm filter theo role/department khi có bảng roles
      const staff = await userRepo.find({
        where: [
          { vaiTro: 'admin' },
          { vaiTro: 'staff' },
        ],
      });

      // Notification message
      const message = {
        type: 'new_booking',
        bookingId: booking.maDatPhong,
        customerName: booking.customerName,
        checkIn: booking.checkinDuKien,
        checkOut: booking.checkoutDuKien,
        roomCount: booking.chiTiet?.length || 0,
        totalAmount: booking.totalAmount,
        timestamp: new Date(),
      };

      // TODO: Implement actual notification system (WebSocket, Push, SMS, etc.)
      // For now, just log
      for (const staffMember of staff) {
        console.log(`  → Notify ${staffMember.ten || staffMember.taiKhoan}: New booking ${booking.maDatPhong}`);
        
        // In a real system:
        // - Send WebSocket notification
        // - Send push notification
        // - Send SMS if urgent
        // - Save to notification table in DB
      }

      console.log(`✅ Notified ${staff.length} staff members about booking ${booking.maDatPhong}`);
    } catch (error) {
      console.error('❌ Error notifying staff:', error);
      throw error;
    }
  }

  /**
   * Thông báo check-in
   */
  static async notifyStaffCheckIn(booking: DonDatPhong): Promise<void> {
    try {
      console.log(`📢 Staff notification: Check-in for booking ${booking.maDatPhong}`);
      
      const message = {
        type: 'check_in',
        bookingId: booking.maDatPhong,
        customerName: booking.customerName,
        rooms: booking.chiTiet?.map(ct => ct.phong?.tenPhong || ct.phong?.maPhong).join(', '),
        timestamp: new Date(),
      };

      // TODO: Send to Housekeeping department to prepare rooms
      console.log(`  → Housekeeping: Prepare rooms for ${booking.maDatPhong}`);
      console.log(`  → Reception: Guest ${booking.customerName} checked in`);
    } catch (error) {
      console.error('❌ Error notifying check-in:', error);
    }
  }

  /**
   * Thông báo check-out
   */
  static async notifyStaffCheckOut(booking: DonDatPhong): Promise<void> {
    try {
      console.log(`📢 Staff notification: Check-out for booking ${booking.maDatPhong}`);
      
      // TODO: Send to Housekeeping to clean rooms
      console.log(`  → Housekeeping: Clean rooms after ${booking.maDatPhong}`);
      console.log(`  → Reception: Guest ${booking.customerName} checked out`);
    } catch (error) {
      console.error('❌ Error notifying check-out:', error);
    }
  }

  /**
   * Thông báo hủy booking
   */
  static async notifyStaffCancellation(booking: DonDatPhong): Promise<void> {
    try {
      console.log(`📢 Staff notification: Cancellation of booking ${booking.maDatPhong}`);
      
      // TODO: Notify all departments
      console.log(`  → Reception: Booking ${booking.maDatPhong} cancelled`);
      console.log(`  → Housekeeping: Cancel room preparation for ${booking.maDatPhong}`);
      
      // If had services, notify F&B, Spa, etc.
      if (booking.chiTiet && booking.chiTiet.length > 0) {
        console.log(`  → F&B: Cancel any meal preparations`);
      }
    } catch (error) {
      console.error('❌ Error notifying cancellation:', error);
    }
  }

  /**
   * Thông báo thanh toán thành công
   */
  static async notifyStaffPaymentReceived(booking: DonDatPhong): Promise<void> {
    try {
      console.log(`📢 Staff notification: Payment received for ${booking.maDatPhong}`);
      
      console.log(`  → Accounting: Payment of ${booking.totalPaid} VND received`);
      console.log(`  → Reception: Booking ${booking.maDatPhong} confirmed with payment`);
    } catch (error) {
      console.error('❌ Error notifying payment:', error);
    }
  }
}


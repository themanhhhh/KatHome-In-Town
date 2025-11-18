import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { DonDatPhong } from '../entities/DonDatPhong';

/**
 * Email Service với QR code (theo flowchart)
 */
export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lunarofmoon@gmail.com',
      pass: 'idektxbqqwdavxou',
    },
  });

  /**
   * Gửi email xác nhận booking với QR code (theo flowchart)
   */
  static async sendBookingConfirmation(
    booking: DonDatPhong,
    includePaymentRequest: boolean = true
  ): Promise<void> {
    try {
      // Tạo QR code cho booking
      const qrCodeData = JSON.stringify({
        bookingId: booking.maDatPhong,
        customerName: booking.customerName,
        checkIn: booking.checkinDuKien,
        checkOut: booking.checkoutDuKien,
      });

      const qrCodeImage = await QRCode.toDataURL(qrCodeData);

      // Email content
      const subject = `Xác nhận đặt phòng #${booking.maDatPhong}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .booking-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .price-breakdown { margin: 15px 0; }
            .price-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; }
            .payment-request { background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Đặt phòng thành công!</h1>
            </div>
            
            <div class="content">
              <h2>Xin chào ${booking.customerName},</h2>
              <p>Cảm ơn bạn đã đặt phòng tại ${booking.coSo?.tenCoSo || 'khách sạn của chúng tôi'}!</p>
              
              <div class="booking-info">
                <h3>📋 Thông tin đặt phòng</h3>
                <p><strong>Mã đặt phòng:</strong> ${booking.maDatPhong}</p>
                <p><strong>Ngày đặt:</strong> ${new Date(booking.ngayDat).toLocaleString('vi-VN')}</p>
                <p><strong>Check-in:</strong> ${new Date(booking.checkinDuKien).toLocaleString('vi-VN')}</p>
                <p><strong>Check-out:</strong> ${new Date(booking.checkoutDuKien).toLocaleString('vi-VN')}</p>
                ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
              </div>

              <div class="booking-info">
                <h3>💰 Chi tiết giá</h3>
                <div class="price-breakdown">
                  <div class="price-row">
                    <span>Giá cơ bản:</span>
                    <span>${(booking.basePrice || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  ${booking.seasonalSurcharge ? `
                  <div class="price-row">
                    <span>Phụ phí mùa cao điểm:</span>
                    <span>${booking.seasonalSurcharge.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  ` : ''}
                  ${booking.guestSurcharge ? `
                  <div class="price-row">
                    <span>Phụ phí người thêm:</span>
                    <span>${booking.guestSurcharge.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  ` : ''}
                  <div class="price-row">
                    <span>Thuế VAT (10%):</span>
                    <span>${(booking.vatAmount || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  ${booking.discount ? `
                  <div class="price-row" style="color: #4CAF50;">
                    <span>Giảm giá ${booking.promotionCode ? `(${booking.promotionCode})` : ''}:</span>
                    <span>-${booking.discount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  ` : ''}
                  <div class="price-row total">
                    <span>Tổng cộng:</span>
                    <span>${(booking.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>

              ${includePaymentRequest && booking.paymentStatus === 'pending' ? `
              <div class="payment-request">
                <h3>⚠️ Yêu cầu thanh toán</h3>
                <p><strong>Vui lòng hoàn tất thanh toán trong 15 phút để giữ phòng!</strong></p>
                <p>Sau thời gian này, đặt phòng sẽ tự động bị hủy.</p>
                <p><strong>Tổng tiền cần thanh toán:</strong> ${(booking.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</p>
              </div>
              ` : ''}

              <div class="qr-code">
                <h3>📱 QR Code check-in</h3>
                <p>Quét mã này khi đến khách sạn:</p>
                <img src="${qrCodeImage}" alt="QR Code" style="max-width: 200px;" />
              </div>

              <div class="booking-info">
                <h3>📍 Hướng dẫn check-in</h3>
                <ol>
                  <li>Đến quầy lễ tân vào giờ check-in</li>
                  <li>Xuất trình mã QR hoặc mã đặt phòng</li>
                  <li>Xuất trình CMND/CCCD và xác nhận thông tin</li>
                  <li>Nhận chìa khóa phòng và thưởng thức kỳ nghỉ!</li>
                </ol>
              </div>
            </div>

            <div class="footer">
              <p>Nếu có thắc mắc, vui lòng liên hệ: ${booking.coSo?.soDienThoai || 'hotline'}</p>
              <p>Hoặc trả lời email này để được hỗ trợ.</p>
              <p>&copy; 2024 ${booking.coSo?.tenCoSo || 'Hotel Booking System'}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      await this.transporter.sendMail({
        from: `"${booking.coSo?.tenCoSo || 'Hotel Booking'}" <${process.env.EMAIL_USER}>`,
        to: booking.customerEmail,
        subject,
        html,
      });

      console.log(`✅ Sent booking confirmation email to ${booking.customerEmail}`);
    } catch (error) {
      console.error('❌ Error sending booking confirmation email:', error);
      throw error;
    }
  }

  /**
   * Gửi email thanh toán thành công
   */
  static async sendPaymentConfirmation(booking: DonDatPhong): Promise<void> {
    try {
      // Tạo QR code
      const qrCodeData = JSON.stringify({
        bookingId: booking.maDatPhong,
        customerName: booking.customerName,
        checkIn: booking.checkinDuKien,
        checkOut: booking.checkoutDuKien,
        status: 'paid',
      });

      const qrCodeImage = await QRCode.toDataURL(qrCodeData);

      const subject = `Thanh toán thành công - Đặt phòng #${booking.maDatPhong}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success-box { background: #d4edda; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #28a745; }
            .booking-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Thanh toán thành công!</h1>
            </div>
            
            <div class="content">
              <div class="success-box">
                <h3>✅ Đặt phòng của bạn đã được xác nhận!</h3>
                <p>Chúng tôi đã nhận được thanh toán của bạn.</p>
              </div>

              <div class="booking-info">
                <h3>📋 Thông tin đặt phòng</h3>
                <p><strong>Mã đặt phòng:</strong> ${booking.maDatPhong}</p>
                <p><strong>Tổng tiền đã thanh toán:</strong> ${(booking.totalPaid || 0).toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Phương thức:</strong> ${booking.paymentMethod || 'N/A'}</p>
                <p><strong>Check-in:</strong> ${new Date(booking.checkinDuKien).toLocaleString('vi-VN')}</p>
                <p><strong>Check-out:</strong> ${new Date(booking.checkoutDuKien).toLocaleString('vi-VN')}</p>
              </div>

              <div class="qr-code">
                <h3>📱 QR Code check-in</h3>
                <img src="${qrCodeImage}" alt="QR Code" style="max-width: 200px;" />
              </div>

              <div class="booking-info">
                <h3>🎉 Chúc bạn có một kỳ nghỉ vui vẻ!</h3>
                <p>Chúng tôi rất mong được phục vụ bạn.</p>
              </div>
            </div>

            <div class="footer">
              <p>&copy; 2024 ${booking.coSo?.tenCoSo || 'Hotel Booking System'}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"${booking.coSo?.tenCoSo || 'Hotel Booking'}" <${process.env.EMAIL_USER}>`,
        to: booking.customerEmail,
        subject,
        html,
      });

      console.log(`✅ Sent payment confirmation email to ${booking.customerEmail}`);
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      throw error;
    }
  }

  /**
   * Wrapper method để tương thích với code cũ
   * Gửi email payment confirmation từ client (không cần booking entity)
   */
  static async sendPaymentConfirmationEmail(
    email: string,
    customerName: string,
    bookingData: {
      bookingId: string;
      roomName: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      totalAmount: number;
      paymentMethod: string;
      bookingDate: string;
    }
  ): Promise<{ success: boolean; messageId?: string; error?: any }> {
    try {
      const qrCodeData = JSON.stringify({
        bookingId: bookingData.bookingId,
        customerName,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        status: 'paid',
      });

      const qrCodeImage = await QRCode.toDataURL(qrCodeData);

      const subject = `Thanh toán thành công - Đặt phòng #${bookingData.bookingId}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success-box { background: #d4edda; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #28a745; }
            .booking-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .qr-code { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Thanh toán thành công!</h1>
            </div>
            
            <div class="content">
              <div class="success-box">
                <h3>✅ Đặt phòng của bạn đã được xác nhận!</h3>
                <p>Chúng tôi đã nhận được thanh toán của bạn.</p>
              </div>

              <div class="booking-info">
                <h3>📋 Thông tin đặt phòng</h3>
                <p><strong>Mã đặt phòng:</strong> ${bookingData.bookingId}</p>
                <p><strong>Phòng:</strong> ${bookingData.roomName}</p>
                <p><strong>Số khách:</strong> ${bookingData.guests}</p>
                <p><strong>Tổng tiền:</strong> ${bookingData.totalAmount.toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Phương thức:</strong> ${bookingData.paymentMethod}</p>
                <p><strong>Check-in:</strong> ${new Date(bookingData.checkIn).toLocaleString('vi-VN')}</p>
                <p><strong>Check-out:</strong> ${new Date(bookingData.checkOut).toLocaleString('vi-VN')}</p>
              </div>

              <div class="qr-code">
                <h3>📱 QR Code check-in</h3>
                <img src="${qrCodeImage}" alt="QR Code" style="max-width: 200px;" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await this.transporter.sendMail({
        from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });

      console.log(`✅ Sent payment confirmation email to ${email}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      return { success: false, error };
    }
  }

  /**
   * Gửi mã xác thực (verification code) cho user
   */
  static async sendVerificationCode(
    email: string,
    verificationCode: string,
    username: string
  ): Promise<void> {
    try {
      const subject = 'Xác thực tài khoản - Mã xác nhận';
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .code-box { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px; }
            .code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Xác thực tài khoản</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${username}!</h2>
              <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác thực bên dưới:</p>
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>
              <p>Mã này có hiệu lực trong 10 phút.</p>
              <p>Nếu bạn không yêu cầu xác thực, vui lòng bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });

      console.log(`✅ Sent verification code to ${email}`);
    } catch (error) {
      console.error('❌ Error sending verification code:', error);
      throw error;
    }
  }

  /**
   * Gửi email chào mừng khi xác thực thành công
   */
  static async sendWelcomeEmail(email: string, username: string): Promise<void> {
    try {
      const subject = '🎉 Chào mừng đến với Hotel Booking!';
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Chào mừng bạn!</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${username}!</h2>
              <p>Tài khoản của bạn đã được xác thực thành công.</p>
              <p>Bạn có thể bắt đầu đặt phòng ngay bây giờ!</p>
              <p>Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });

      console.log(`✅ Sent welcome email to ${email}`);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Gửi email reset password
   */
  static async sendResetPasswordEmail(
    email: string,
    resetToken: string,
    username: string
  ): Promise<void> {
    try {
      const subject = '🔑 Đặt lại mật khẩu';
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Đặt lại mật khẩu</h1>
            </div>
            <div class="content">
              <h2>Xin chào ${username}!</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
              <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              <p>Hoặc copy link sau vào trình duyệt:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p>Link này có hiệu lực trong 1 giờ.</p>
              <p><strong>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.transporter.sendMail({
        from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      });

      console.log(`✅ Sent reset password email to ${email}`);
    } catch (error) {
      console.error('❌ Error sending reset password email:', error);
      throw error;
    }
  }

  /**
   * Test email connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }
}

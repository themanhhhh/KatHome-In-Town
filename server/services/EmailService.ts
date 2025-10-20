import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lunarofmoon@gmail.com',
      pass: 'idektxbqqwdavxou',
    },
  });
  

  /**
   * Gửi OTP xác nhận đặt phòng
   */
  static async sendOTPEmail(email: string, name: string, otpCode: string, bookingId: string) {
    try {
      const mailOptions = {
        from: `"KatHome In Town" <lunarofmoon@gmail.com>`,
        to: email,
        subject: `Xác nhận đặt phòng - Mã OTP ${otpCode}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FAD0C4 0%, #F2A7C3 100%); 
                        padding: 30px; text-align: center; color: #3D0301; }
              .content { background: #fef5f6; padding: 30px; border-radius: 5px; margin: 20px 0; }
              .otp-box { font-size: 36px; font-weight: bold; color: #3D0301; 
                      text-align: center; letter-spacing: 8px; padding: 25px; 
                      background: white; border-radius: 10px; margin: 20px 0; 
                      border: 2px dashed #F2A7C3; }
              .booking-id { background: #FAD0C4; padding: 15px; border-radius: 5px; 
                           text-align: center; margin: 15px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
              .warning { color: #e74c3c; font-size: 14px; margin-top: 15px; }
              .info { background: #fff; padding: 15px; border-left: 4px solid #F2A7C3; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏠 KatHome In Town</h1>
                <p>Xác nhận đặt phòng của bạn</p>
              </div>
              <div class="content">
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>Cảm ơn bạn đã đặt phòng tại KatHome In Town!</p>
                
                <div class="booking-id">
                  <strong>Mã đặt phòng:</strong> ${bookingId}
                </div>
                
                <p>Để hoàn tất đặt phòng, vui lòng nhập mã OTP dưới đây:</p>
                
                <div class="otp-box">${otpCode}</div>
                
                <div class="info">
                  <strong>⏰ Lưu ý quan trọng:</strong>
                  <ul>
                    <li>Mã OTP có hiệu lực trong <strong>5 phút</strong></li>
                    <li>Không chia sẻ mã này với bất kỳ ai</li>
                    <li>Sau khi xác nhận, bạn có thể thanh toán tại quầy</li>
                  </ul>
                </div>
                
                <p class="warning">⚠️ Nếu bạn không thực hiện đặt phòng này, vui lòng bỏ qua email.</p>
              </div>
              <div class="footer">
                <p>© 2025 KatHome In Town - Hệ thống homestay Hà Nội</p>
                <p>📞 098 894 65 68 | ✉️ kathome.luv@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ OTP email sent to ${email}:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return { success: false, error };
    }
  }

  /**
   * Gửi mã xác thực email
   */
  static async sendVerificationCode(email: string, code: string, name: string = 'Khách hàng') {
    // 🚨 DEVELOPMENT MODE: Hiển thị mã trên console nếu SMTP chưa cấu hình
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
      console.log('\n' + '='.repeat(60));
      console.log('📧 EMAIL VERIFICATION CODE (Development Mode)');
      console.log('='.repeat(60));
      console.log(`Recipient: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Verification Code: ${code}`);
      console.log('='.repeat(60) + '\n');
      return { success: true, messageId: 'dev-mode' };
    }

    try {
      const mailOptions = {
        from: `"KatHome In Town" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Mã xác thực đăng ký - KatHome In Town',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #C599B6 0%, #F2A7C3 100%); 
                        padding: 30px; text-align: center; color: white; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
              .code { font-size: 32px; font-weight: bold; color: #C599B6; 
                      text-align: center; letter-spacing: 5px; padding: 20px; 
                      background: white; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
              .warning { color: #e74c3c; font-size: 14px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏠 KatHome In Town</h1>
                <p>Xác thực tài khoản của bạn</p>
              </div>
              <div class="content">
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại KatHome In Town!</p>
                <p>Mã xác thực của bạn là:</p>
                <div class="code">${code}</div>
                <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
                <p class="warning">⚠️ Không chia sẻ mã này với bất kỳ ai!</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
              </div>
              <div class="footer">
                <p>© 2025 KatHome In Town - Hệ thống homestay Hà Nội</p>
                <p>📞 098 894 65 68 | ✉️ kathome.luv@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error };
    }
  }

  /**
   * Gửi email chào mừng sau khi xác thực
   */
  static async sendWelcomeEmail(email: string, name: string) {
    try {
      const mailOptions = {
        from: `"KatHome In Town" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Chào mừng đến với KatHome In Town! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #C599B6 0%, #F2A7C3 100%); 
                        padding: 30px; text-align: center; color: white; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
              .btn { display: inline-block; padding: 12px 30px; background: #C599B6; 
                     color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Chào mừng bạn!</h1>
              </div>
              <div class="content">
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>Tài khoản của bạn đã được xác thực thành công!</p>
                <p>Bạn đã sẵn sàng để:</p>
                <ul>
                  <li>🏠 Khám phá các phòng homestay đẹp nhất Hà Nội</li>
                  <li>📅 Đặt phòng nhanh chóng và tiện lợi</li>
                  <li>💰 Nhận ưu đãi và giảm giá đặc biệt</li>
                  <li>⭐ Trải nghiệm dịch vụ 5 sao</li>
                </ul>
                <div style="text-align: center;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3001'}" class="btn">
                    Bắt đầu đặt phòng
                  </a>
                </div>
              </div>
              <div class="footer">
                <p>© 2025 KatHome In Town - Hệ thống homestay Hà Nội</p>
                <p>📞 098 894 65 68 | ✉️ kathome.luv@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return { success: false, error };
    }
  }

  /**
   * Gửi email reset password
   */
  static async sendResetPasswordEmail(email: string, resetToken: string, name: string) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    
    try {
      const mailOptions = {
        from: `"KatHome In Town" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Đặt lại mật khẩu - KatHome In Town',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #C599B6 0%, #F2A7C3 100%); 
                        padding: 30px; text-align: center; color: white; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
              .btn { display: inline-block; padding: 12px 30px; background: #C599B6; 
                     color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .warning { color: #e74c3c; font-size: 14px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Đặt lại mật khẩu</h1>
              </div>
              <div class="content">
                <p>Xin chào <strong>${name}</strong>,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản KatHome In Town.</p>
                <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="btn">Đặt lại mật khẩu</a>
                </div>
                <p class="warning">⚠️ Link này có hiệu lực trong 1 giờ.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
              </div>
              <div class="footer">
                <p>© 2025 KatHome In Town - Hệ thống homestay Hà Nội</p>
                <p>📞 098 894 65 68 | ✉️ kathome.luv@gmail.com</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending reset password email:', error);
      return { success: false, error };
    }
  }

  /**
   * Gửi email xác nhận thanh toán và đặt phòng
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
  ) {
    // Development mode: log ra console nếu SMTP chưa cấu hình
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-email@gmail.com') {
      console.log('\n' + '='.repeat(80));
      console.log('💳 PAYMENT CONFIRMATION EMAIL (Development Mode)');
      console.log('='.repeat(80));
      console.log(`Recipient: ${email}`);
      console.log(`Customer: ${customerName}`);
      console.log(`Booking ID: ${bookingData.bookingId}`);
      console.log(`Room: ${bookingData.roomName}`);
      console.log(`Check-in: ${bookingData.checkIn}`);
      console.log(`Check-out: ${bookingData.checkOut}`);
      console.log(`Guests: ${bookingData.guests}`);
      console.log(`Total: ${bookingData.totalAmount.toLocaleString('vi-VN')} VND`);
      console.log(`Payment Method: ${bookingData.paymentMethod}`);
      console.log(`Booking Date: ${bookingData.bookingDate}`);
      console.log('='.repeat(80) + '\n');
      return { success: true, messageId: 'dev-mode' };
    }

    try {
      const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

      const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';

      const mailOptions = {
        from: `"KatHome In Town" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🎉 Xác nhận thanh toán thành công - KatHome In Town',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #C599B6 0%, #F2A7C3 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; margin: 0; }
              .success-badge { background: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; font-weight: bold; }
              .booking-details { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #C599B6; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-label { font-weight: bold; color: #555; }
              .detail-value { color: #333; }
              .total-amount { background: #C599B6; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold; }
              .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
              .btn { display: inline-block; padding: 12px 30px; background: #C599B6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .contact-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
              .icon { margin-right: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏠 KatHome In Town</h1>
                <p>Xác nhận đặt phòng thành công!</p>
                <div class="success-badge">✅ Thanh toán hoàn tất</div>
              </div>
              
              <div class="content">
                <p>Xin chào <strong>${customerName}</strong>,</p>
                <p>Cảm ơn bạn đã tin tưởng và đặt phòng tại KatHome In Town!</p>
                <p>Chúng tôi xác nhận rằng thanh toán của bạn đã được xử lý thành công.</p>
                
                <div class="booking-details">
                  <h3 style="margin-top: 0; color: #C599B6;">📋 Chi tiết đặt phòng</h3>
                  <div class="detail-row">
                    <span class="detail-label">Mã đặt phòng:</span>
                    <span class="detail-value"><strong>${bookingData.bookingId}</strong></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Tên phòng:</span>
                    <span class="detail-value">${bookingData.roomName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ngày nhận phòng:</span>
                    <span class="detail-value">${formatDate(bookingData.checkIn)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ngày trả phòng:</span>
                    <span class="detail-value">${formatDate(bookingData.checkOut)}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Số khách:</span>
                    <span class="detail-value">${bookingData.guests} người</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Phương thức thanh toán:</span>
                    <span class="detail-value">${bookingData.paymentMethod}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ngày đặt:</span>
                    <span class="detail-value">${formatDate(bookingData.bookingDate)}</span>
                  </div>
                </div>
                
                <div class="total-amount">
                  💰 Tổng thanh toán: ${formatCurrency(bookingData.totalAmount)}
                </div>
                
                <div class="contact-info">
                  <h4 style="margin-top: 0; color: #C599B6;">📞 Thông tin liên hệ</h4>
                  <p><span class="icon">📞</span> Hotline: 098 894 65 68</p>
                  <p><span class="icon">✉️</span> Email: kathome.luv@gmail.com</p>
                  <p><span class="icon">📍</span> Địa chỉ: Hà Nội, Việt Nam</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:3001'}" class="btn">
                    🏠 Về trang chủ
                  </a>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  <strong>Lưu ý:</strong> Vui lòng mang theo giấy tờ tùy thân khi nhận phòng. 
                  Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi.
                </p>
              </div>
              
              <div class="footer">
                <p>© 2025 KatHome In Town - Hệ thống homestay Hà Nội</p>
                <p>Chúc bạn có một kỳ nghỉ tuyệt vời! 🌟</p>
              </div>
            </div>
          </body>
          </html>
        `,
      } as any;

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Payment confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending payment confirmation email:', error);
      return { success: false, error };
    }
  }
}

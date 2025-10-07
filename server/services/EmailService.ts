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
}

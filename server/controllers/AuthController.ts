import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data/datasource';
import { User } from '../entities/User';
import { EmailService } from '../services/EmailService';

const userRepository = AppDataSource.getRepository(User);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export class AuthController {
  /**
   * POST /api/auth/register - Đăng ký tài khoản mới
   */
  static async register(req: Request, res: Response) {
    try {
      const { taiKhoan, matKhau, gmail, soDienThoai, vaiTro } = req.body;

      // Validate input
      if (!taiKhoan || !matKhau || !gmail) {
        return res.status(400).json({ 
          message: 'Tài khoản, mật khẩu và email là bắt buộc' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(gmail)) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
      }

      // Check if user already exists
      const existingUser = await userRepository.findOne({
        where: [
          { taiKhoan },
          { gmail }
        ]
      });

      if (existingUser) {
        return res.status(400).json({ 
          message: 'Tài khoản hoặc email đã tồn tại' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(matKhau, 10);

      // Generate verification code (6 digits)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create new user
      const user = userRepository.create({
        taiKhoan,
        matKhau: hashedPassword,
        gmail,
        soDienThoai,
        vaiTro: vaiTro || 'user',
        isEmailVerified: false,
        verificationCode,
        verificationCodeExpiry
      });

      await userRepository.save(user);

      // Send verification email
      await EmailService.sendVerificationCode(gmail, verificationCode, taiKhoan);

      // Return user without sensitive data
      const { matKhau: _, verificationCode: __, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi đăng ký tài khoản', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/auth/login - Đăng nhập
   */
  static async login(req: Request, res: Response) {
    try {
      const { taiKhoan, matKhau } = req.body;

      // Validate input
      if (!taiKhoan || !matKhau) {
        return res.status(400).json({ 
          message: 'Tài khoản và mật khẩu là bắt buộc' 
        });
      }

      // Find user by username or email
      const user = await userRepository.findOne({
        where: [
          { taiKhoan },
          { gmail: taiKhoan }
        ]
      });

      if (!user) {
        return res.status(401).json({ 
          message: 'Tài khoản hoặc mật khẩu không đúng' 
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(matKhau, user.matKhau);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Tài khoản hoặc mật khẩu không đúng' 
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({ 
          message: 'Vui lòng xác thực email trước khi đăng nhập',
          requiresVerification: true,
          userId: user.id
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          taiKhoan: user.taiKhoan,
          vaiTro: user.vaiTro 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user without sensitive data
      const { matKhau: _, verificationCode, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi đăng nhập', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/auth/verify-email - Xác thực email bằng mã code
   */
  static async verifyEmail(req: Request, res: Response) {
    try {
      const { gmail, code } = req.body;

      if (!gmail || !code) {
        return res.status(400).json({ 
          message: 'Email và mã xác thực là bắt buộc' 
        });
      }

      // Find user by email
      const user = await userRepository.findOne({ where: { gmail } });

      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: 'Email đã được xác thực' });
      }

      // Check verification code
      if (user.verificationCode !== code) {
        return res.status(400).json({ message: 'Mã xác thực không đúng' });
      }

      // Check if code is expired
      if (user.verificationCodeExpiry && user.verificationCodeExpiry < new Date()) {
        return res.status(400).json({ 
          message: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.' 
        });
      }

      // Update user
      user.isEmailVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpiry = undefined;
      await userRepository.save(user);

      // Send welcome email
      await EmailService.sendWelcomeEmail(user.gmail, user.taiKhoan);

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          taiKhoan: user.taiKhoan,
          vaiTro: user.vaiTro 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { matKhau: _, verificationCode: __, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Xác thực email thành công!',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Verify email error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi xác thực email', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/auth/resend-verification - Gửi lại mã xác thực
   */
  static async resendVerification(req: Request, res: Response) {
    try {
      const { gmail } = req.body;

      if (!gmail) {
        return res.status(400).json({ message: 'Email là bắt buộc' });
      }

      const user = await userRepository.findOne({ where: { gmail } });

      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: 'Email đã được xác thực' });
      }

      // Generate new verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.verificationCode = verificationCode;
      user.verificationCodeExpiry = verificationCodeExpiry;
      await userRepository.save(user);

      // Send new verification email
      await EmailService.sendVerificationCode(gmail, verificationCode, user.taiKhoan);

      res.json({
        success: true,
        message: 'Mã xác thực mới đã được gửi đến email của bạn'
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi gửi lại mã xác thực', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/auth/forgot-password - Yêu cầu đặt lại mật khẩu
   */
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { gmail } = req.body;

      if (!gmail) {
        return res.status(400).json({ message: 'Email là bắt buộc' });
      }

      const user = await userRepository.findOne({ where: { gmail } });

      if (!user) {
        // Don't reveal if user exists
        return res.json({
          success: true,
          message: 'Nếu email tồn tại, link đặt lại mật khẩu sẽ được gửi đến email của bạn'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await userRepository.save(user);

      // Send reset password email
      await EmailService.sendResetPasswordEmail(gmail, resetToken, user.taiKhoan);

      res.json({
        success: true,
        message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi xử lý yêu cầu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/auth/reset-password - Đặt lại mật khẩu
   */
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, matKhauMoi } = req.body;

      if (!token || !matKhauMoi) {
        return res.status(400).json({ 
          message: 'Token và mật khẩu mới là bắt buộc' 
        });
      }

      // Verify token
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
      }

      const user = await userRepository.findOne({ where: { id: decoded.id } });

      if (!user || user.resetPasswordToken !== token) {
        return res.status(400).json({ message: 'Token không hợp lệ' });
      }

      if (user.resetPasswordExpiry && user.resetPasswordExpiry < new Date()) {
        return res.status(400).json({ message: 'Token đã hết hạn' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(matKhauMoi, 10);
      user.matKhau = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;
      await userRepository.save(user);

      res.json({
        success: true,
        message: 'Đặt lại mật khẩu thành công'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ 
        message: 'Lỗi khi đặt lại mật khẩu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/auth/me - Lấy thông tin user hiện tại (cần JWT token)
   */
  static async getCurrentUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Không có token xác thực' });
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await userRepository.findOne({ where: { id: decoded.id } });

      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      const { matKhau: _, verificationCode, resetPasswordToken, ...userWithoutPassword } = user;

      res.json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }
}


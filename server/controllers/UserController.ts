import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  // GET /api/users - Lấy tất cả users
  static async getAll(req: Request, res: Response) {
    try {
      const users = await userRepository.find();
      // Loại bỏ password khỏi response
      const usersWithoutPassword = users.map(({ matKhau, ...user }) => user as any);
      res.json(usersWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách users', error });
    }
  }

  // GET /api/users/:id - Lấy user theo ID
  static async getById(req: Request, res: Response) {
    try {
      const user = await userRepository.findOneBy({ id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }
      // Loại bỏ password khỏi response
      const { matKhau, ...userWithoutPassword } = user as any;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin user', error });
    }
  }

  // POST /api/users - Tạo user mới
  static async create(req: Request, res: Response) {
    try {
      const { taiKhoan, matKhau, gmail, soDienThoai, vaiTro, isEmailVerified, ...otherData } = req.body;
      
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
      
      // Hash password trước khi lưu
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(matKhau, saltRounds);
      
      const user = userRepository.create({
        taiKhoan,
        matKhau: hashedPassword,
        gmail,
        soDienThoai,
        vaiTro: vaiTro || 'user',
        isEmailVerified: isEmailVerified || false,
        ...otherData
      });
      
      const result = await userRepository.save(user);
      
      // Không trả về password trong response
      const { matKhau: _, ...userResponse } = result as any;
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo user', error });
    }
  }

  // PUT /api/users/:id - Cập nhật user
  static async update(req: Request, res: Response) {
    try {
      const user = await userRepository.findOneBy({ id: req.params.id });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }
      
      const { matKhau, ...updateData } = req.body;
      
      // Nếu có password mới, hash nó
      if (matKhau) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(matKhau, saltRounds);
        updateData.matKhau = hashedPassword;
      }
      
      userRepository.merge(user, updateData);
      const result = await userRepository.save(user);
      
      // Không trả về password trong response
      const { matKhau: _, ...userResponse } = result as any;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật user', error });
    }
  }

  // DELETE /api/users/:id - Xóa user
  static async delete(req: Request, res: Response) {
    try {
      const result = await userRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }
      res.json({ message: 'Xóa user thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa user', error });
    }
  }

  // PUT /api/users/:id/avatar - Cập nhật avatar
  static async updateAvatar(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      user.avatar = imageUrl;
      const result = await userRepository.save(user);
      
      res.json({ 
        success: true, 
        message: 'Avatar updated successfully',
        user: result 
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật avatar', error });
    }
  }
}


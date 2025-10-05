import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  // GET /api/users - Lấy tất cả users
  static async getAll(req: Request, res: Response) {
    try {
      const users = await userRepository.find();
      res.json(users);
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
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin user', error });
    }
  }

  // POST /api/users - Tạo user mới
  static async create(req: Request, res: Response) {
    try {
      const user = userRepository.create(req.body);
      const result = await userRepository.save(user);
      res.status(201).json(result);
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
      userRepository.merge(user, req.body);
      const result = await userRepository.save(user);
      res.json(result);
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
}


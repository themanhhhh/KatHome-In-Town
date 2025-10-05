import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { KhachHang } from '../entities/KhachHang';

const khachHangRepository = AppDataSource.getRepository(KhachHang);

export class KhachHangController {
  static async getAll(req: Request, res: Response) {
    try {
      const khachHangs = await khachHangRepository.find();
      res.json(khachHangs);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const khachHang = await khachHangRepository.findOneBy({ maKhachHang: req.params.id });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      res.json(khachHang);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin khách hàng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const khachHang = khachHangRepository.create(req.body);
      const result = await khachHangRepository.save(khachHang);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo khách hàng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const khachHang = await khachHangRepository.findOneBy({ maKhachHang: req.params.id });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      khachHangRepository.merge(khachHang, req.body);
      const result = await khachHangRepository.save(khachHang);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật khách hàng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await khachHangRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      res.json({ message: 'Xóa khách hàng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa khách hàng', error });
    }
  }
}


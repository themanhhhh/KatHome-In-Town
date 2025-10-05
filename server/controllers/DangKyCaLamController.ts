import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DangKyCaLam } from '../entities/DangKyCaLam';

const dangKyCaLamRepository = AppDataSource.getRepository(DangKyCaLam);

export class DangKyCaLamController {
  static async getAll(req: Request, res: Response) {
    try {
      const dangKyCaLams = await dangKyCaLamRepository.find({
        relations: ['nhanVien', 'caLam']
      });
      res.json(dangKyCaLams);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đăng ký ca làm', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const dangKyCaLam = await dangKyCaLamRepository.findOne({
        where: { maDangKy: req.params.id },
        relations: ['nhanVien', 'caLam']
      });
      if (!dangKyCaLam) {
        return res.status(404).json({ message: 'Không tìm thấy đăng ký ca làm' });
      }
      res.json(dangKyCaLam);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đăng ký ca làm', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const dangKyCaLam = dangKyCaLamRepository.create(req.body);
      const result = await dangKyCaLamRepository.save(dangKyCaLam);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo đăng ký ca làm', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const dangKyCaLam = await dangKyCaLamRepository.findOneBy({ maDangKy: req.params.id });
      if (!dangKyCaLam) {
        return res.status(404).json({ message: 'Không tìm thấy đăng ký ca làm' });
      }
      dangKyCaLamRepository.merge(dangKyCaLam, req.body);
      const result = await dangKyCaLamRepository.save(dangKyCaLam);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đăng ký ca làm', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await dangKyCaLamRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đăng ký ca làm' });
      }
      res.json({ message: 'Xóa đăng ký ca làm thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đăng ký ca làm', error });
    }
  }
}


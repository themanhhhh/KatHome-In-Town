import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { TheoDoiCaLam } from '../entities/TheoDoiCaLam';

const theoDoiCaLamRepository = AppDataSource.getRepository(TheoDoiCaLam);

export class TheoDoiCaLamController {
  static async getAll(req: Request, res: Response) {
    try {
      const theoDoiCaLams = await theoDoiCaLamRepository.find({
        relations: ['nhanVien']
      });
      res.json(theoDoiCaLams);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách theo dõi ca làm', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const theoDoiCaLam = await theoDoiCaLamRepository.findOne({
        where: { maChiTiet: req.params.id },
        relations: ['nhanVien']
      });
      if (!theoDoiCaLam) {
        return res.status(404).json({ message: 'Không tìm thấy theo dõi ca làm' });
      }
      res.json(theoDoiCaLam);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin theo dõi ca làm', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const theoDoiCaLam = theoDoiCaLamRepository.create(req.body);
      const result = await theoDoiCaLamRepository.save(theoDoiCaLam);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo theo dõi ca làm', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const theoDoiCaLam = await theoDoiCaLamRepository.findOneBy({ maChiTiet: req.params.id });
      if (!theoDoiCaLam) {
        return res.status(404).json({ message: 'Không tìm thấy theo dõi ca làm' });
      }
      theoDoiCaLamRepository.merge(theoDoiCaLam, req.body);
      const result = await theoDoiCaLamRepository.save(theoDoiCaLam);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật theo dõi ca làm', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await theoDoiCaLamRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy theo dõi ca làm' });
      }
      res.json({ message: 'Xóa theo dõi ca làm thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa theo dõi ca làm', error });
    }
  }
}


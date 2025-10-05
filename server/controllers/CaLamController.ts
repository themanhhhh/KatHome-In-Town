import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { CaLam } from '../entities/CaLam';

const caLamRepository = AppDataSource.getRepository(CaLam);

export class CaLamController {
  static async getAll(req: Request, res: Response) {
    try {
      const caLams = await caLamRepository.find();
      res.json(caLams);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách ca làm', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const caLam = await caLamRepository.findOneBy({ maCaLam: req.params.id });
      if (!caLam) {
        return res.status(404).json({ message: 'Không tìm thấy ca làm' });
      }
      res.json(caLam);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin ca làm', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const caLam = caLamRepository.create(req.body);
      const result = await caLamRepository.save(caLam);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo ca làm', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const caLam = await caLamRepository.findOneBy({ maCaLam: req.params.id });
      if (!caLam) {
        return res.status(404).json({ message: 'Không tìm thấy ca làm' });
      }
      caLamRepository.merge(caLam, req.body);
      const result = await caLamRepository.save(caLam);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật ca làm', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await caLamRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy ca làm' });
      }
      res.json({ message: 'Xóa ca làm thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa ca làm', error });
    }
  }
}


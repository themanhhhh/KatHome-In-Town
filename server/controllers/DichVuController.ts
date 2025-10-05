import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DichVu } from '../entities/DichVu';

const dichVuRepository = AppDataSource.getRepository(DichVu);

export class DichVuController {
  static async getAll(req: Request, res: Response) {
    try {
      const dichVus = await dichVuRepository.find();
      res.json(dichVus);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách dịch vụ', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const dichVu = await dichVuRepository.findOneBy({ maDichVu: req.params.id });
      if (!dichVu) {
        return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
      }
      res.json(dichVu);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin dịch vụ', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const dichVu = dichVuRepository.create(req.body);
      const result = await dichVuRepository.save(dichVu);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo dịch vụ', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const dichVu = await dichVuRepository.findOneBy({ maDichVu: req.params.id });
      if (!dichVu) {
        return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
      }
      dichVuRepository.merge(dichVu, req.body);
      const result = await dichVuRepository.save(dichVu);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật dịch vụ', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await dichVuRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
      }
      res.json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa dịch vụ', error });
    }
  }
}


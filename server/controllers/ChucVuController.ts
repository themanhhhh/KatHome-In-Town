import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { ChucVu } from '../entities/ChucVu';

const chucVuRepository = AppDataSource.getRepository(ChucVu);

export class ChucVuController {
  static async getAll(req: Request, res: Response) {
    try {
      const chucVus = await chucVuRepository.find();
      res.json(chucVus);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách chức vụ', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const chucVu = await chucVuRepository.findOneBy({ maChucVu: req.params.id });
      if (!chucVu) {
        return res.status(404).json({ message: 'Không tìm thấy chức vụ' });
      }
      res.json(chucVu);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin chức vụ', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const chucVu = chucVuRepository.create(req.body);
      const result = await chucVuRepository.save(chucVu);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo chức vụ', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const chucVu = await chucVuRepository.findOneBy({ maChucVu: req.params.id });
      if (!chucVu) {
        return res.status(404).json({ message: 'Không tìm thấy chức vụ' });
      }
      chucVuRepository.merge(chucVu, req.body);
      const result = await chucVuRepository.save(chucVu);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật chức vụ', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await chucVuRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy chức vụ' });
      }
      res.json({ message: 'Xóa chức vụ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa chức vụ', error });
    }
  }
}


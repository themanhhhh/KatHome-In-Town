import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { KhieuNai } from '../entities/KhieuNai';

const khieuNaiRepository = AppDataSource.getRepository(KhieuNai);

export class KhieuNaiController {
  static async getAll(req: Request, res: Response) {
    try {
      const khieuNais = await khieuNaiRepository.find({
        relations: ['khachHang']
      });
      res.json(khieuNais);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khiếu nại', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const khieuNai = await khieuNaiRepository.findOne({
        where: { maKhieuNai: req.params.id },
        relations: ['khachHang']
      });
      if (!khieuNai) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      res.json(khieuNai);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin khiếu nại', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const khieuNai = khieuNaiRepository.create(req.body);
      const result = await khieuNaiRepository.save(khieuNai);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo khiếu nại', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const khieuNai = await khieuNaiRepository.findOneBy({ maKhieuNai: req.params.id });
      if (!khieuNai) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      khieuNaiRepository.merge(khieuNai, req.body);
      const result = await khieuNaiRepository.save(khieuNai);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật khiếu nại', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await khieuNaiRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      res.json({ message: 'Xóa khiếu nại thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa khiếu nại', error });
    }
  }
}


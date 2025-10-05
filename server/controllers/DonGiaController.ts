import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonGia } from '../entities/DonGia';

const donGiaRepository = AppDataSource.getRepository(DonGia);

export class DonGiaController {
  static async getAll(req: Request, res: Response) {
    try {
      const donGias = await donGiaRepository.find({
        relations: ['hangPhong']
      });
      res.json(donGias);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn giá', error });
    }
  }

  // GET by composite key: /api/dongia/:maHangPhong/:donViTinh
  static async getById(req: Request, res: Response) {
    try {
      const { maHangPhong, donViTinh } = req.params;
      const donGia = await donGiaRepository.findOne({
        where: { maHangPhong, donViTinh },
        relations: ['hangPhong']
      });
      if (!donGia) {
        return res.status(404).json({ message: 'Không tìm thấy đơn giá' });
      }
      res.json(donGia);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn giá', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const donGia = donGiaRepository.create(req.body);
      const result = await donGiaRepository.save(donGia);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo đơn giá', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { maHangPhong, donViTinh } = req.params;
      const donGia = await donGiaRepository.findOne({
        where: { maHangPhong, donViTinh }
      });
      if (!donGia) {
        return res.status(404).json({ message: 'Không tìm thấy đơn giá' });
      }
      donGiaRepository.merge(donGia, req.body);
      const result = await donGiaRepository.save(donGia);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn giá', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { maHangPhong, donViTinh } = req.params;
      const result = await donGiaRepository.delete({ maHangPhong, donViTinh });
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn giá' });
      }
      res.json({ message: 'Xóa đơn giá thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đơn giá', error });
    }
  }
}


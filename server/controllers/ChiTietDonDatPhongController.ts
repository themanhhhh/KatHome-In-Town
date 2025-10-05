import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { ChiTietDonDatPhong } from '../entities/ChiTietDonDatPhong';

const chiTietDonDatPhongRepository = AppDataSource.getRepository(ChiTietDonDatPhong);

export class ChiTietDonDatPhongController {
  static async getAll(req: Request, res: Response) {
    try {
      const chiTiets = await chiTietDonDatPhongRepository.find({
        relations: ['donDatPhong', 'phong']
      });
      res.json(chiTiets);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách chi tiết đơn đặt phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const chiTiet = await chiTietDonDatPhongRepository.findOne({
        where: { maChiTiet: req.params.id },
        relations: ['donDatPhong', 'phong']
      });
      if (!chiTiet) {
        return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn đặt phòng' });
      }
      res.json(chiTiet);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin chi tiết đơn đặt phòng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const chiTiet = chiTietDonDatPhongRepository.create(req.body);
      const result = await chiTietDonDatPhongRepository.save(chiTiet);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo chi tiết đơn đặt phòng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const chiTiet = await chiTietDonDatPhongRepository.findOneBy({ maChiTiet: req.params.id });
      if (!chiTiet) {
        return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn đặt phòng' });
      }
      chiTietDonDatPhongRepository.merge(chiTiet, req.body);
      const result = await chiTietDonDatPhongRepository.save(chiTiet);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật chi tiết đơn đặt phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await chiTietDonDatPhongRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy chi tiết đơn đặt phòng' });
      }
      res.json({ message: 'Xóa chi tiết đơn đặt phòng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa chi tiết đơn đặt phòng', error });
    }
  }
}


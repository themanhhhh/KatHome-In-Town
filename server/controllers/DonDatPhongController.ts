import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';

const donDatPhongRepository = AppDataSource.getRepository(DonDatPhong);

export class DonDatPhongController {
  static async getAll(req: Request, res: Response) {
    try {
      const donDatPhongs = await donDatPhongRepository.find({
        relations: ['coSo', 'nhanVien', 'khachHang', 'chiTiet']
      });
      res.json(donDatPhongs);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const donDatPhong = await donDatPhongRepository.findOne({
        where: { maDatPhong: req.params.id },
        relations: ['coSo', 'nhanVien', 'khachHang', 'chiTiet']
      });
      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      res.json(donDatPhong);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn đặt phòng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const donDatPhong = donDatPhongRepository.create(req.body);
      const result = await donDatPhongRepository.save(donDatPhong);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo đơn đặt phòng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const donDatPhong = await donDatPhongRepository.findOneBy({ maDatPhong: req.params.id });
      if (!donDatPhong) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      donDatPhongRepository.merge(donDatPhong, req.body);
      const result = await donDatPhongRepository.save(donDatPhong);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await donDatPhongRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt phòng' });
      }
      res.json({ message: 'Xóa đơn đặt phòng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đơn đặt phòng', error });
    }
  }
}


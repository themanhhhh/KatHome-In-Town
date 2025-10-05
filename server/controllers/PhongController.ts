import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { Phong } from '../entities/Phong';

const phongRepository = AppDataSource.getRepository(Phong);

export class PhongController {
  static async getAll(req: Request, res: Response) {
    try {
      const phongs = await phongRepository.find({
        relations: ['hangPhong', 'coSo']
      });
      res.json(phongs);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const phong = await phongRepository.findOne({
        where: { maPhong: req.params.id },
        relations: ['hangPhong', 'coSo']
      });
      if (!phong) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      res.json(phong);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin phòng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const phong = phongRepository.create(req.body);
      const result = await phongRepository.save(phong);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo phòng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const phong = await phongRepository.findOneBy({ maPhong: req.params.id });
      if (!phong) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      phongRepository.merge(phong, req.body);
      const result = await phongRepository.save(phong);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await phongRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }
      res.json({ message: 'Xóa phòng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa phòng', error });
    }
  }
}


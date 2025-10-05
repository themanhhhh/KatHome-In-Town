import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonDatDichVu } from '../entities/DonDatDichVu';

const donDatDichVuRepository = AppDataSource.getRepository(DonDatDichVu);

export class DonDatDichVuController {
  static async getAll(req: Request, res: Response) {
    try {
      const donDatDichVus = await donDatDichVuRepository.find({
        relations: ['dichVu', 'chiTietDon']
      });
      res.json(donDatDichVus);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt dịch vụ', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const donDatDichVu = await donDatDichVuRepository.findOne({
        where: { id: req.params.id },
        relations: ['dichVu', 'chiTietDon']
      });
      if (!donDatDichVu) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt dịch vụ' });
      }
      res.json(donDatDichVu);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đơn đặt dịch vụ', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const donDatDichVu = donDatDichVuRepository.create(req.body);
      const result = await donDatDichVuRepository.save(donDatDichVu);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo đơn đặt dịch vụ', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const donDatDichVu = await donDatDichVuRepository.findOneBy({ id: req.params.id });
      if (!donDatDichVu) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt dịch vụ' });
      }
      donDatDichVuRepository.merge(donDatDichVu, req.body);
      const result = await donDatDichVuRepository.save(donDatDichVu);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt dịch vụ', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await donDatDichVuRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn đặt dịch vụ' });
      }
      res.json({ message: 'Xóa đơn đặt dịch vụ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đơn đặt dịch vụ', error });
    }
  }
}


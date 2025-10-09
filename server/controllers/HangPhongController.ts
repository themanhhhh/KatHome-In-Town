import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { HangPhong } from '../entities/HangPhong';

const hangPhongRepository = AppDataSource.getRepository(HangPhong);

export class HangPhongController {
  static async getAll(req: Request, res: Response) {
    try {
      const hangPhongs = await hangPhongRepository.find({ relations: ['phong'] });
      res.json(hangPhongs);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách hạng phòng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const hangPhong = await hangPhongRepository.findOne({
        where: { maHangPhong: req.params.id },
        relations: ['phong']
      });
      if (!hangPhong) {
        return res.status(404).json({ message: 'Không tìm thấy hạng phòng' });
      }
      res.json(hangPhong);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin hạng phòng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const hangPhong = hangPhongRepository.create(req.body);
      const result = await hangPhongRepository.save(hangPhong);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo hạng phòng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const hangPhong = await hangPhongRepository.findOneBy({ maHangPhong: req.params.id });
      if (!hangPhong) {
        return res.status(404).json({ message: 'Không tìm thấy hạng phòng' });
      }
      hangPhongRepository.merge(hangPhong, req.body);
      const result = await hangPhongRepository.save(hangPhong);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hạng phòng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await hangPhongRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy hạng phòng' });
      }
      res.json({ message: 'Xóa hạng phòng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa hạng phòng', error });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const hangPhongId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const hangPhong = await hangPhongRepository.findOneBy({ maHangPhong: hangPhongId });
      if (!hangPhong) {
        return res.status(404).json({ message: 'Không tìm thấy hạng phòng' });
      }

      hangPhong.hinhAnh = imageUrl;
      const result = await hangPhongRepository.save(hangPhong);
      
      res.json({ 
        success: true, 
        message: 'Room type image updated successfully',
        hangPhong: result 
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hình ảnh hạng phòng', error });
    }
  }
}


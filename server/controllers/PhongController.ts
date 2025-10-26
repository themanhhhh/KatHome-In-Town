import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { Phong } from '../entities/Phong';
import { DonDatPhong } from '../entities/DonDatPhong';
import { ChiTietDonDatPhong } from '../entities/ChiTietDonDatPhong';
import { BookingService } from '../services/BookingService';

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
      const { moTa, hinhAnh, hangPhongMaHangPhong, coSoMaCoSo } = req.body;
      
      // Validate required fields
      if (!moTa || !hangPhongMaHangPhong || !coSoMaCoSo) {
        return res.status(400).json({ 
          message: 'Thiếu thông tin bắt buộc: moTa, hangPhongMaHangPhong, coSoMaCoSo' 
        });
      }
      
      // Generate maPhong
      const phongCount = await phongRepository.count();
      const maPhong = `P${String(phongCount + 1).padStart(4, '0')}`;
      
      const phong = phongRepository.create({
        maPhong,
        moTa,
        hinhAnh
      });
      
      const result = await phongRepository.save(phong);
      
      // Update with relations using raw SQL
      await phongRepository.query(
        `UPDATE phong SET "hangPhongMaHangPhong" = $1, "coSoMaCoSo" = $2 WHERE "maPhong" = $3`,
        [hangPhongMaHangPhong, coSoMaCoSo, maPhong]
      );
      
      // Return the updated phong
      const updatedPhong = await phongRepository.findOne({
        where: { maPhong },
        relations: ['hangPhong', 'coSo']
      });
      
      res.status(201).json(updatedPhong);
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
  static async searchAvailability(req: Request, res: Response) {
    try {
      const { checkIn, checkOut, guests, coSoId } = req.query as {
        checkIn?: string;
        checkOut?: string;
        guests?: string;
        coSoId?: string;
      };

      if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Thiếu checkIn hoặc checkOut' });
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ message: 'Định dạng ngày không hợp lệ' });
      }
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ message: 'checkOut phải sau checkIn' });
      }

      const requiredGuests = guests ? parseInt(guests, 10) : undefined;

      // Use BookingService to get available rooms
      const availableRooms = await BookingService.getAvailableRooms(
        checkInDate,
        checkOutDate,
        coSoId,
        requiredGuests
      );

      return res.json(availableRooms);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi tìm phòng trống', error });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const phongId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const phong = await phongRepository.findOneBy({ maPhong: phongId });
      if (!phong) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }

      phong.hinhAnh = imageUrl;
      const result = await phongRepository.save(phong);
      
      res.json({ 
        success: true, 
        message: 'Room image updated successfully',
        phong: result 
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hình ảnh phòng', error });
    }
  }
}


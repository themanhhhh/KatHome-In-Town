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
        relations: ['coSo']
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
        relations: ['coSo']
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
      const { tenPhong, moTa, sucChua, donGia4h, donGiaQuaDem, hinhAnh, coSoMaCoSo } = req.body;
      
      // Validate required fields
      if (!tenPhong || !moTa || !sucChua || !donGiaQuaDem || !coSoMaCoSo) {
        return res.status(400).json({ 
          message: 'Thiếu thông tin bắt buộc: tenPhong, moTa, sucChua, donGiaQuaDem, coSoMaCoSo' 
        });
      }
      
      // Generate maPhong
      const phongCount = await phongRepository.count();
      const maPhong = `P${String(phongCount + 1).padStart(4, '0')}`;
      
      const phong = phongRepository.create({
        maPhong,
        tenPhong,
        moTa,
        sucChua: parseInt(sucChua),
        donGia4h: donGia4h ? parseFloat(donGia4h) : undefined,
        donGiaQuaDem: parseFloat(donGiaQuaDem),
        hinhAnh
      });
      
      // Update with relations using raw SQL
      await phongRepository.query(
        `UPDATE phong SET "coSoMaCoSo" = $1 WHERE "maPhong" = $2`,
        [coSoMaCoSo, maPhong]
      );
      
      const result = await phongRepository.save(phong);
      
      // Return the updated phong
      const updatedPhong = await phongRepository.findOne({
        where: { maPhong },
        relations: ['coSo']
      });
      
      res.status(201).json(updatedPhong);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo phòng', error });
    }
  }
  static async update(req: Request, res: Response) {
    try {
      const { coSoMaCoSo, coSoId, ...otherFields } = req.body;
      const phong = await phongRepository.findOne({
        where: { maPhong: req.params.id },
        relations: ['coSo']
      });
      
      if (!phong) {
        return res.status(404).json({ message: 'Không tìm thấy phòng' });
      }

      // Xử lý cập nhật cơ sở (coSo)
      const coSoMaCoSoToUpdate = coSoMaCoSo || coSoId;
      if (coSoMaCoSoToUpdate) {
        // Kiểm tra cơ sở có tồn tại không
        const { CoSo } = await import('../entities/CoSo');
        const coSoRepository = AppDataSource.getRepository(CoSo);
        const coSo = await coSoRepository.findOne({
          where: { maCoSo: coSoMaCoSoToUpdate }
        });
        
        if (!coSo) {
          return res.status(400).json({ 
            message: `Không tìm thấy cơ sở với mã: ${coSoMaCoSoToUpdate}` 
          });
        }
        
        // Cập nhật relation bằng cách gán entity
        phong.coSo = coSo;
      }

      // Merge các field khác
      phongRepository.merge(phong, otherFields);
      
      // Save phong (sẽ tự động cập nhật coSoMaCoSo foreign key)
      const result = await phongRepository.save(phong);
      
      // Reload với relations để trả về đầy đủ thông tin
      const updatedPhong = await phongRepository.findOne({
        where: { maPhong: req.params.id },
        relations: ['coSo']
      });
      
      res.json(updatedPhong);
    } catch (error) {
      console.error('Error updating room:', error);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật phòng', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
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


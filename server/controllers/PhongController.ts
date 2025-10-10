import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { Phong } from '../entities/Phong';
import { DonDatPhong } from '../entities/DonDatPhong';
import { ChiTietDonDatPhong } from '../entities/ChiTietDonDatPhong';

const phongRepository = AppDataSource.getRepository(Phong);

export class PhongController {
  static async getAll(req: Request, res: Response) {
    try {
      const phongs = await phongRepository.find({
        relations: ['hangPhong', 'hangPhong.donGia', 'coSo']
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
        relations: ['hangPhong', 'hangPhong.donGia', 'coSo']
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

      const overlappingBookings = await AppDataSource.getRepository(DonDatPhong)
        .createQueryBuilder('ddp')
        .leftJoinAndSelect('ddp.chiTiet', 'ct')
        .leftJoinAndSelect('ct.phong', 'phong')
        .where('ddp.checkinDuKien < :requestedCheckout', { requestedCheckout: checkOutDate })
        .andWhere('ddp.checkoutDuKien > :requestedCheckin', { requestedCheckin: checkInDate })
        .getMany();

      const occupiedRoomIds = new Set(
        overlappingBookings.flatMap(b => (b.chiTiet || []).map(ct => ct.phong?.maPhong)).filter(Boolean) as string[]
      );
// Step 2: query all rooms (optionally by coSo), include hangPhong for capacity
      const phongQB = AppDataSource.getRepository(Phong)
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.hangPhong', 'hp')
        .leftJoinAndSelect('hp.donGia', 'dg')
        .leftJoinAndSelect('p.coSo', 'cs');
      if (coSoId) {
        phongQB.where('cs.id = :coSoId', { coSoId });
      }
      const allRooms = await phongQB.getMany();

      // Step 3: filter out occupied rooms and capacity if provided
      const availableRooms = allRooms.filter(r => !occupiedRoomIds.has(r.maPhong))
        .filter(r => (requiredGuests ? (r.hangPhong?.sucChua ?? 0) >= requiredGuests : true));

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


import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { KhachHang } from '../entities/KhachHang';

const khachHangRepository = AppDataSource.getRepository(KhachHang);

export class KhachHangController {
  static async getAll(req: Request, res: Response) {
    try {
      const khachHangs = await khachHangRepository.find();
      res.json(khachHangs);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const khachHang = await khachHangRepository.findOneBy({ maKhachHang: req.params.id });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      res.json(khachHang);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin khách hàng', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { ten, ngaySinh, gioiTinh, email, sdt, quocTich, cccd } = req.body;
      
      // Validate required fields
      if (!ten || !ngaySinh || !gioiTinh || !email || !sdt || !quocTich || !cccd) {
        return res.status(400).json({ 
          message: 'Thiếu thông tin bắt buộc: ten, ngaySinh, gioiTinh, email, sdt, quocTich, cccd' 
        });
      }
      
      // Generate maKhachHang
      const khachHangCount = await khachHangRepository.count();
      const maKhachHang = `KH${String(khachHangCount + 1).padStart(4, '0')}`;
      
      const khachHang = khachHangRepository.create({
        maKhachHang,
        ten,
        ngaySinh: new Date(ngaySinh),
        gioiTinh,
        email,
        sdt,
        quocTich,
        cccd
      });
      
      const result = await khachHangRepository.save(khachHang);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo khách hàng', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const khachHang = await khachHangRepository.findOneBy({ maKhachHang: req.params.id });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      khachHangRepository.merge(khachHang, req.body);
      const result = await khachHangRepository.save(khachHang);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật khách hàng', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const maKhachHang = req.params.id;
      
      // Check if customer exists
      const khachHang = await khachHangRepository.findOneBy({ maKhachHang });
      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      
      // Check if customer has related bookings
      const { DonDatPhong } = await import('../entities/DonDatPhong');
      const donDatPhongRepository = AppDataSource.getRepository(DonDatPhong);
      const relatedBookings = await donDatPhongRepository.count({
        where: { khachHang: { maKhachHang } }
      });
      
      if (relatedBookings > 0) {
        return res.status(400).json({ 
          message: 'Không thể xóa khách hàng này',
          error: `Khách hàng đang có ${relatedBookings} đơn đặt phòng liên quan. Vui lòng xóa hoặc cập nhật các đơn đặt phòng trước.`
        });
      }
      
      // Delete customer
      const result = await khachHangRepository.delete(maKhachHang);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }
      
      res.json({ message: 'Xóa khách hàng thành công' });
    } catch (error: any) {
      // Handle foreign key constraint errors
      if (error.code === '23503' || error.message?.includes('foreign key')) {
        return res.status(400).json({ 
          message: 'Không thể xóa khách hàng này',
          error: 'Khách hàng đang được sử dụng trong các đơn đặt phòng. Vui lòng xóa hoặc cập nhật các đơn đặt phòng trước.'
        });
      }
      res.status(500).json({ 
        message: 'Lỗi khi xóa khách hàng', 
        error: error.message || 'Có lỗi xảy ra'
      });
    }
  }
}


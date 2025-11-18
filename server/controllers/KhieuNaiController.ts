import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { KhieuNai } from '../entities/KhieuNai';

const khieuNaiRepository = AppDataSource.getRepository(KhieuNai);

export class KhieuNaiController {
  // Get all complaints (admin only)
  static async getAll(req: Request, res: Response) {
    try {
      const { trangThai, loaiKhieuNai } = req.query;
      
      const queryBuilder = khieuNaiRepository.createQueryBuilder('khieuNai')
        .leftJoinAndSelect('khieuNai.khachHang', 'khachHang')
        .leftJoinAndSelect('khieuNai.donDatPhong', 'donDatPhong')
        .orderBy('khieuNai.ngayKhieuNai', 'DESC');

      if (trangThai) {
        queryBuilder.andWhere('khieuNai.trangThai = :trangThai', { trangThai });
      }

      if (loaiKhieuNai) {
        queryBuilder.andWhere('khieuNai.loaiKhieuNai = :loaiKhieuNai', { loaiKhieuNai });
      }

      const khieuNais = await queryBuilder.getMany();
      res.json(khieuNais);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách khiếu nại', error });
    }
  }

  // Get complaint by ID
  static async getById(req: Request, res: Response) {
    try {
      const khieuNai = await khieuNaiRepository.findOne({
        where: { maKhieuNai: req.params.id },
        relations: ['khachHang', 'donDatPhong']
      });
      if (!khieuNai) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      res.json(khieuNai);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin khiếu nại', error });
    }
  }

  // Create new complaint (public endpoint - no auth required)
  static async create(req: Request, res: Response) {
    try {
      const { 
        tieuDe, 
        dienGiai, 
        loaiKhieuNai, 
        hoTen, 
        email, 
        soDienThoai, 
        khachHangMaKhachHang, 
        donDatPhongMaDatPhong 
      } = req.body;

      // Validation
      if (!tieuDe || !dienGiai) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tiêu đề và nội dung khiếu nại' });
      }

      // For guest users, require contact info
      if (!khachHangMaKhachHang && (!hoTen || !email)) {
        return res.status(400).json({ message: 'Vui lòng cung cấp họ tên và email' });
      }

      const khieuNai = khieuNaiRepository.create({
        tieuDe,
        dienGiai,
        loaiKhieuNai: loaiKhieuNai || 'other',
        hoTen,
        email,
        soDienThoai,
        trangThai: 'pending'
      });

      // Set relations if provided
      if (khachHangMaKhachHang) {
        (khieuNai as any).khachHangMaKhachHang = khachHangMaKhachHang;
      }
      if (donDatPhongMaDatPhong) {
        (khieuNai as any).donDatPhongMaDatPhong = donDatPhongMaDatPhong;
      }

      const result = await khieuNaiRepository.save(khieuNai);
      
      res.status(201).json({ 
        message: 'Khiếu nại của bạn đã được gửi thành công. Chúng tôi sẽ xử lý và phản hồi trong thời gian sớm nhất.',
        data: result 
      });
    } catch (error) {
      console.error('Error creating complaint:', error);
      res.status(500).json({ message: 'Lỗi khi tạo khiếu nại', error });
    }
  }

  // Update complaint status (admin only)
  static async updateStatus(req: Request, res: Response) {
    try {
      const { trangThai, phanHoi } = req.body;
      
      const khieuNai = await khieuNaiRepository.findOneBy({ maKhieuNai: req.params.id });
      if (!khieuNai) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }

      if (trangThai) {
        khieuNai.trangThai = trangThai;
      }

      if (phanHoi) {
        khieuNai.phanHoi = phanHoi;
        khieuNai.ngayPhanHoi = new Date();
      }

      const result = await khieuNaiRepository.save(khieuNai);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật khiếu nại', error });
    }
  }

  // Update complaint (admin only)
  static async update(req: Request, res: Response) {
    try {
      const khieuNai = await khieuNaiRepository.findOneBy({ maKhieuNai: req.params.id });
      if (!khieuNai) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      khieuNaiRepository.merge(khieuNai, req.body);
      const result = await khieuNaiRepository.save(khieuNai);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật khiếu nại', error });
    }
  }

  // Delete complaint (admin only)
  static async delete(req: Request, res: Response) {
    try {
      const result = await khieuNaiRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khiếu nại' });
      }
      res.json({ message: 'Xóa khiếu nại thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa khiếu nại', error });
    }
  }
}


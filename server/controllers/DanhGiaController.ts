import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DanhGia } from '../entities/DanhGia';

const danhGiaRepository = AppDataSource.getRepository(DanhGia);

export class DanhGiaController {
  // Get all reviews (public - for displaying on homepage)
  static async getAll(req: Request, res: Response) {
    try {
      const { trangThai, phongMaPhong, limit } = req.query;
      
      const queryBuilder = danhGiaRepository.createQueryBuilder('danhGia')
        .leftJoinAndSelect('danhGia.phong', 'phong')
        .leftJoinAndSelect('danhGia.donDatPhong', 'donDatPhong')
        .orderBy('danhGia.ngayDanhGia', 'DESC');

      // Filter by status (default: approved for public view)
      if (trangThai) {
        queryBuilder.andWhere('danhGia.trangThai = :trangThai', { trangThai });
      } else {
        queryBuilder.andWhere('danhGia.trangThai = :trangThai', { trangThai: 'approved' });
      }

      // Filter by room
      if (phongMaPhong) {
        queryBuilder.andWhere('danhGia.phongMaPhong = :phongMaPhong', { phongMaPhong });
      }

      // Limit results
      if (limit) {
        queryBuilder.take(parseInt(limit as string));
      }

      const danhGias = await queryBuilder.getMany();
      res.json(danhGias);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá', error });
    }
  }

  // Get review by ID
  static async getById(req: Request, res: Response) {
    try {
      const danhGia = await danhGiaRepository.findOne({
        where: { maDanhGia: req.params.id },
        relations: ['phong', 'donDatPhong']
      });
      if (!danhGia) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }
      res.json(danhGia);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin đánh giá', error });
    }
  }

  // Create new review (public endpoint - no auth required)
  static async create(req: Request, res: Response) {
    try {
      const { diemDanhGia, noiDung, hoTen, email, soDienThoai, phongMaPhong, donDatPhongMaDatPhong } = req.body;

      // Validation
      if (!diemDanhGia || !noiDung) {
        return res.status(400).json({ message: 'Vui lòng cung cấp điểm đánh giá và nội dung' });
      }

      if (diemDanhGia < 1 || diemDanhGia > 5) {
        return res.status(400).json({ message: 'Điểm đánh giá phải từ 1 đến 5' });
      }

      // For guest users, require contact info
      if (!hoTen || !email) {
        return res.status(400).json({ message: 'Vui lòng cung cấp họ tên và email' });
      }

      const danhGia = danhGiaRepository.create({
        diemDanhGia,
        noiDung,
        hoTen,
        email,
        soDienThoai,
        trangThai: 'pending' // Reviews need approval
      });

      // Set relations if provided
      if (phongMaPhong) {
        (danhGia as any).phongMaPhong = phongMaPhong;
      }
      if (donDatPhongMaDatPhong) {
        (danhGia as any).donDatPhongMaDatPhong = donDatPhongMaDatPhong;
      }

      const result = await danhGiaRepository.save(danhGia);
      res.status(201).json({ 
        message: 'Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ được hiển thị sau khi được phê duyệt.',
        data: result 
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Lỗi khi tạo đánh giá', error });
    }
  }

  // Update review status (admin only)
  static async updateStatus(req: Request, res: Response) {
    try {
      const { trangThai, phanHoi } = req.body;
      
      const danhGia = await danhGiaRepository.findOneBy({ maDanhGia: req.params.id });
      if (!danhGia) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }

      if (trangThai) {
        danhGia.trangThai = trangThai;
      }

      if (phanHoi) {
        danhGia.phanHoi = phanHoi;
        danhGia.ngayPhanHoi = new Date();
      }

      const result = await danhGiaRepository.save(danhGia);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá', error });
    }
  }

  // Delete review (admin only)
  static async delete(req: Request, res: Response) {
    try {
      const result = await danhGiaRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
      }
      res.json({ message: 'Xóa đánh giá thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đánh giá', error });
    }
  }

  // Get review statistics
  static async getStats(req: Request, res: Response) {
    try {
      const { phongMaPhong, trangThai } = req.query;

      const queryBuilder = danhGiaRepository.createQueryBuilder('danhGia');

      // Nếu truyền trạng thái thì lọc theo, còn không thì lấy tất cả để thống kê tổng
      if (trangThai) {
        queryBuilder.where('danhGia.trangThai = :trangThai', { trangThai });
      }

      if (phongMaPhong) {
        if (queryBuilder.expressionMap.wheres.length > 0) {
          queryBuilder.andWhere('danhGia.phongMaPhong = :phongMaPhong', { phongMaPhong });
        } else {
          queryBuilder.where('danhGia.phongMaPhong = :phongMaPhong', { phongMaPhong });
        }
      }

      const reviews = await queryBuilder.getMany();
      
      const stats = {
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? (reviews.reduce((sum, r) => sum + r.diemDanhGia, 0) / reviews.length).toFixed(1)
          : 0,
        ratingDistribution: {
          5: reviews.filter(r => r.diemDanhGia === 5).length,
          4: reviews.filter(r => r.diemDanhGia === 4).length,
          3: reviews.filter(r => r.diemDanhGia === 3).length,
          2: reviews.filter(r => r.diemDanhGia === 2).length,
          1: reviews.filter(r => r.diemDanhGia === 1).length,
        }
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thống kê đánh giá', error });
    }
  }
}


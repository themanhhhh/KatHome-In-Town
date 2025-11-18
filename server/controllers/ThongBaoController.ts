import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { ThongBao } from '../entities/ThongBao';
import { KhachHang } from '../entities/KhachHang';

const thongBaoRepository = AppDataSource.getRepository(ThongBao);
const khachHangRepository = AppDataSource.getRepository(KhachHang);

export class ThongBaoController {
  // Get all notifications (admin only - with filters)
  static async getAll(req: Request, res: Response) {
    try {
      const { khachHangMaKhachHang, trangThai, loaiThongBao, daDoc, limit, offset } = req.query;
      
      const queryBuilder = thongBaoRepository.createQueryBuilder('thongBao')
        .leftJoinAndSelect('thongBao.khachHang', 'khachHang')
        .leftJoinAndSelect('thongBao.nguoiGui', 'nguoiGui')
        .orderBy('thongBao.ngayTao', 'DESC');

      // Filter by customer
      if (khachHangMaKhachHang) {
        queryBuilder.andWhere('thongBao.khachHangMaKhachHang = :khachHangMaKhachHang', { khachHangMaKhachHang });
      }

      // Filter by status
      if (trangThai) {
        queryBuilder.andWhere('thongBao.trangThai = :trangThai', { trangThai });
      }

      // Filter by type
      if (loaiThongBao) {
        queryBuilder.andWhere('thongBao.loaiThongBao = :loaiThongBao', { loaiThongBao });
      }

      // Filter by read status
      if (daDoc !== undefined) {
        queryBuilder.andWhere('thongBao.daDoc = :daDoc', { daDoc: daDoc === 'true' });
      }

      // Pagination
      if (limit) {
        queryBuilder.take(parseInt(limit as string));
      }
      if (offset) {
        queryBuilder.skip(parseInt(offset as string));
      }

      const [thongBaos, total] = await queryBuilder.getManyAndCount();
      
      res.json({
        data: thongBaos,
        total,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo', error });
    }
  }

  // Get notification by ID
  static async getById(req: Request, res: Response) {
    try {
      const thongBao = await thongBaoRepository.findOne({
        where: { maThongBao: req.params.id },
        relations: ['khachHang', 'nguoiGui']
      });
      
      if (!thongBao) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }
      
      res.json(thongBao);
    } catch (error) {
      console.error('Error getting notification:', error);
      res.status(500).json({ message: 'Lỗi khi lấy thông báo', error });
    }
  }

  // Get notifications by customer (for customer view)
  static async getByCustomer(req: Request, res: Response) {
    try {
      const { maKhachHang } = req.params;
      const { trangThai, daDoc, limit } = req.query;

      const queryBuilder = thongBaoRepository.createQueryBuilder('thongBao')
        .leftJoinAndSelect('thongBao.nguoiGui', 'nguoiGui')
        .where('thongBao.khachHangMaKhachHang = :maKhachHang', { maKhachHang })
        .orderBy('thongBao.ngayTao', 'DESC');

      if (trangThai) {
        queryBuilder.andWhere('thongBao.trangThai = :trangThai', { trangThai });
      }

      if (daDoc !== undefined) {
        queryBuilder.andWhere('thongBao.daDoc = :daDoc', { daDoc: daDoc === 'true' });
      }

      if (limit) {
        queryBuilder.take(parseInt(limit as string));
      }

      const thongBaos = await queryBuilder.getMany();
      res.json(thongBaos);
    } catch (error) {
      console.error('Error getting customer notifications:', error);
      res.status(500).json({ message: 'Lỗi khi lấy thông báo của khách hàng', error });
    }
  }

  // Create new notification (admin only)
  static async create(req: Request, res: Response) {
    try {
      const { 
        khachHangMaKhachHang, 
        tieuDe, 
        noiDung, 
        loaiThongBao, 
        linkLienKet, 
        ghiChu 
      } = req.body;

      // Validate required fields
      if (!khachHangMaKhachHang || !tieuDe || !noiDung) {
        return res.status(400).json({ 
          message: 'Vui lòng điền đầy đủ thông tin: khách hàng, tiêu đề, nội dung' 
        });
      }

      // Check if customer exists
      const khachHang = await khachHangRepository.findOne({
        where: { maKhachHang: khachHangMaKhachHang }
      });

      if (!khachHang) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      }

      // Get current user (admin) from request
      const nguoiGuiId = (req as any).userId || null;

      // Create notification
      const thongBao = thongBaoRepository.create({
        tieuDe,
        noiDung,
        loaiThongBao: loaiThongBao || 'system',
        trangThai: 'unread',
        daDoc: false,
        linkLienKet,
        ghiChu
      });

      // Set foreign keys
      (thongBao as any).khachHangMaKhachHang = khachHangMaKhachHang;
      if (nguoiGuiId) {
        (thongBao as any).nguoiGuiId = nguoiGuiId;
      }

      const savedThongBao = await thongBaoRepository.save(thongBao);
      
      // Load relations
      const thongBaoWithRelations = await thongBaoRepository.findOne({
        where: { maThongBao: savedThongBao.maThongBao },
        relations: ['khachHang', 'nguoiGui']
      });

      res.status(201).json({
        message: 'Tạo thông báo thành công',
        data: thongBaoWithRelations
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Lỗi khi tạo thông báo', error });
    }
  }

  // Create multiple notifications (send to multiple customers)
  static async createMultiple(req: Request, res: Response) {
    try {
      const { 
        khachHangMaKhachHangs, // Array of customer IDs
        tieuDe, 
        noiDung, 
        loaiThongBao, 
        linkLienKet, 
        ghiChu 
      } = req.body;

      if (!khachHangMaKhachHangs || !Array.isArray(khachHangMaKhachHangs) || khachHangMaKhachHangs.length === 0) {
        return res.status(400).json({ 
          message: 'Vui lòng cung cấp danh sách khách hàng' 
        });
      }

      if (!tieuDe || !noiDung) {
        return res.status(400).json({ 
          message: 'Vui lòng điền đầy đủ tiêu đề và nội dung' 
        });
      }

      const nguoiGuiId = (req as any).userId || null;
      const notifications = [];

      for (const maKhachHang of khachHangMaKhachHangs) {
        // Check if customer exists
        const khachHang = await khachHangRepository.findOne({
          where: { maKhachHang }
        });

        if (khachHang) {
          const thongBao = thongBaoRepository.create({
            tieuDe,
            noiDung,
            loaiThongBao: loaiThongBao || 'system',
            trangThai: 'unread',
            daDoc: false,
            linkLienKet,
            ghiChu
          });
          // Set foreign keys
          (thongBao as any).khachHangMaKhachHang = maKhachHang;
          if (nguoiGuiId) {
            (thongBao as any).nguoiGuiId = nguoiGuiId;
          }
          notifications.push(thongBao);
        }
      }

      if (notifications.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy khách hàng nào hợp lệ' });
      }

      const savedNotifications = await thongBaoRepository.save(notifications);

      res.status(201).json({
        message: `Đã gửi thông báo đến ${savedNotifications.length} khách hàng`,
        data: savedNotifications
      });
    } catch (error) {
      console.error('Error creating multiple notifications:', error);
      res.status(500).json({ message: 'Lỗi khi tạo thông báo', error });
    }
  }

  // Update notification
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tieuDe, noiDung, loaiThongBao, trangThai, linkLienKet, ghiChu } = req.body;

      const thongBao = await thongBaoRepository.findOne({
        where: { maThongBao: id }
      });

      if (!thongBao) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }

      // Update fields
      if (tieuDe !== undefined) thongBao.tieuDe = tieuDe;
      if (noiDung !== undefined) thongBao.noiDung = noiDung;
      if (loaiThongBao !== undefined) thongBao.loaiThongBao = loaiThongBao;
      if (trangThai !== undefined) thongBao.trangThai = trangThai;
      if (linkLienKet !== undefined) thongBao.linkLienKet = linkLienKet;
      if (ghiChu !== undefined) thongBao.ghiChu = ghiChu;

      const updatedThongBao = await thongBaoRepository.save(thongBao);

      const thongBaoWithRelations = await thongBaoRepository.findOne({
        where: { maThongBao: updatedThongBao.maThongBao },
        relations: ['khachHang', 'nguoiGui']
      });

      res.json({
        message: 'Cập nhật thông báo thành công',
        data: thongBaoWithRelations
      });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật thông báo', error });
    }
  }

  // Mark notification as read
  static async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const thongBao = await thongBaoRepository.findOne({
        where: { maThongBao: id }
      });

      if (!thongBao) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }

      thongBao.daDoc = true;
      thongBao.ngayDoc = new Date();
      thongBao.trangThai = 'read';

      const updatedThongBao = await thongBaoRepository.save(thongBao);

      res.json({
        message: 'Đã đánh dấu đã đọc',
        data: updatedThongBao
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Lỗi khi đánh dấu đã đọc', error });
    }
  }

  // Mark multiple notifications as read
  static async markMultipleAsRead(req: Request, res: Response) {
    try {
      const { ids } = req.body; // Array of notification IDs

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Vui lòng cung cấp danh sách ID thông báo' });
      }

      await thongBaoRepository
        .createQueryBuilder()
        .update(ThongBao)
        .set({ 
          daDoc: true, 
          ngayDoc: new Date(), 
          trangThai: 'read' 
        })
        .where('maThongBao IN (:...ids)', { ids })
        .execute();

      res.json({
        message: `Đã đánh dấu ${ids.length} thông báo là đã đọc`
      });
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      res.status(500).json({ message: 'Lỗi khi đánh dấu đã đọc', error });
    }
  }

  // Delete notification
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const thongBao = await thongBaoRepository.findOne({
        where: { maThongBao: id }
      });

      if (!thongBao) {
        return res.status(404).json({ message: 'Không tìm thấy thông báo' });
      }

      await thongBaoRepository.remove(thongBao);

      res.json({ message: 'Xóa thông báo thành công' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Lỗi khi xóa thông báo', error });
    }
  }

  // Get unread count for a customer
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const { maKhachHang } = req.params;

      const count = await thongBaoRepository
        .createQueryBuilder('thongBao')
        .where('thongBao.khachHangMaKhachHang = :maKhachHang', { maKhachHang })
        .andWhere('thongBao.daDoc = :daDoc', { daDoc: false })
        .getCount();

      res.json({ count });
    } catch (error) {
      console.error('Error getting unread count:', error);
      res.status(500).json({ message: 'Lỗi khi lấy số lượng thông báo chưa đọc', error });
    }
  }
}


import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { NhanVien } from '../entities/NhanVien';

const nhanVienRepository = AppDataSource.getRepository(NhanVien);

export class NhanVienController {
  static async getAll(req: Request, res: Response) {
    try {
      const nhanViens = await nhanVienRepository.find({ relations: ['chucVu'] });
      res.json(nhanViens);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const nhanVien = await nhanVienRepository.findOne({
        where: { maNhanVien: req.params.id },
        relations: ['chucVu']
      });
      if (!nhanVien) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      res.json(nhanVien);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin nhân viên', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const nhanVien = nhanVienRepository.create(req.body);
      const result = await nhanVienRepository.save(nhanVien);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo nhân viên', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const nhanVien = await nhanVienRepository.findOneBy({ maNhanVien: req.params.id });
      if (!nhanVien) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      nhanVienRepository.merge(nhanVien, req.body);
      const result = await nhanVienRepository.save(nhanVien);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật nhân viên', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await nhanVienRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      res.json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa nhân viên', error });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const nhanVienId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const nhanVien = await nhanVienRepository.findOneBy({ maNhanVien: nhanVienId });
      if (!nhanVien) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }

      nhanVien.hinhAnh = imageUrl;
      const result = await nhanVienRepository.save(nhanVien);
      
      res.json({ 
        success: true, 
        message: 'Employee image updated successfully',
        nhanVien: result 
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hình ảnh nhân viên', error });
    }
  }
}


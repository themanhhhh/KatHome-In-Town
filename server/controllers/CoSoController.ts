import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { CoSo } from '../entities/CoSo';

const coSoRepository = AppDataSource.getRepository(CoSo);

export class CoSoController {
  static async getAll(req: Request, res: Response) {
    try {
      const coSos = await coSoRepository.find({ relations: ['phong', 'phong.hangPhong'] });
      res.json(coSos);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách cơ sở', error });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const coSo = await coSoRepository.findOne({
        where: { maCoSo: req.params.id },
        relations: ['phong', 'phong.hangPhong']
      });
      if (!coSo) {
        return res.status(404).json({ message: 'Không tìm thấy cơ sở' });
      }
      res.json(coSo);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin cơ sở', error });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const coSo = coSoRepository.create(req.body);
      const result = await coSoRepository.save(coSo);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo cơ sở', error });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const coSo = await coSoRepository.findOneBy({ maCoSo: req.params.id });
      if (!coSo) {
        return res.status(404).json({ message: 'Không tìm thấy cơ sở' });
      }
      coSoRepository.merge(coSo, req.body);
      const result = await coSoRepository.save(coSo);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật cơ sở', error });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await coSoRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy cơ sở' });
      }
      res.json({ message: 'Xóa cơ sở thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa cơ sở', error });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      const coSoId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }

      const coSo = await coSoRepository.findOneBy({ maCoSo: coSoId });
      if (!coSo) {
        return res.status(404).json({ message: 'Không tìm thấy cơ sở' });
      }

      coSo.hinhAnh = imageUrl;
      const result = await coSoRepository.save(coSo);
      
      res.json({ 
        success: true, 
        message: 'Facility image updated successfully',
        coSo: result 
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật hình ảnh cơ sở', error });
    }
  }
}


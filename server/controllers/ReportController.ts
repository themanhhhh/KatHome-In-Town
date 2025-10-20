import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { Report } from '../entities/Report';

const reportRepository = AppDataSource.getRepository(Report);

export class ReportController {
  /**
   * Get all reports
   */
  static async getAll(req: Request, res: Response) {
    try {
      const reports = await reportRepository.find({
        order: { createdAt: 'DESC' }
      });
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy danh sách báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Get report by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const report = await reportRepository.findOne({
        where: { id: req.params.id }
      });

      if (!report) {
        return res.status(404).json({ message: 'Không tìm thấy báo cáo' });
      }

      res.json(report);
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({ 
        message: 'Lỗi khi lấy thông tin báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Create new report
   */
  static async create(req: Request, res: Response) {
    try {
      const { title, type, period, description, value, change, trend, status } = req.body;

      // Validation
      if (!title || !type || !period) {
        return res.status(400).json({ 
          message: 'Missing required fields: title, type, period' 
        });
      }

      // Validate type
      const validTypes = ['revenue', 'bookings', 'occupancy', 'customer', 'rooms'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ 
          message: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
        });
      }

      // Validate period
      const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
      if (!validPeriods.includes(period)) {
        return res.status(400).json({ 
          message: `Invalid period. Must be one of: ${validPeriods.join(', ')}` 
        });
      }

      const report = reportRepository.create({
        title,
        type,
        period,
        description,
        value: value || 0,
        change: change || 0,
        trend: trend || 'stable',
        status: status || 'processing',
        fileSize: '0 KB'
      });

      const savedReport = await reportRepository.save(report);
      
      res.status(201).json({
        success: true,
        message: 'Tạo báo cáo thành công',
        data: savedReport
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ 
        message: 'Lỗi khi tạo báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Update report
   */
  static async update(req: Request, res: Response) {
    try {
      const report = await reportRepository.findOne({
        where: { id: req.params.id }
      });

      if (!report) {
        return res.status(404).json({ message: 'Không tìm thấy báo cáo' });
      }

      // Merge updated fields
      reportRepository.merge(report, req.body);
      const updatedReport = await reportRepository.save(report);

      res.json({
        success: true,
        message: 'Cập nhật báo cáo thành công',
        data: updatedReport
      });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Delete report
   */
  static async delete(req: Request, res: Response) {
    try {
      const result = await reportRepository.delete(req.params.id);
      
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Không tìm thấy báo cáo' });
      }

      res.json({ 
        success: true,
        message: 'Xóa báo cáo thành công' 
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({ 
        message: 'Lỗi khi xóa báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Bulk delete reports
   */
  static async bulkDelete(req: Request, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ 
          message: 'Missing or invalid ids array' 
        });
      }

      const result = await reportRepository.delete(ids);

      res.json({
        success: true,
        message: `Xóa ${result.affected} báo cáo thành công`,
        deletedCount: result.affected
      });
    } catch (error) {
      console.error('Error bulk deleting reports:', error);
      res.status(500).json({ 
        message: 'Lỗi khi xóa báo cáo hàng loạt', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  /**
   * Mark report as completed
   */
  static async markCompleted(req: Request, res: Response) {
    try {
      const report = await reportRepository.findOne({
        where: { id: req.params.id }
      });

      if (!report) {
        return res.status(404).json({ message: 'Không tìm thấy báo cáo' });
      }

      report.status = 'completed';
      
      // Calculate file size based on report type (mock)
      const sizes = ['0.5 MB', '1.2 MB', '1.8 MB', '2.3 MB', '3.1 MB'];
      report.fileSize = sizes[Math.floor(Math.random() * sizes.length)];

      const updatedReport = await reportRepository.save(report);

      res.json({
        success: true,
        message: 'Đánh dấu báo cáo hoàn thành',
        data: updatedReport
      });
    } catch (error) {
      console.error('Error marking report as completed:', error);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật trạng thái báo cáo', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}


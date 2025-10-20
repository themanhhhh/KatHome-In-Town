import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { Revenue } from '../entities/Revenue';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

const revenueRepository = AppDataSource.getRepository(Revenue);

export class RevenueController {
  /**
   * Get all revenue records
   */
  static async getAll(req: Request, res: Response) {
    try {
      const revenues = await revenueRepository.find({
        relations: ['donDatPhong', 'donDatPhong.coSo', 'donDatPhong.khachHang'],
        order: {
          paymentDate: 'DESC',
        },
      });
      res.json(revenues);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách doanh thu', error });
    }
  }

  /**
   * Get revenue by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const revenue = await revenueRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['donDatPhong', 'donDatPhong.coSo', 'donDatPhong.khachHang'],
      });
      if (!revenue) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi doanh thu' });
      }
      res.json(revenue);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin doanh thu', error });
    }
  }

  /**
   * Get revenue summary
   * Query params:
   * - startDate: ISO date string (optional)
   * - endDate: ISO date string (optional)
   * - groupBy: 'day' | 'month' | 'year' (optional, default: 'month')
   */
  static async getSummary(req: Request, res: Response) {
    try {
      const { startDate, endDate, groupBy = 'month' } = req.query;

      // Build where clause
      const where: any = {};
      if (startDate && endDate) {
        where.paymentDate = Between(new Date(startDate as string), new Date(endDate as string));
      } else if (startDate) {
        where.paymentDate = MoreThanOrEqual(new Date(startDate as string));
      } else if (endDate) {
        where.paymentDate = LessThanOrEqual(new Date(endDate as string));
      }

      const revenues = await revenueRepository.find({
        where,
        relations: ['donDatPhong', 'donDatPhong.coSo'],
        order: {
          paymentDate: 'ASC',
        },
      });

      // Calculate summary
      const totalRevenue = revenues.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
      const totalBookings = revenues.length;
      const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      // Group by payment method
      const byPaymentMethod: Record<string, { count: number; total: number }> = {};
      revenues.forEach((r) => {
        if (!byPaymentMethod[r.paymentMethod]) {
          byPaymentMethod[r.paymentMethod] = { count: 0, total: 0 };
        }
        byPaymentMethod[r.paymentMethod].count++;
        byPaymentMethod[r.paymentMethod].total += parseFloat(r.amount.toString());
      });

      // Group by branch (co so)
      const byBranch: Record<string, { count: number; total: number; name: string }> = {};
      revenues.forEach((r) => {
        const branchId = r.donDatPhong?.coSo?.maCoSo || 'unknown';
        const branchName = r.donDatPhong?.coSo?.tenCoSo || 'Unknown';
        if (!byBranch[branchId]) {
          byBranch[branchId] = { count: 0, total: 0, name: branchName };
        }
        byBranch[branchId].count++;
        byBranch[branchId].total += parseFloat(r.amount.toString());
      });

      // Group by time period
      const groupedData: Record<string, { count: number; total: number }> = {};
      revenues.forEach((r) => {
        const date = new Date(r.paymentDate);
        let key: string;
        
        if (groupBy === 'day') {
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (groupBy === 'year') {
          key = date.getFullYear().toString();
        } else {
          // month (default)
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = { count: 0, total: 0 };
        }
        groupedData[key].count++;
        groupedData[key].total += parseFloat(r.amount.toString());
      });

      res.json({
        summary: {
          totalRevenue,
          totalBookings,
          averageRevenue,
        },
        byPaymentMethod,
        byBranch,
        timeline: groupedData,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      });
    } catch (error) {
      console.error('Error getting revenue summary:', error);
      res.status(500).json({ message: 'Lỗi khi lấy tổng hợp doanh thu', error });
    }
  }
}


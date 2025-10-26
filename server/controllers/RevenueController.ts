import { Request, Response } from 'express';
import { AppDataSource } from '../data/datasource';
import { DonDatPhong } from '../entities/DonDatPhong';
import { Revenue } from '../entities/Revenue';

const donDatPhongRepository = AppDataSource.getRepository(DonDatPhong);
const revenueRepository = AppDataSource.getRepository(Revenue);

export class RevenueController {
  /**
   * Lấy tất cả revenue records
   * GET /api/revenue
   */
  static async getAll(req: Request, res: Response) {
    try {
      console.log('📊 Fetching all revenue records...');
      
      const revenues = await revenueRepository.find({
        relations: ['donDatPhong', 'donDatPhong.khachHang', 'donDatPhong.coSo'],
        order: { paymentDate: 'DESC' }
      });
      
      console.log(`📋 Found ${revenues.length} revenue records`);
      
      res.json(revenues);
    } catch (error) {
      console.error('❌ Error fetching revenue records:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy danh sách doanh thu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy revenue record theo ID
   * GET /api/revenue/:id
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(`📊 Fetching revenue record: ${id}`);
      
      const revenue = await revenueRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['donDatPhong', 'donDatPhong.khachHang', 'donDatPhong.coSo']
      });
      
      if (!revenue) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bản ghi doanh thu'
        });
      }
      
      res.json(revenue);
    } catch (error) {
      console.error('❌ Error fetching revenue record:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy bản ghi doanh thu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy thống kê tổng quan doanh thu
   * GET /api/revenue/summary
   */
  static async getSummary(req: Request, res: Response) {
    try {
      console.log('📊 Fetching revenue summary...');
      
      // Lấy tất cả bookings
      const bookings = await donDatPhongRepository.find({
        order: { ngayDat: 'DESC' }
      });
      
      console.log(`📋 Found ${bookings.length} bookings`);
      
      // Tính toán thống kê
      const stats = calculateRevenueStats(bookings);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error fetching revenue summary:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy thống kê doanh thu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy doanh thu theo thời gian với filter
   * GET /api/revenue/trend?period=month&limit=6
   */
  static async getTrend(req: Request, res: Response) {
    try {
      const { period = 'month', limit = 6 } = req.query;
      
      console.log(`📈 Fetching revenue trend: ${period}, limit: ${limit}`);
      
      // Lấy tất cả bookings
      const bookings = await donDatPhongRepository.find({
        order: { ngayDat: 'DESC' }
      });
      
      // Tính toán theo period
      const trendData = calculateTrendData(bookings, period as string, parseInt(limit as string));
      
      console.log('📊 Trend data calculated:', trendData);
      
      res.json({
        success: true,
        data: trendData
      });
    } catch (error) {
      console.error('❌ Error fetching revenue trend:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy xu hướng doanh thu', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy thống kê theo trạng thái booking
   * GET /api/revenue/status-stats
   */
  static async getStatusStats(req: Request, res: Response) {
    try {
      console.log('📊 Fetching status statistics...');
      
      const bookings = await donDatPhongRepository.find();
      
      const statusStats = calculateStatusStats(bookings);
      
      res.json({
        success: true,
        data: statusStats
      });
    } catch (error) {
      console.error('❌ Error fetching status stats:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy thống kê trạng thái', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy danh sách bookings chi tiết cho Excel export
   * GET /api/revenue/bookings-detail
   */
  static async getBookingsDetail(req: Request, res: Response) {
    try {
      console.log('📋 Fetching bookings detail for export...');
      
      const bookings = await donDatPhongRepository.find({
        relations: ['khachHang', 'coSo'],
        order: { ngayDat: 'DESC' }
      });
      
      const bookingsDetail = bookings.map(booking => ({
        maDatPhong: booking.maDatPhong,
        customerName: booking.customerName || booking.khachHang?.ten || 'N/A',
        customerEmail: booking.customerEmail || booking.khachHang?.email || 'N/A',
        customerPhone: booking.customerPhone || booking.khachHang?.sdt || 'N/A',
        ngayDat: booking.ngayDat,
        checkinDuKien: booking.checkinDuKien,
        checkoutDuKien: booking.checkoutDuKien,
        totalAmount: booking.totalAmount || 0,
        trangThai: booking.trangThai,
        paymentStatus: booking.paymentStatus || 'pending',
        paymentMethod: booking.paymentMethod || 'N/A',
        coSo: booking.coSo?.tenCoSo || 'N/A'
      }));
      
      res.json({
        success: true,
        data: bookingsDetail
      });
    } catch (error) {
      console.error('❌ Error fetching bookings detail:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy chi tiết bookings', 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

/**
 * Tính toán thống kê tổng quan
 */
function calculateRevenueStats(bookings: DonDatPhong[]) {
  const validBookings = bookings.filter(b => b.trangThai !== 'AB');
  
  const totalRevenue = validBookings.reduce((sum, b) => {
    const amount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : (b.totalAmount || 0);
    return sum + amount;
  }, 0);
  const totalBookings = validBookings.length;
  const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  
  const confirmedBookings = bookings.filter(b => b.trangThai === 'CF').length;
  const cancelledBookings = bookings.filter(b => b.trangThai === 'AB').length;
  const completedBookings = bookings.filter(b => b.trangThai === 'CC').length;
  
  const successRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
  
  return {
    totalRevenue,
    totalBookings,
    averageRevenue,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    successRate
  };
}

/**
 * Tính toán xu hướng theo thời gian
 */
function calculateTrendData(bookings: DonDatPhong[], period: string, limit: number) {
  const validBookings = bookings.filter(b => b.trangThai !== 'AB');
  
  switch (period) {
    case 'week':
      return calculateWeeklyTrend(validBookings, limit);
    case 'month':
      return calculateMonthlyTrend(validBookings, limit);
    case 'quarter':
      return calculateQuarterlyTrend(validBookings, limit);
    case 'year':
      return calculateYearlyTrend(validBookings, limit);
    default:
      return calculateMonthlyTrend(validBookings, limit);
  }
}

/**
 * Tính xu hướng theo tuần
 */
function calculateWeeklyTrend(bookings: DonDatPhong[], limit: number) {
  return Array.from({ length: limit }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (7 * (limit - 1 - i)));
    
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weekBookings = bookings.filter(b => {
      if (!b.ngayDat) return false;
      const bookingDate = new Date(b.ngayDat);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    });
    
    const revenue = weekBookings.reduce((sum, b) => {
      const amount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : (b.totalAmount || 0);
      return sum + amount;
    }, 0);
    
    return {
      period: `Tuần ${i + 1}`,
      revenue: revenue,
      bookings: weekBookings.length,
      startDate: startOfWeek.toISOString().slice(0, 10),
      endDate: endOfWeek.toISOString().slice(0, 10)
    };
  });
}

/**
 * Tính xu hướng theo tháng
 */
function calculateMonthlyTrend(bookings: DonDatPhong[], limit: number) {
  return Array.from({ length: limit }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (limit - 1 - i));
    const monthKey = date.toISOString().slice(0, 7);
    
    const monthBookings = bookings.filter(b => {
      if (!b.ngayDat) return false;
      const bookingDate = new Date(b.ngayDat);
      return bookingDate.toISOString().slice(0, 7) === monthKey;
    });
    
    const revenue = monthBookings.reduce((sum, b) => {
      const amount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : (b.totalAmount || 0);
      return sum + amount;
    }, 0);
    
    return {
      period: date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' }),
      revenue: revenue,
      bookings: monthBookings.length,
      monthKey: monthKey
    };
  });
}

/**
 * Tính xu hướng theo quý
 */
function calculateQuarterlyTrend(bookings: DonDatPhong[], limit: number) {
  return Array.from({ length: limit }, (_, i) => {
    const date = new Date();
    const currentQuarter = Math.floor(date.getMonth() / 3);
    const quarterOffset = limit - 1 - i;
    const targetQuarter = currentQuarter - quarterOffset;
    const targetYear = date.getFullYear() + Math.floor(targetQuarter / 4);
    const quarter = ((targetQuarter % 4) + 4) % 4;
    
    const startMonth = quarter * 3;
    const endMonth = startMonth + 2;
    
    const quarterBookings = bookings.filter(b => {
      if (!b.ngayDat) return false;
      const bookingDate = new Date(b.ngayDat);
      const bookingYear = bookingDate.getFullYear();
      const bookingMonth = bookingDate.getMonth();
      return bookingYear === targetYear && bookingMonth >= startMonth && bookingMonth <= endMonth;
    });
    
    const revenue = quarterBookings.reduce((sum, b) => {
      const amount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : (b.totalAmount || 0);
      return sum + amount;
    }, 0);
    
    return {
      period: `Q${quarter + 1} ${targetYear}`,
      revenue: revenue,
      bookings: quarterBookings.length,
      year: targetYear,
      quarter: quarter + 1
    };
  });
}

/**
 * Tính xu hướng theo năm
 */
function calculateYearlyTrend(bookings: DonDatPhong[], limit: number) {
  return Array.from({ length: limit }, (_, i) => {
    const year = new Date().getFullYear() - (limit - 1 - i);
    
    const yearBookings = bookings.filter(b => {
      if (!b.ngayDat) return false;
      const bookingDate = new Date(b.ngayDat);
      return bookingDate.getFullYear() === year;
    });
    
    const revenue = yearBookings.reduce((sum, b) => {
      const amount = typeof b.totalAmount === 'string' ? parseFloat(b.totalAmount) : (b.totalAmount || 0);
      return sum + amount;
    }, 0);
    
    return {
      period: `${year}`,
      revenue: revenue,
      bookings: yearBookings.length,
      year: year
    };
  });
}

/**
 * Tính thống kê theo trạng thái
 */
function calculateStatusStats(bookings: DonDatPhong[]) {
  const confirmedBookings = bookings.filter(b => b.trangThai === 'CF').length;
  const cancelledBookings = bookings.filter(b => b.trangThai === 'AB').length;
  const completedBookings = bookings.filter(b => b.trangThai === 'CC').length;
  const reservedBookings = bookings.filter(b => b.trangThai === 'R').length;
  
  return [
    { name: 'Đã xác nhận', value: confirmedBookings, color: '#10b981' },
    { name: 'Hoàn thành', value: completedBookings, color: '#3b82f6' },
    { name: 'Đã hủy', value: cancelledBookings, color: '#ef4444' },
    { name: 'Chờ xác nhận', value: reservedBookings, color: '#f59e0b' }
  ];
}
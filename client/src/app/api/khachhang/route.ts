import { createCrudHandlers } from '../helpers';

/**
 * Khách hàng API Routes
 * GET /api/khachhang - Lấy danh sách khách hàng
 * POST /api/khachhang - Tạo khách hàng mới
 */
export const { GET, POST } = createCrudHandlers('khachhang');


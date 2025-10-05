import { createCrudHandlers } from '../helpers';

/**
 * Đơn đặt phòng API Routes
 * GET /api/dondatphong - Lấy danh sách đơn đặt phòng
 * POST /api/dondatphong - Tạo đơn đặt phòng mới
 */
export const { GET, POST } = createCrudHandlers('dondatphong');


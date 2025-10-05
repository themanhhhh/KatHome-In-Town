import { createCrudHandlers } from '../helpers';

/**
 * Đơn giá API Routes
 * GET /api/dongia - Lấy danh sách đơn giá
 * POST /api/dongia - Tạo đơn giá mới
 */
export const { GET, POST } = createCrudHandlers('dongia');


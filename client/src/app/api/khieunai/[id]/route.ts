import { createItemHandlers } from '../../helpers';

/**
 * Khiếu nại by ID API Routes
 * GET /api/khieunai/:id - Lấy thông tin khiếu nại
 * PUT /api/khieunai/:id - Cập nhật khiếu nại
 * DELETE /api/khieunai/:id - Xóa khiếu nại
 */
export const { GET, PUT, DELETE } = createItemHandlers('khieunai');


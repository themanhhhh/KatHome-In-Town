import { createItemHandlers } from '../../helpers';

/**
 * Đơn đặt phòng by ID API Routes
 * GET /api/dondatphong/:id - Lấy thông tin đơn đặt phòng
 * PUT /api/dondatphong/:id - Cập nhật đơn đặt phòng
 * DELETE /api/dondatphong/:id - Xóa đơn đặt phòng
 */
export const { GET, PUT, DELETE } = createItemHandlers('dondatphong');


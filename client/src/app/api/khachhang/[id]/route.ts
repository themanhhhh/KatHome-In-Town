import { createItemHandlers } from '../../helpers';

/**
 * Khách hàng by ID API Routes
 * GET /api/khachhang/:id - Lấy thông tin khách hàng
 * PUT /api/khachhang/:id - Cập nhật khách hàng
 * DELETE /api/khachhang/:id - Xóa khách hàng
 */
export const { GET, PUT, DELETE } = createItemHandlers('khachhang');


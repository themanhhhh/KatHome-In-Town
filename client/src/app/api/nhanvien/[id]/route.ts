import { createItemHandlers } from '../../helpers';

/**
 * Nhân viên by ID API Routes
 * GET /api/nhanvien/:id - Lấy thông tin nhân viên
 * PUT /api/nhanvien/:id - Cập nhật nhân viên
 * DELETE /api/nhanvien/:id - Xóa nhân viên
 */
export const { GET, PUT, DELETE } = createItemHandlers('nhanvien');


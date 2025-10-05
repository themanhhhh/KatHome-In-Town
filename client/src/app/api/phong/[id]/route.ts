import { createItemHandlers } from '../../helpers';

/**
 * Phòng by ID API Routes
 * GET /api/phong/:id - Lấy thông tin phòng
 * PUT /api/phong/:id - Cập nhật phòng
 * DELETE /api/phong/:id - Xóa phòng
 */
export const { GET, PUT, DELETE } = createItemHandlers('phong');


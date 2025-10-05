import { createItemHandlers } from '../../helpers';

/**
 * Hạng phòng by ID API Routes
 * GET /api/hangphong/:id - Lấy thông tin hạng phòng
 * PUT /api/hangphong/:id - Cập nhật hạng phòng
 * DELETE /api/hangphong/:id - Xóa hạng phòng
 */
export const { GET, PUT, DELETE } = createItemHandlers('hangphong');


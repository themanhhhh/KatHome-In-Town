import { createItemHandlers } from '../../helpers';

/**
 * Ca làm by ID API Routes
 * GET /api/calam/:id - Lấy thông tin ca làm
 * PUT /api/calam/:id - Cập nhật ca làm
 * DELETE /api/calam/:id - Xóa ca làm
 */
export const { GET, PUT, DELETE } = createItemHandlers('calam');


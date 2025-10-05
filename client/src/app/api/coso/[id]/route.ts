import { createItemHandlers } from '../../helpers';

/**
 * Cơ sở by ID API Routes
 * GET /api/coso/:id - Lấy thông tin cơ sở
 * PUT /api/coso/:id - Cập nhật cơ sở
 * DELETE /api/coso/:id - Xóa cơ sở
 */
export const { GET, PUT, DELETE } = createItemHandlers('coso');


import { createItemHandlers } from '../../helpers';

/**
 * Dịch vụ by ID API Routes
 * GET /api/dichvu/:id - Lấy thông tin dịch vụ
 * PUT /api/dichvu/:id - Cập nhật dịch vụ
 * DELETE /api/dichvu/:id - Xóa dịch vụ
 */
export const { GET, PUT, DELETE } = createItemHandlers('dichvu');


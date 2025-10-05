import { createItemHandlers } from '../../helpers';

/**
 * Chức vụ by ID API Routes
 * GET /api/chucvu/:id - Lấy thông tin chức vụ
 * PUT /api/chucvu/:id - Cập nhật chức vụ
 * DELETE /api/chucvu/:id - Xóa chức vụ
 */
export const { GET, PUT, DELETE } = createItemHandlers('chucvu');


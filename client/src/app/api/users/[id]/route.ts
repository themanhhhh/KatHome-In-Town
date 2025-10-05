import { createItemHandlers } from '../../helpers';

/**
 * User by ID API Routes
 * GET /api/users/:id - Lấy thông tin user
 * PUT /api/users/:id - Cập nhật user
 * DELETE /api/users/:id - Xóa user
 */
export const { GET, PUT, DELETE } = createItemHandlers('users');


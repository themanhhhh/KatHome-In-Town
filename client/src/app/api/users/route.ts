import { createCrudHandlers } from '../helpers';

/**
 * Users API Routes
 * GET /api/users - Lấy danh sách users
 * POST /api/users - Tạo user mới
 */
export const { GET, POST } = createCrudHandlers('users');


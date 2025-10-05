import { createCrudHandlers } from '../helpers';

/**
 * Phòng API Routes
 * GET /api/phong - Lấy danh sách phòng
 * POST /api/phong - Tạo phòng mới
 */
export const { GET, POST } = createCrudHandlers('phong');


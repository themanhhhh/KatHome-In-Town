import { createCrudHandlers } from '../helpers';

/**
 * Ca làm API Routes
 * GET /api/calam - Lấy danh sách ca làm
 * POST /api/calam - Tạo ca làm mới
 */
export const { GET, POST } = createCrudHandlers('calam');


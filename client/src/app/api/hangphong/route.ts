import { createCrudHandlers } from '../helpers';

/**
 * Hạng phòng API Routes
 * GET /api/hangphong - Lấy danh sách hạng phòng
 * POST /api/hangphong - Tạo hạng phòng mới
 */
export const { GET, POST } = createCrudHandlers('hangphong');


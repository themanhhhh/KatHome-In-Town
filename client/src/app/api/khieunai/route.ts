import { createCrudHandlers } from '../helpers';

/**
 * Khiếu nại API Routes
 * GET /api/khieunai - Lấy danh sách khiếu nại
 * POST /api/khieunai - Tạo khiếu nại mới
 */
export const { GET, POST } = createCrudHandlers('khieunai');


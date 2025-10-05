import { createCrudHandlers } from '../helpers';

/**
 * Dịch vụ API Routes
 * GET /api/dichvu - Lấy danh sách dịch vụ
 * POST /api/dichvu - Tạo dịch vụ mới
 */
export const { GET, POST } = createCrudHandlers('dichvu');


import { createCrudHandlers } from '../helpers';

/**
 * Chức vụ API Routes
 * GET /api/chucvu - Lấy danh sách chức vụ
 * POST /api/chucvu - Tạo chức vụ mới
 */
export const { GET, POST } = createCrudHandlers('chucvu');


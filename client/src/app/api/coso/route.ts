import { createCrudHandlers } from '../helpers';

/**
 * Cơ sở API Routes
 * GET /api/coso - Lấy danh sách cơ sở
 * POST /api/coso - Tạo cơ sở mới
 */
export const { GET, POST } = createCrudHandlers('coso');


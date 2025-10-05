import { createCrudHandlers } from '../helpers';

/**
 * Nhân viên API Routes
 * GET /api/nhanvien - Lấy danh sách nhân viên
 * POST /api/nhanvien - Tạo nhân viên mới
 */
export const { GET, POST } = createCrudHandlers('nhanvien');


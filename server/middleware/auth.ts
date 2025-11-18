import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data/datasource';
import { User } from '../entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      userRole?: string;
      userChucVu?: string;
    }
  }
}

/**
 * Middleware để xác thực JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      relations: ['chucVu']
    });

    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' });
    }

    // Attach user info to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.vaiTro;
    req.userChucVu = user.chucVu?.maChucVu;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

/**
 * Middleware để kiểm tra quyền dựa trên vaiTro
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    if (!allowedRoles.includes(req.user.vaiTro)) {
      return res.status(403).json({ 
        message: 'Không có quyền truy cập',
        requiredRoles: allowedRoles,
        userRole: req.user.vaiTro
      });
    }

    next();
  };
};

/**
 * Middleware để kiểm tra quyền dựa trên chức vụ (chucVu)
 */
export const requireChucVu = (...allowedChucVu: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    if (!req.user.chucVu || !allowedChucVu.includes(req.user.chucVu.maChucVu)) {
      return res.status(403).json({ 
        message: 'Không có quyền truy cập',
        requiredChucVu: allowedChucVu,
        userChucVu: req.user.chucVu?.maChucVu
      });
    }

    next();
  };
};

/**
 * Middleware để kiểm tra là admin hoặc có chức vụ quản lý
 */
export const requireAdminOrManager = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực' });
  }

  const isAdmin = req.user.vaiTro === 'admin';
  const isManager = req.user.chucVu?.maChucVu === 'QL';

  if (!isAdmin && !isManager) {
    return res.status(403).json({ 
      message: 'Chỉ admin hoặc quản lý mới có quyền truy cập'
    });
  }

  next();
};

/**
 * Middleware để kiểm tra là nhân viên (có maNhanVien)
 */
export const requireStaff = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực' });
  }

  if (!req.user.maNhanVien) {
    return res.status(403).json({ 
      message: 'Chỉ nhân viên mới có quyền truy cập'
    });
  }

  next();
};

/**
 * Optional authentication (theo flowchart)
 * Nếu có token thì verify, nếu không thì vẫn cho qua (guest booking)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // Không có token - guest booking
      console.log('📝 Guest booking (no authentication)');
      return next();
    }

    // Có token - verify
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({
      where: { id: decoded.id },
      relations: ['chucVu']
    });

    if (user) {
      req.user = user;
      req.userId = user.id;
      req.userRole = user.vaiTro;
      req.userChucVu = user.chucVu?.maChucVu;
      console.log(`🔐 Authenticated booking by ${user.ten || user.taiKhoan}`);
    }

    next();
  } catch (error) {
    // Token invalid - cho phép tiếp tục như guest
    console.log('⚠️ Invalid token, proceeding as guest');
    next();
  }
};


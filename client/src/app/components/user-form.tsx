'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ApiUser } from '../../types/api';
import { usersApi } from '../../lib/api';
import { toast } from 'sonner';   

interface UserFormProps {
  user?: ApiUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    taiKhoan: '',
    gmail: '',
    vaiTro: 'user' as 'user' | 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        taiKhoan: user.taiKhoan || '',
        gmail: user.gmail || '',
        vaiTro: (user.vaiTro as 'user' | 'admin') || 'user'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only allow editing existing users
    if (!user) {
      toast.error('Không thể tạo người dùng mới', {
        description: 'Chức năng tạo người dùng mới đã bị vô hiệu hóa.'
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Update existing user
      await usersApi.update(user.id.toString(), formData);
      toast.success('Cập nhật người dùng thành công!', {
        description: `Người dùng "${formData.taiKhoan}" đã được cập nhật thành công.`
      });
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý người dùng', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chỉnh sửa người dùng
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cập nhật thông tin người dùng hiện tại
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tài khoản</label>
              <input
                type="text"
                value={formData.taiKhoan}
                onChange={(e) => setFormData({ ...formData, taiKhoan: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gmail</label>
              <input
                type="email"
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vai trò</label>
              <select
                value={formData.vaiTro}
                onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value as 'user' | 'admin' })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>


            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">
                  {isSubmitting ? 'Đang lưu...' : 'Cập nhật người dùng'}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

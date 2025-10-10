'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { Alert, AlertDescription } from './alert/alert';
import { X, Save } from 'lucide-react';
import { ApiUser } from '../../types/api';
import { usersApi } from '../../lib/api';   

interface UserFormProps {
  user?: ApiUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    taiKhoan: '',
    email: '',
    vaiTro: 'user' as 'user' | 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        taiKhoan: user.taiKhoan || '',
        email: user.email || '',
        vaiTro: (user.vaiTro as 'user' | 'admin') || 'user'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (user) {
        // Update existing user
        await usersApi.update(user.id.toString(), formData);
      } else {
        // Create new user - need password
        const password = prompt('Nhập mật khẩu cho user mới:');
        if (!password) {
          setError('Mật khẩu là bắt buộc');
          return;
        }
        await usersApi.create({ ...formData, matKhau: password });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tài khoản</label>
              <input
                type="text"
                value={formData.taiKhoan}
                onChange={(e) => setFormData({ ...formData, taiKhoan: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-2">Vai trò</label>
              <select
                value={formData.vaiTro}
                onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value as 'user' | 'admin' })}
                className="w-full p-2 border rounded-md"
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>


            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang lưu...' : (user ? 'Cập nhật' : 'Tạo mới')}</span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

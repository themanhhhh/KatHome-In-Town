'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ApiCustomer } from '../../types/api';
import { khachHangApi } from '../../lib/api';
import { toast } from 'sonner';

interface CustomerFormProps {
  customer?: ApiCustomer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerForm({ customer, onClose, onSuccess }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    ten: '',
    ngaySinh: '',
    gioiTinh: 'Nam' as 'Nam' | 'Nữ',
    email: '',
    sdt: '',
    quocTich: 'Việt Nam',
    cccd: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      // Format date for input (YYYY-MM-DD)
      const ngaySinh = customer.ngaySinh 
        ? new Date(customer.ngaySinh).toISOString().split('T')[0]
        : '';
      
      setFormData({
        ten: customer.ten || customer.tenKhachHang || '',
        ngaySinh: ngaySinh,
        gioiTinh: (customer.gioiTinh as 'Nam' | 'Nữ') || 'Nam',
        email: customer.email || '',
        sdt: customer.sdt || customer.soDienThoai || '',
        quocTich: customer.quocTich || 'Việt Nam',
        cccd: customer.cccd || ''
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ten: formData.ten,
        ngaySinh: formData.ngaySinh,
        gioiTinh: formData.gioiTinh,
        email: formData.email,
        sdt: formData.sdt,
        quocTich: formData.quocTich,
        cccd: formData.cccd
      };

      if (customer) {
        // Update existing customer
        await khachHangApi.update(customer.maKhachHang, payload);
        toast.success('Cập nhật khách hàng thành công!', {
          description: `Khách hàng "${formData.ten}" đã được cập nhật thành công.`
        });
      } else {
        // Create new customer - generate maKhachHang
        // Backend sẽ tự generate hoặc chúng ta có thể tạo ở đây
        await khachHangApi.create(payload);
        toast.success('Tạo khách hàng thành công!', {
          description: `Khách hàng "${formData.ten}" đã được tạo thành công.`
        });
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý khách hàng', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {customer ? 'Cập nhật thông tin khách hàng hiện tại' : 'Nhập thông tin để tạo khách hàng mới'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.ngaySinh}
                  onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gioiTinh}
                  onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value as 'Nam' | 'Nữ' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.sdt}
                  onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0123456789"
                  maxLength={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quốc tịch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.quocTich}
                  onChange={(e) => setFormData({ ...formData, quocTich: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Việt Nam"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số CCCD/CMND <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cccd}
                  onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Nhập số căn cước công dân"
                  maxLength={12}
                  required
                />
              </div>
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
                  {isSubmitting ? 'Đang lưu...' : (customer ? 'Cập nhật khách hàng' : 'Tạo khách hàng mới')}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { ApiCoSo } from '../../types/api';
import { cosoApi } from '../../lib/api';
import { toast } from 'sonner';

interface CoSoFormProps {
  coso?: ApiCoSo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CoSoForm({ coso, onClose, onSuccess }: CoSoFormProps) {
  const [formData, setFormData] = useState({
    maCoSo: '',
    tenCoSo: '',
    diaChi: '',
    soDienThoai: '',
    email: '',
    moTa: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (coso) {
      setFormData({
        maCoSo: coso.maCoSo || '',
        tenCoSo: coso.tenCoSo || '',
        diaChi: coso.diaChi || '',
        soDienThoai: coso.soDienThoai || '',
        email: coso.email || '',
        moTa: coso.moTa || ''
      });
    }
  }, [coso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (coso) {
        // Update existing coso
        await cosoApi.update(coso.maCoSo, formData);
        if (imageFile) {
          await cosoApi.uploadImage(coso.maCoSo, imageFile);
        }
        toast.success('Cập nhật cơ sở thành công!', {
          description: `Cơ sở "${formData.tenCoSo}" đã được cập nhật thành công.`
        });
      } else {
        // Create new coso
        if (imageFile) {
          await cosoApi.createWithImage(formData, imageFile);
        } else {
          await cosoApi.create(formData);
        }
        toast.success('Tạo cơ sở thành công!', {
          description: `Cơ sở "${formData.tenCoSo}" đã được tạo thành công.`
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý cơ sở', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      toast.warning('Đang xử lý...', {
        description: 'Vui lòng đợi quá trình xử lý hoàn tất.'
      });
      return;
    }
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    toast.success('Hình ảnh đã được chọn', {
      description: 'Hình ảnh sẽ được tải lên khi bạn lưu cơ sở.'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {coso ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở mới'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {coso ? 'Cập nhật thông tin cơ sở hiện tại' : 'Nhập thông tin để tạo cơ sở mới'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mã cơ sở</label>
                <input
                  type="text"
                  value={formData.maCoSo}
                  onChange={(e) => setFormData({ ...formData, maCoSo: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Nhập mã cơ sở (ví dụ: TCS, HCM, DN)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên cơ sở</label>
                <input
                  type="text"
                  value={formData.tenCoSo}
                  onChange={(e) => setFormData({ ...formData, tenCoSo: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
              <textarea
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="Mô tả về cơ sở, tiện nghi, đặc điểm nổi bật..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh cơ sở</label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImageUrl={coso?.hinhAnh}
                entityType="coso"
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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
                  {isSubmitting ? 'Đang lưu...' : (coso ? 'Cập nhật cơ sở' : 'Tạo cơ sở mới')}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

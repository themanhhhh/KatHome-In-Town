'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { Alert, AlertDescription } from './alert/alert';
import { X, Save } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { ApiCoSo } from '../../types/api';
import { cosoApi } from '../../lib/api';

interface CoSoFormProps {
  coso?: ApiCoSo | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function CoSoForm({ coso, onClose, onSuccess }: CoSoFormProps) {
  const [formData, setFormData] = useState({
    tenCoSo: '',
    diaChi: '',
    soDienThoai: '',
    email: '',
    moTa: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (coso) {
      setFormData({
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
    setError(null);

    try {
      if (coso) {
        // Update existing coso
        await cosoApi.update(coso.maCoSo, formData);
        if (imageFile) {
          await cosoApi.uploadImage(coso.maCoSo, imageFile);
        }
      } else {
        // Create new coso
        if (imageFile) {
          await cosoApi.createWithImage(formData, imageFile);
        } else {
          await cosoApi.create(formData);
        }
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {coso ? 'Chỉnh sửa cơ sở' : 'Thêm cơ sở mới'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên cơ sở</label>
                <input
                  type="text"
                  value={formData.tenCoSo}
                  onChange={(e) => setFormData({ ...formData, tenCoSo: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.diaChi}
                  onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Mô tả về cơ sở, tiện nghi, đặc điểm nổi bật..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hình ảnh cơ sở</label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImageUrl={coso?.hinhAnh}
                entityType="coso"
                className="w-full"
              />
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
                <span>{isSubmitting ? 'Đang lưu...' : (coso ? 'Cập nhật' : 'Tạo mới')}</span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

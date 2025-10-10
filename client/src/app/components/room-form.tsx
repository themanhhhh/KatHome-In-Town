'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { Alert, AlertDescription } from './alert/alert';
import { X, Save } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { ApiRoom, ApiRoomType } from '../../types/api';
import { phongApi } from '../../lib/api';

interface RoomFormProps {
  room?: ApiRoom | null;
  roomTypes: ApiRoomType[];
  onClose: () => void;
  onSuccess: () => void;
}

export function RoomForm({ room, roomTypes, onClose, onSuccess }: RoomFormProps) {
  const [formData, setFormData] = useState({
    moTa: '',
    maHangPhong: '',
    maCoSo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (room) {
      setFormData({
        moTa: room.moTa || '',
        maHangPhong: room.hangPhong?.maHangPhong || '',
        maCoSo: room.coSo?.maCoSo || ''
      });
    }
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (room) {
        // Update existing room
        await phongApi.update(room.maPhong, formData);
        if (imageFile) {
          await phongApi.uploadImage(room.maPhong, imageFile);
        }
      } else {
        // Create new room
        if (imageFile) {
          await phongApi.createWithImage(formData, imageFile);
        } else {
          await phongApi.create(formData);
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
              {room ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
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
                <label className="block text-sm font-medium mb-2">Mô tả phòng</label>
                <input
                  type="text"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">Hạng phòng</label>
                <select
                  value={formData.maHangPhong}
                  onChange={(e) => setFormData({ ...formData, maHangPhong: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Chọn hạng phòng</option>
                  {roomTypes.map((type) => (
                    <option key={type.maHangPhong} value={type.maHangPhong}>
                      {type.tenHangPhong}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cơ sở</label>
                <select
                  value={formData.maCoSo}
                  onChange={(e) => setFormData({ ...formData, maCoSo: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Chọn cơ sở</option>
                  {/* TODO: Load coSo data */}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hình ảnh phòng</label>
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImageUrl={room?.hinhAnh}
                entityType="room"
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
                <span>{isSubmitting ? 'Đang lưu...' : (room ? 'Cập nhật' : 'Tạo mới')}</span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

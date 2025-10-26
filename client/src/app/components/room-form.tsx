'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save } from 'lucide-react';
import { ImageUpload } from './image-upload';
import { ApiRoom, ApiRoomType } from '../../types/api';
import { phongApi } from '../../lib/api';
import { toast } from 'sonner';

interface RoomFormProps {
  room?: ApiRoom | null;
  roomTypes: ApiRoomType[];
  coSoList: Array<{
    maCoSo: string;
    tenCoSo: string;
    diaChi: string;
    sdt: string;
    hinhAnh?: string;
  }>;
  onClose: () => void;
  onSuccess: (isEdit: boolean) => void;
}

export function RoomForm({ room, roomTypes, coSoList, onClose, onSuccess }: RoomFormProps) {
  const [formData, setFormData] = useState({
    moTa: '',
    hangPhongMaHangPhong: '',
    coSoMaCoSo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (room) {
      setFormData({
        moTa: room.moTa || '',
        hangPhongMaHangPhong: room.hangPhong?.maHangPhong || '',
        coSoMaCoSo: room.coSo?.maCoSo || ''
      });
    }
  }, [room]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!room;
      
      if (room) {
        // Update existing room
        await phongApi.update(room.maPhong, formData);
        if (imageFile) {
          await phongApi.uploadImage(room.maPhong, imageFile);
        }
        toast.success('Cập nhật phòng thành công!', {
          description: `Phòng đã được cập nhật thành công.`
        });
      } else {
        // Create new room
        if (imageFile) {
          await phongApi.createWithImage(formData, imageFile);
        } else {
          await phongApi.create(formData);
        }
        toast.success('Tạo phòng thành công!', {
          description: `Phòng mới đã được tạo thành công.`
        });
      }
      onSuccess(isEdit);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý phòng', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    toast.success('Hình ảnh đã được chọn', {
      description: 'Hình ảnh sẽ được tải lên khi bạn lưu phòng.'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {room ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {room ? 'Cập nhật thông tin phòng hiện tại' : 'Nhập thông tin để tạo phòng mới'}
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
                  value={formData.hangPhongMaHangPhong}
                  onChange={(e) => setFormData({ ...formData, hangPhongMaHangPhong: e.target.value })}
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
                  value={formData.coSoMaCoSo}
                  onChange={(e) => setFormData({ ...formData, coSoMaCoSo: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Chọn cơ sở</option>
                  {coSoList.map((coSo) => (
                    <option key={coSo.maCoSo} value={coSo.maCoSo}>
                      {coSo.tenCoSo} - {coSo.diaChi}
                    </option>
                  ))}
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
                  {isSubmitting ? 'Đang lưu...' : (room ? 'Cập nhật phòng' : 'Tạo phòng mới')}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

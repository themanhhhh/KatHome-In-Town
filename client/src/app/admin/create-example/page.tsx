'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { CreateRoomForm } from '../components/create-room-form';
import { useCreateRoom } from '../../hooks/useCreateWithImage';

const AdminCreateExample = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { create, isLoading, error } = useCreateRoom({
    onSuccess: (room) => {
      console.log('Phòng đã được tạo:', room);
      setShowCreateForm(false);
      // Refresh danh sách phòng ở đây
    },
    onError: (error) => {
      console.error('Lỗi khi tạo phòng:', error);
    }
  });

  const handleQuickCreate = async () => {
    try {
      // Tạo phòng nhanh không có hình ảnh
      await create({
        maPhong: 'P' + Date.now(),
        moTa: 'Phòng tự động tạo'
      });
    } catch (err) {
      console.error('Lỗi:', err);
    }
  };

  const handleCreateWithImage = async () => {
    // Tạo file input để chọn hình ảnh
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await create({
            maPhong: 'P' + Date.now(),
            moTa: 'Phòng có hình ảnh'
          }, file);
        } catch (err) {
          console.error('Lỗi:', err);
        }
      }
    };
    
    input.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ví dụ tạo Entity với hình ảnh</h1>
      </div>

      {/* Các phương thức tạo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Tạo nhanh</h3>
            </div>
            <p className="text-sm text-gray-600">
              Tạo phòng không có hình ảnh
            </p>
            <Button 
              onClick={handleQuickCreate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo phòng'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Tạo với hình ảnh</h3>
            </div>
            <p className="text-sm text-gray-600">
              Chọn hình ảnh và tạo phòng
            </p>
            <Button 
              onClick={handleCreateWithImage}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Đang tạo...' : 'Chọn hình ảnh'}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Form đầy đủ</h3>
            </div>
            <p className="text-sm text-gray-600">
              Sử dụng form chi tiết
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              variant="secondary"
              className="w-full"
            >
              Mở form
            </Button>
          </div>
        </Card>
      </div>

      {/* Form tạo phòng */}
      {showCreateForm && (
        <CreateRoomForm
          onSuccess={(room) => {
            console.log('Phòng đã được tạo:', room);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Hiển thị lỗi */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-800">Lỗi: {error}</p>
        </Card>
      )}

      {/* Hướng dẫn sử dụng */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Phương án 2 - Upload trước, tạo sau:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-gray-600">
              <li>Chọn hình ảnh từ máy tính</li>
              <li>Upload hình ảnh lên Pinata IPFS</li>
              <li>Nhận URL hình ảnh từ IPFS</li>
              <li>Tạo entity với URL hình ảnh</li>
            </ol>
          </div>
          
          <div className="mt-4">
            <strong>Ưu điểm:</strong>
            <ul className="list-disc list-inside mt-1 text-gray-600">
              <li>Đơn giản và dễ hiểu</li>
              <li>Không cần thay đổi API backend</li>
              <li>Hình ảnh được lưu trữ an toàn trên IPFS</li>
              <li>Có thể tái sử dụng cho tất cả entity</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCreateExample;

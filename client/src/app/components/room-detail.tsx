'use client';

import React from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Bed, Users, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import { ApiRoom } from '../../types/api';
import Image from 'next/image';

interface RoomDetailProps {
  room: ApiRoom;
  onClose: () => void;
}

const formatPrice = (price: number | undefined | null) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0đ';
  }
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
};

const getStatusBadge = (status: string | undefined) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    available: { label: 'Có sẵn', className: 'bg-green-100 text-green-800' },
    booked: { label: 'Đã đặt', className: 'bg-red-100 text-red-800' },
    maintenance: { label: 'Bảo trì', className: 'bg-yellow-100 text-yellow-800' },
    blocked: { label: 'Bị chặn', className: 'bg-gray-100 text-gray-800' }
  };
  
  const config = statusConfig[status || 'available'] || { label: status || 'Có sẵn', className: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export function RoomDetail({ room, onClose }: RoomDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl border-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết phòng</h2>
              <p className="text-sm text-gray-600 mt-1">Mã phòng: {room.maPhong}</p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(room.status)}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin phòng */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phòng</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Bed className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Tên phòng</p>
                      <p className="font-medium text-gray-900">{room.tenPhong || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Sức chứa</p>
                      <p className="font-medium text-gray-900">{room.sucChua || 0} người</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Giá qua đêm</p>
                      <p className="font-medium text-gray-900">{formatPrice(room.donGiaQuaDem)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{room.moTa || 'Chưa có mô tả'}</p>
              </div>
            </div>

            {/* Thông tin cơ sở */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ sở</h3>
                {room.coSo ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Tên cơ sở</p>
                        <p className="font-medium text-gray-900">{room.coSo.tenCoSo || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Mã cơ sở</p>
                        <p className="font-medium text-gray-900">{room.coSo.maCoSo || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Chưa có thông tin cơ sở</p>
                )}
              </div>

              {/* Hình ảnh */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh</h3>
                {room.hinhAnh ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={room.hinhAnh}
                      alt={room.tenPhong || 'Phòng'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chưa có hình ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}


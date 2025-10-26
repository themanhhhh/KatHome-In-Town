'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './button';
import { Card } from './card';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Upload, X, CheckCircle } from 'lucide-react';
import { phongApi, hangPhongApi, cosoApi } from '../../lib/api';
import { ApiHangPhong, ApiCoSo } from '../../types/api';
import { toast } from 'sonner';

interface CreateRoomFormProps {
  onSuccess?: (room: any) => void;
  onCancel?: () => void;
}

export function CreateRoomForm({ onSuccess, onCancel }: CreateRoomFormProps) {
  const [formData, setFormData] = useState({
    moTa: '',
    hangPhongMaHangPhong: '',
    coSoMaCoSo: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hangPhongs, setHangPhongs] = useState<ApiHangPhong[]>([]);
  const [cosos, setCosos] = useState<ApiCoSo[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hangPhongsData, cososData] = await Promise.all([
          hangPhongApi.getAll(),
          cosoApi.getAll()
        ]);
        setHangPhongs(Array.isArray(hangPhongsData) ? hangPhongsData : []);
        setCosos(Array.isArray(cososData) ? cososData : []);
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Lỗi khi tải dữ liệu', {
          description: 'Không thể tải danh sách hạng phòng và cơ sở.'
        });
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh', {
        description: 'Chỉ chấp nhận các file hình ảnh (JPG, PNG, GIF, etc.)'
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Kích thước file quá lớn', {
        description: 'Kích thước file phải nhỏ hơn 10MB'
      });
      return;
    }

    setImageFile(file);
    toast.success('Hình ảnh đã được chọn', {
      description: 'Hình ảnh sẽ được tải lên khi bạn tạo phòng.'
    });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.moTa || !formData.hangPhongMaHangPhong || !formData.coSoMaCoSo) {
        toast.error('Thiếu thông tin bắt buộc', {
          description: 'Vui lòng điền đầy đủ mô tả, hạng phòng và cơ sở.'
        });
        setIsSubmitting(false);
        return;
      }

      console.log('Form data being sent:', formData);
      
      // Transform data to match backend expectations
      const payload = {
        moTa: formData.moTa,
        hangPhongMaHangPhong: formData.hangPhongMaHangPhong,
        coSoMaCoSo: formData.coSoMaCoSo
      };
      
      console.log('Payload being sent:', payload);
      
      // Sử dụng phương án 2: Upload trước, tạo sau
      const newRoom = await phongApi.createWithImage(payload, imageFile || undefined);
      
      toast.success('Tạo phòng thành công!', {
        description: `Phòng đã được tạo thành công.`
      });
      
      // Reset form
      setFormData({ moTa: '', hangPhongMaHangPhong: '', coSoMaCoSo: '' });
      setImageFile(null);
      setImagePreview(null);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(newRoom);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo phòng';
      toast.error('Lỗi khi tạo phòng', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    toast.info('Hình ảnh đã được xóa', {
      description: 'Bạn có thể chọn hình ảnh khác nếu muốn.'
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tạo phòng mới</h2>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Hủy
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moTa">Mô tả phòng *</Label>
              <Input
                id="moTa"
                name="moTa"
                value={formData.moTa}
                onChange={handleInputChange}
                placeholder="VD: Phòng đôi tiêu chuẩn"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hangPhongMaHangPhong">Hạng phòng *</Label>
              <select
                id="hangPhongMaHangPhong"
                name="hangPhongMaHangPhong"
                value={formData.hangPhongMaHangPhong}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn hạng phòng</option>
                {hangPhongs.map((hangPhong) => (
                  <option key={hangPhong.maHangPhong} value={hangPhong.maHangPhong}>
                    {hangPhong.tenHangPhong} - {hangPhong.sucChua} người
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coSoMaCoSo">Cơ sở *</Label>
              <select
                id="coSoMaCoSo"
                name="coSoMaCoSo"
                value={formData.coSoMaCoSo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn cơ sở</option>
                {cosos.map((coso) => (
                  <option key={coso.maCoSo} value={coso.maCoSo}>
                    {coso.tenCoSo} - {coso.diaChi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Upload hình ảnh */}
          <div className="space-y-4">
            <Label>Hình ảnh phòng</Label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Kéo thả hình ảnh vào đây hoặc click để chọn
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  Chọn hình ảnh
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo phòng'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

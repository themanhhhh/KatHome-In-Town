'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button/button';
import { Card } from './card/card';
import { X, Save, FileText } from 'lucide-react';
import { reportsApi, type ApiReport } from '../../lib/api';
import { toast } from 'sonner';

interface ReportFormProps {
  report?: ApiReport | null;
  onClose: () => void;
  onSuccess: (isEdit: boolean) => void;
}

export function ReportForm({ report, onClose, onSuccess }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'revenue' as const,
    period: 'monthly' as const,
    description: '',
    value: 0,
    change: 0,
    trend: 'stable' as const,
    status: 'processing' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        type: report.type,
        period: report.period,
        description: report.description || '',
        value: report.value,
        change: report.change,
        trend: report.trend,
        status: report.status
      });
    }
  }, [report]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isEdit = !!report;
      
      if (report) {
        await reportsApi.update(report.id, formData);
        toast.success('Cập nhật báo cáo thành công!', {
          description: `Báo cáo "${formData.title}" đã được cập nhật thành công.`
        });
      } else {
        await reportsApi.create(formData);
        toast.success('Tạo báo cáo thành công!', {
          description: `Báo cáo "${formData.title}" đã được tạo thành công.`
        });
      }
      
      onSuccess(isEdit);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error('Lỗi khi xử lý báo cáo', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {report ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {report ? 'Cập nhật thông tin báo cáo hiện tại' : 'Nhập thông tin để tạo báo cáo mới'}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Tiêu đề báo cáo *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Nhập tiêu đề báo cáo"
                required
              />
            </div>

            {/* Type and Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại báo cáo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="revenue">Doanh thu</option>
                  <option value="bookings">Đặt phòng</option>
                  <option value="occupancy">Lấp đầy</option>
                  <option value="customer">Khách hàng</option>
                  <option value="rooms">Phòng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Chu kỳ *</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Nhập mô tả chi tiết về báo cáo"
              />
            </div>

            {/* Value, Change, Trend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Giá trị</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thay đổi (%)</label>
                <input
                  type="number"
                  value={formData.change}
                  onChange={(e) => setFormData({ ...formData, change: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded-md"
                  placeholder="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Xu hướng</label>
                <select
                  value={formData.trend}
                  onChange={(e) => setFormData({ ...formData, trend: e.target.value as any })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="up">Tăng</option>
                  <option value="down">Giảm</option>
                  <option value="stable">Ổn định</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            {/* Actions */}
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
                  {isSubmitting ? 'Đang lưu...' : (report ? 'Cập nhật báo cáo' : 'Tạo báo cáo mới')}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}


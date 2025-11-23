'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from "../card/card";
import { Button } from "../ui/button";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Textarea } from "../textarea/textarea";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export const ComplaintsSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    loaiKhieuNai: 'other',
    tieuDe: '',
    dienGiai: ''
  });

  // Auto-fill form when user is logged in and form is shown
  useEffect(() => {
    if (showForm && isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        hoTen: prev.hoTen || user.taiKhoan || '',
        email: prev.email || user.gmail || '',
        soDienThoai: prev.soDienThoai || user.soDienThoai || ''
      }));
    }
  }, [showForm, isAuthenticated, user]);

  const complaintTypes = [
    { value: 'service', label: 'Dịch vụ' },
    { value: 'room', label: 'Phòng' },
    { value: 'staff', label: 'Nhân viên' },
    { value: 'other', label: 'Khác' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/khieunai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Khiếu nại của bạn đã được gửi thành công!');
        setFormData({
          hoTen: '',
          email: '',
          soDienThoai: '',
          loaiKhieuNai: 'other',
          tieuDe: '',
          dienGiai: ''
        });
        setShowForm(false);
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi gửi khiếu nại');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Không thể gửi khiếu nại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading" style={{ color: '#82213D' }}>
            Góp Ý & Khiếu Nại
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#82213D' }}>
            Chúng tôi luôn lắng nghe và cải thiện để phục vụ bạn tốt hơn
          </p>
        </div>

        {!showForm ? (
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 border-0 shadow-md" style={{ backgroundColor: '#FFF5F5' }}>
              <CardContent className="p-0 flex items-start gap-6">
                <div 
                  className="flex-shrink-0 p-4 rounded-lg"
                  style={{ backgroundColor: '#F2A7C3' }}
                >
                  <MessageSquare className="w-8 h-8" style={{ color: '#82213D' }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#82213D' }}>
                    Bạn có góp ý hoặc khiếu nại?
                  </h3>
                  <p className="text-sm opacity-80 mb-6" style={{ color: '#82213D' }}>
                    Chúng tôi cam kết xử lý mọi khiếu nại một cách nhanh chóng và chuyên nghiệp.
                    Ý kiến của bạn rất quan trọng để chúng tôi không ngừng cải thiện chất lượng dịch vụ.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="text-white hover:opacity-90 transition-opacity font-semibold"
                    style={{ backgroundColor: '#82213D' }}
                  >
                    Gửi Khiếu Nại
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 bg-white border-0 shadow-xl">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-6 font-heading" style={{ color: '#82213D' }}>
                  Gửi Khiếu Nại / Góp Ý
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label style={{ color: '#82213D' }}>
                        Họ Tên <span style={{ color: '#EF4444' }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        required
                        value={formData.hoTen}
                        onChange={(e) =>
                          setFormData({ ...formData, hoTen: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: '#82213D' }}>
                        Email <span style={{ color: '#EF4444' }}>*</span>
                      </Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label style={{ color: '#82213D' }}>Số Điện Thoại</Label>
                      <Input
                        type="tel"
                        value={formData.soDienThoai}
                        onChange={(e) =>
                          setFormData({ ...formData, soDienThoai: e.target.value })
                        }
                        placeholder="0987654321"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: '#82213D' }}>
                        Loại Khiếu Nại <span style={{ color: '#EF4444' }}>*</span>
                      </Label>
                      <select
                        required
                        value={formData.loaiKhieuNai}
                        onChange={(e) =>
                          setFormData({ ...formData, loaiKhieuNai: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#82213D] focus:border-transparent"
                      >
                        {complaintTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#82213D' }}>
                      Tiêu Đề <span style={{ color: '#EF4444' }}>*</span>
                    </Label>
                    <Input
                      type="text"
                      required
                      value={formData.tieuDe}
                      onChange={(e) =>
                        setFormData({ ...formData, tieuDe: e.target.value })
                      }
                      placeholder="Mô tả ngắn gọn về vấn đề"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#82213D' }}>
                      Nội Dung Chi Tiết <span style={{ color: '#EF4444' }}>*</span>
                    </Label>
                    <Textarea
                      required
                      rows={6}
                      value={formData.dienGiai}
                      onChange={(e) =>
                        setFormData({ ...formData, dienGiai: e.target.value })
                      }
                      placeholder="Mô tả chi tiết về vấn đề bạn gặp phải..."
                    />
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: '#FFF5F5' }}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#82213D' }} />
                      <p className="text-sm opacity-80" style={{ color: '#82213D' }}>
                        <strong>Lưu ý:</strong> Chúng tôi sẽ phản hồi khiếu nại của bạn qua email
                        trong vòng 24-48 giờ làm việc.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 text-white hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#82213D' }}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi Khiếu Nại'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 font-semibold"
                      style={{ borderColor: '#82213D', color: '#82213D' }}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from "../card/card";
import { Button } from "../ui/button";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Textarea } from "../textarea/textarea";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface Review {
  maDanhGia: string;
  hoTen: string;
  diemDanhGia: number;
  noiDung: string;
  ngayDanhGia: string;
  phanHoi?: string;
}

interface Stats {
  totalReviews: number;
  averageRating: string;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const ReviewsSection: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    diemDanhGia: 5,
    noiDung: ''
  });

  // Fetch reviews and stats on mount
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

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

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/danhgia?limit=6');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/danhgia/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/danhgia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Cảm ơn bạn đã đánh giá!');
        setFormData({
          hoTen: '',
          email: '',
          soDienThoai: '',
          diemDanhGia: 5,
          noiDung: ''
        });
        setShowForm(false);
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'fill-current' : ''
            }`}
            style={{ color: star <= rating ? '#82213D' : '#E5E7EB' }}
          />
        ))}
      </div>
    );
  };

  const renderStarInput = (rating: number) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, diemDanhGia: star })}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating ? 'fill-current' : ''
              }`}
              style={{ color: star <= rating ? '#82213D' : '#E5E7EB' }}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20" style={{ backgroundColor: '#FFF7F3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading" style={{ color: '#82213D' }}>
            Đánh Giá Từ Khách Hàng
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#82213D' }}>
            Những trải nghiệm thực tế từ khách hàng của chúng tôi
          </p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {/* Average Rating */}
            <Card className="p-6 bg-white border-0 text-center">
              <CardContent className="p-0">
                <div 
                  className="inline-flex p-3 rounded-full mb-4"
                  style={{ backgroundColor: '#FFF5F5' }}
                >
                  <Star className="w-6 h-6 fill-current" style={{ color: '#82213D' }} />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#82213D' }}>
                  {stats.averageRating}
                </div>
                <p className="text-sm opacity-70" style={{ color: '#82213D' }}>
                  Đánh giá trung bình
                </p>
              </CardContent>
            </Card>

            {/* Total Reviews */}
            <Card className="p-6 bg-white border-0 text-center">
              <CardContent className="p-0">
                <div 
                  className="inline-flex p-3 rounded-full mb-4"
                  style={{ backgroundColor: '#FFF5F5' }}
                >
                  <Users className="w-6 h-6" style={{ color: '#82213D' }} />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#82213D' }}>
                  {stats.totalReviews}
                </div>
                <p className="text-sm opacity-70" style={{ color: '#82213D' }}>
                  Lượt đánh giá
                </p>
              </CardContent>
            </Card>

            {/* 5-Star Percentage */}
            <Card className="p-6 bg-white border-0 text-center">
              <CardContent className="p-0">
                <div 
                  className="inline-flex p-3 rounded-full mb-4"
                  style={{ backgroundColor: '#FFF5F5' }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: '#82213D' }} />
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: '#82213D' }}>
                  {stats.totalReviews > 0 
                    ? Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100)
                    : 0}%
                </div>
                <p className="text-sm opacity-70" style={{ color: '#82213D' }}>
                  Đánh giá 5 sao
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <Card
              key={review.maDanhGia}
              className="p-6 bg-white border-0 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold" style={{ color: '#82213D' }}>{review.hoTen}</h3>
                    <p className="text-sm opacity-70" style={{ color: '#82213D' }}>
                      {new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {renderStars(review.diemDanhGia)}
                </div>
                <p className="text-sm opacity-80 mb-4" style={{ color: '#82213D' }}>
                  {review.noiDung}
                </p>
                {review.phanHoi && (
                  <div className="rounded-lg p-3 mt-4" style={{ backgroundColor: '#FFF5F5' }}>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#82213D' }} />
                      <div>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#82213D' }}>
                          Phản hồi từ chúng tôi:
                        </p>
                        <p className="text-xs opacity-80" style={{ color: '#82213D' }}>
                          {review.phanHoi}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Write Review Button/Form */}
        <div className="text-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="text-white hover:opacity-90 transition-opacity font-semibold px-8 py-3"
              style={{ backgroundColor: '#82213D' }}
            >
              Viết Đánh Giá
            </Button>
          ) : (
            <Card className="max-w-2xl mx-auto p-8 bg-white border-0 shadow-xl">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-6 font-heading" style={{ color: '#82213D' }}>
                  Chia Sẻ Trải Nghiệm Của Bạn
                </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    Đánh Giá <span style={{ color: '#EF4444' }}>*</span>
                  </Label>
                  {renderStarInput(formData.diemDanhGia)}
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#82213D' }}>
                    Nội Dung <span style={{ color: '#EF4444' }}>*</span>
                  </Label>
                  <Textarea
                    required
                    rows={5}
                    value={formData.noiDung}
                    onChange={(e) =>
                      setFormData({ ...formData, noiDung: e.target.value })
                    }
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 text-white hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#82213D' }}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
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
          )}
        </div>
      </div>
    </section>
  );
};


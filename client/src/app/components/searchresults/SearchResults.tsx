'use client';
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../card/card";
import { Badge } from "../badge/badge";
import { 
  Users, 
  Bed, 
  Bath, 
  Star,
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronDown,
  Filter
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AvailabilityRoom, availabilityApi } from "@/lib/api";

interface SearchResultsProps {
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onBackToHome: () => void;
  onViewRoomDetail: (roomId: number) => void;
}

export function SearchResults({ searchData, onBackToHome, onViewRoomDetail }: SearchResultsProps) {
  const [showFilters, setShowFilters] = useState(false);
  interface UiRoom {
    id: number;
    name: string;
    type: string;
    price: number;
    originalPrice: number;
    image: string;
    maxGuests: number;
    beds: number;
    bathrooms: number;
    size: number;
    amenities: string[];
    rating: number;
    reviews: number;
    description: string;
    available: boolean;
    isPopular: boolean;
    _maPhong: string;
  }

  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchAvailability() {
      setLoading(true);
      setError(null);
      try {
        const data: AvailabilityRoom[] = await availabilityApi.search({
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: searchData.guests,
        });
        if (!isMounted) return;
        const mapped: UiRoom[] = (data || []).map((r: AvailabilityRoom, idx: number) => ({
          id: idx + 1, // frontend id for navigation; backend has r.maPhong (string)
          name: r.moTa ? r.moTa : `Phòng ${r.maPhong}`,
          type: r.hangPhong?.tenHangPhong || 'Phòng',
          price: 0,
          originalPrice: 0,
          image: '/window.svg',
          maxGuests: r.hangPhong?.sucChua ?? 2,
          beds: 1,
          bathrooms: 1,
          size: 30,
          amenities: [],
          rating: 4.7,
          reviews: 0,
          description: r.moTa || 'Phòng còn trống',
          available: true,
          isPopular: false,
          _maPhong: r.maPhong,
        }));
        setRooms(mapped);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Không thể tải danh sách phòng';
        setError(message);
        setRooms([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (searchData.checkIn && searchData.checkOut) {
      fetchAvailability();
    }
    return () => {
      isMounted = false;
    };
  }, [searchData.checkIn, searchData.checkOut, searchData.guests]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fef5f6' }}>
      {/* Header với thông tin tìm kiếm */}
      <div className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: '#F8E8EC' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBackToHome}
              className="flex items-center space-x-2"
              style={{ color: '#3D0301' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Button>
            
            <div className="text-sm" style={{ color: '#3D0301' }}>
              {loading ? 'Đang tải...' : `${rooms.length} phòng có sẵn`}
            </div>
          </div>

          {/* Thông tin tìm kiếm */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#FAD0C4' }}>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" style={{ color: '#3D0301' }} />
              <span className="text-sm" style={{ color: '#3D0301' }}>
                {formatDate(searchData.checkIn)} - {formatDate(searchData.checkOut)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" style={{ color: '#3D0301' }} />
              <span className="text-sm" style={{ color: '#3D0301' }}>
                {searchData.guests} khách
              </span>
            </div>
            <div className="flex items-center space-x-2">
               <MapPin className="w-4 h-4" style={{ color: '#3D0301' }} />
               <span className="text-sm" style={{ color: '#3D0301' }}>
                 KatHome In Town, Hà Nội
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters và Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl mb-2 font-heading" style={{ color: '#3D0301' }}>
              Các phòng có sẵn
            </h1>
            <p className="opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
              {loading ? 'Đang tải kết quả...' : `Tìm thấy ${rooms.length} phòng phù hợp với yêu cầu của bạn`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
              style={{ borderColor: '#3D0301', color: '#3D0301' }}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: '#3D0301' }}>Sắp xếp:</span>
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
                style={{ borderColor: '#3D0301', color: '#3D0301' }}
              >
                <span>Giá thấp nhất</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Danh sách phòng */}
        {error && (
          <div className="mb-6 text-sm" style={{ color: '#B00020' }}>{error}</div>
        )}
        <div className="space-y-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0" style={{ backgroundColor: '#FAD0C4' }}>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Hình ảnh */}
                  <div className="relative">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    {room.isPopular && (
                      <Badge 
                        className="absolute top-4 left-4 text-white"
                        style={{ backgroundColor: '#3D0301' }}
                      >
                        Phổ biến
                      </Badge>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      {room.size}m²
                    </div>
                  </div>

                  {/* Thông tin phòng */}
                  <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-heading" style={{ color: '#3D0301' }}>
                            {room.name}
                          </h3>
                          <Badge variant="secondary" style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)', color: '#3D0301' }}>
                            {room.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(room.rating) ? 'fill-current' : ''}`}
                                style={{ color: '#3D0301' }}
                              />
                            ))}
                          </div>
                          <span className="text-sm" style={{ color: '#3D0301' }}>
                            {room.rating} ({room.reviews} đánh giá)
                          </span>
                        </div>
                        <p className="text-sm opacity-80 mb-4" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                          {room.description}
                        </p>
                      </div>
                    </div>

                    {/* Thông số phòng */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-white/50">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" style={{ color: '#3D0301' }} />
                        <span className="text-sm" style={{ color: '#3D0301' }}>
                          Tối đa {room.maxGuests} khách
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4" style={{ color: '#3D0301' }} />
                        <span className="text-sm" style={{ color: '#3D0301' }}>
                          {room.beds} giường
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4" style={{ color: '#3D0301' }} />
                        <span className="text-sm" style={{ color: '#3D0301' }}>
                          {room.bathrooms} phòng tắm
                        </span>
                      </div>
                    </div>

                    {/* Tiện nghi */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 5).map((amenity: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: '#3D0301', color: '#3D0301' }}
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 5 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: '#3D0301', color: '#3D0301' }}
                          >
                            +{room.amenities.length - 5} tiện nghi
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Giá và nút đặt phòng */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl" style={{ color: '#3D0301' }}>
                            {formatPrice(room.price)}
                          </span>
                          {room.originalPrice > room.price && (
                            <span className="text-sm line-through opacity-60" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                              {formatPrice(room.originalPrice)}
                            </span>
                          )}
                        </div>
                         <span className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                           /4h (đã bao gồm thuế)
                         </span>
                        {room.originalPrice > room.price && (
                          <div className="text-xs mt-1" style={{ color: '#3D0301' }}>
                            Tiết kiệm {formatPrice(room.originalPrice - room.price)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline"
                          style={{ borderColor: '#3D0301', color: '#3D0301' }}
                          onClick={() => onViewRoomDetail(room.id)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button 
                          className="text-white"
                          style={{ backgroundColor: '#3D0301' }}
                          onClick={() => onViewRoomDetail(room.id)}
                        >
                          Đặt phòng ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button variant="outline" disabled style={{ borderColor: '#3D0301', color: 'rgba(61, 3, 1, 0.5)' }}>
              Trước
            </Button>
            <Button className="text-white" style={{ backgroundColor: '#3D0301' }}>
              1
            </Button>
            <Button variant="outline" style={{ borderColor: '#3D0301', color: '#3D0301' }}>
              2
            </Button>
            <Button variant="outline" style={{ borderColor: '#3D0301', color: '#3D0301' }}>
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
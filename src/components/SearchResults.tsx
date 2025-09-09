import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Users, 
  Bed, 
  Bath, 
  Wifi, 
  Car, 
  Wind, 
  Coffee,
  Star,
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronDown,
  Filter
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  const [sortBy, setSortBy] = useState("price");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data cho các phòng
  const rooms = [
    {
      id: 1,
      name: "Phòng Deluxe với Ban công",
      type: "Deluxe Room",
      price: 1200000,
      originalPrice: 1500000,
      image: "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU3NDQ2NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      maxGuests: 4,
      beds: 2,
      bathrooms: 1,
      size: 35,
      amenities: ["Wifi miễn phí", "Điều hòa", "Ban công", "TV Smart", "Tủ lạnh"],
      rating: 4.8,
      reviews: 45,
      description: "Phòng rộng rãi với ban công nhìn ra khu vườn, phù hợp cho gia đình nhỏ.",
      available: true,
      isPopular: true
    },
    {
      id: 2,
      name: "Phòng Standard Ấm Cúng",
      type: "Standard Room",
      price: 800000,
      originalPrice: 900000,
      image: "https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTc0NDY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 25,
      amenities: ["Wifi miễn phí", "Điều hòa", "TV Smart", "Tủ lạnh"],
      rating: 4.6,
      reviews: 28,
      description: "Phòng tiêu chuẩn với thiết kế ấm cúng, phù hợp cho cặp đôi.",
      available: true,
      isPopular: false
    },
    {
      id: 3,
      name: "Phòng Gia Đình Rộng Rãi",
      type: "Family Room",
      price: 1800000,
      originalPrice: 2000000,
      image: "https://images.unsplash.com/photo-1675621926040-b514257d5941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZXN0YXklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      maxGuests: 6,
      beds: 3,
      bathrooms: 2,
      size: 50,
      amenities: ["Wifi miễn phí", "Điều hòa", "Ban công", "TV Smart", "Tủ lạnh", "Bếp nhỏ", "Khu vực ngồi"],
      rating: 4.9,
      reviews: 67,
      description: "Phòng gia đình với 3 giường đơn và khu vực sinh hoạt chung.",
      available: true,
      isPopular: true
    },
    {
      id: 4,
      name: "Phòng Superior View Núi",
      type: "Superior Room",
      price: 1000000,
      originalPrice: 1200000,
      image: "https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsaXZpbmclMjByb29tJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      maxGuests: 3,
      beds: 1,
      bathrooms: 1,
      size: 30,
      amenities: ["Wifi miễn phí", "Điều hòa", "View núi", "TV Smart", "Tủ lạnh"],
      rating: 4.7,
      reviews: 32,
      description: "Phòng cao cấp với tầm nhìn tuyệt đẹp ra núi đồi Đà Lạt.",
      available: true,
      isPopular: false
    }
  ];

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
    <div className="min-h-screen bg-white">
      {/* Header với thông tin tìm kiếm */}
      <div className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: '#F2D8D8' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBackToHome}
              className="flex items-center space-x-2"
              style={{ color: '#D91A73' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Button>
            
            <div className="text-sm" style={{ color: '#D91A73' }}>
              {rooms.length} phòng có sẵn
            </div>
          </div>

          {/* Thông tin tìm kiếm */}
          <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F2D8D8' }}>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" style={{ color: '#D91A73' }} />
              <span className="text-sm" style={{ color: '#D91A73' }}>
                {formatDate(searchData.checkIn)} - {formatDate(searchData.checkOut)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" style={{ color: '#D91A73' }} />
              <span className="text-sm" style={{ color: '#D91A73' }}>
                {searchData.guests} khách
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" style={{ color: '#D91A73' }} />
              <span className="text-sm" style={{ color: '#D91A73' }}>
                KatHome In Town , Đà Lạt
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters và Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl mb-2" style={{ color: '#D91A73' }}>
              Các phòng có sẵn
            </h1>
            <p className="opacity-80" style={{ color: '#D91A73' }}>
              Tìm thấy {rooms.length} phòng phù hợp với yêu cầu của bạn
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
              style={{ borderColor: '#D91A73', color: '#D91A73' }}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: '#D91A73' }}>Sắp xếp:</span>
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
                style={{ borderColor: '#D91A73', color: '#D91A73' }}
              >
                <span>Giá thấp nhất</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Danh sách phòng */}
        <div className="space-y-6">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow border-0" style={{ backgroundColor: '#F2D8D8' }}>
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
                        style={{ backgroundColor: '#D91A73' }}
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
                          <h3 className="text-xl" style={{ color: '#D91A73' }}>
                            {room.name}
                          </h3>
                          <Badge variant="secondary" style={{ backgroundColor: '#F2A7C3', color: '#D91A73' }}>
                            {room.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(room.rating) ? 'fill-current' : ''}`}
                                style={{ color: '#D91A73' }}
                              />
                            ))}
                          </div>
                          <span className="text-sm" style={{ color: '#D91A73' }}>
                            {room.rating} ({room.reviews} đánh giá)
                          </span>
                        </div>
                        <p className="text-sm opacity-80 mb-4" style={{ color: '#D91A73' }}>
                          {room.description}
                        </p>
                      </div>
                    </div>

                    {/* Thông số phòng */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-white/50">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" style={{ color: '#D91A73' }} />
                        <span className="text-sm" style={{ color: '#D91A73' }}>
                          Tối đa {room.maxGuests} khách
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4" style={{ color: '#D91A73' }} />
                        <span className="text-sm" style={{ color: '#D91A73' }}>
                          {room.beds} giường
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4" style={{ color: '#D91A73' }} />
                        <span className="text-sm" style={{ color: '#D91A73' }}>
                          {room.bathrooms} phòng tắm
                        </span>
                      </div>
                    </div>

                    {/* Tiện nghi */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 5).map((amenity, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: '#D91A73', color: '#D91A73' }}
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 5 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ borderColor: '#D91A73', color: '#D91A73' }}
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
                          <span className="text-2xl" style={{ color: '#D91A73' }}>
                            {formatPrice(room.price)}
                          </span>
                          {room.originalPrice > room.price && (
                            <span className="text-sm line-through opacity-60" style={{ color: '#D91A73' }}>
                              {formatPrice(room.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                          /đêm (đã bao gồm thuế)
                        </span>
                        {room.originalPrice > room.price && (
                          <div className="text-xs mt-1" style={{ color: '#D91A73' }}>
                            Tiết kiệm {formatPrice(room.originalPrice - room.price)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button 
                          variant="outline"
                          style={{ borderColor: '#D91A73', color: '#D91A73' }}
                          onClick={() => onViewRoomDetail(room.id)}
                        >
                          Xem chi tiết
                        </Button>
                        <Button 
                          className="text-white"
                          style={{ backgroundColor: '#D91A73' }}
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
            <Button variant="outline" disabled style={{ borderColor: '#D91A73', color: '#D91A73' }}>
              Trước
            </Button>
            <Button className="text-white" style={{ backgroundColor: '#D91A73' }}>
              1
            </Button>
            <Button variant="outline" style={{ borderColor: '#D91A73', color: '#D91A73' }}>
              2
            </Button>
            <Button variant="outline" style={{ borderColor: '#D91A73', color: '#D91A73' }}>
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
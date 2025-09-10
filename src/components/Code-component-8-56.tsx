import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowLeft,
  Star,
  Users,
  Bed,
  Bath,
  Maximize2,
  Wifi,
  Wind,
  Tv,
  Car,
  Coffee,
  Utensils,
  Shield,
  Clock,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  images: string[];
  maxGuests: number;
  beds: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  rating: number;
  reviews: number;
  description: string;
  detailedDescription: string;
  policies: string[];
  location: string;
}

interface RoomDetailProps {
  roomId: number;
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onBackToSearch: () => void;
  onBackToHome: () => void;
}

export function RoomDetail({ roomId, searchData, onBackToSearch, onBackToHome }: RoomDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchData.checkIn);
  const [checkOut, setCheckOut] = useState(searchData.checkOut);
  const [guests, setGuests] = useState(searchData.guests);

  // Mock data cho phòng chi tiết
  const room: Room = {
    id: roomId,
    name: "Phòng Deluxe với Ban công",
    type: "Deluxe Room",
    price: 1200000,
    originalPrice: 1500000,
    images: [
      "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU3NDQ2NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1632598024410-3d8f24daab57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTczOTk2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1678924133506-7508daa13c7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbW9kZXJufGVufDF8fHx8MTc1NzQ0NzExM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1677160353599-5899a79ae439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBiYWxjb255JTIwdmlld3xlbnwxfHx8fDE3NTczNjM5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    maxGuests: 4,
    beds: 2,
    bathrooms: 1,
    size: 35,
    amenities: [
      "Wifi miễn phí",
      "Điều hòa không khí",
      "Ban công riêng",
      "TV Smart 55 inch",
      "Tủ lạnh mini",
      "Máy pha cà phê",
      "Két sắt",
      "Máy sấy tóc",
      "Đồ vệ sinh cá nhân",
      "Khăn tắm cao cấp",
      "Dép trong phòng",
      "Bàn làm việc",
      "Ghế thư giãn",
      "Tủ quần áo rộng rãi",
      "Cửa sổ lớn"
    ],
    rating: 4.8,
    reviews: 45,
    description: "Phòng rộng rãi với ban công nhìn ra khu vườn, phù hợp cho gia đình nhỏ.",
    detailedDescription: "Phòng Deluxe với Ban công là lựa chọn hoàn hảo cho những ai muốn trải nghiệm sự thoải mái và yên tĩnh. Với diện tích 35m², phòng được thiết kế hiện đại với tone màu ấm áp, tạo cảm giác thư giãn ngay từ khi bước vào. Ban công riêng nhìn ra khu vườn xanh mát sẽ mang đến cho bạn những phút giây thư giãn tuyệt vời, đặc biệt vào buổi sáng sớm hoặc chiều tà khi thưởng thức tách cà phê.",
    policies: [
      "Nhận phòng: 14:00 - 22:00",
      "Trả phòng: 06:00 - 12:00",
      "Không hút thuốc trong phòng",
      "Không cho phép mang theo thú cưng",
      "Hủy miễn phí trước 24 tiếng",
      "Thanh toán khi nhận phòng",
      "Chính sách trẻ em: Miễn phí dưới 6 tuổi"
    ],
    location: "Tầng 2, KatHome In Town , 123 Đường Hoa Hồng, Phường 1, Đà Lạt"
  };

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

  const calculateNights = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalPrice = () => {
    return room.price * calculateNights();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      rating: 5,
      date: "15/12/2024",
      comment: "Phòng rất đẹp và sạch sẽ. Ban công view khu vườn rất thoải mái. Staff nhiệt tình và chu đáo."
    },
    {
      id: 2,
      name: "Trần Thị Hương",
      rating: 5,
      date: "10/12/2024",
      comment: "Vị trí tuyệt vời, gần trung tâm Đà Lạt. Phòng có ban công rất đẹp, phù hợp để thư giãn."
    },
    {
      id: 3,
      name: "Lê Văn Nam",
      rating: 4,
      date: "05/12/2024",
      comment: "Phòng đẹp, tiện nghi đầy đủ. Điều hòa hoạt động tốt. Sẽ quay lại lần sau."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: '#FAD0C4' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBackToSearch}
                className="flex items-center space-x-2"
                style={{ color: '#C599B6' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Trở lại kết quả</span>
              </Button>
              <span className="text-sm opacity-60" style={{ color: '#C599B6' }}>|</span>
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="text-sm"
                style={{ color: '#C599B6' }}
              >
                Trang chủ
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" style={{ color: '#C599B6' }} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" style={{ color: '#C599B6' }} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Images Gallery */}
            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={room.images[currentImageIndex]}
                  alt={`${room.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {room.images.length}
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-opacity-100' : 'border-transparent'
                    }`}
                    style={{ borderColor: index === currentImageIndex ? '#C599B6' : 'transparent' }}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl" style={{ color: '#C599B6' }}>
                      {room.name}
                    </h1>
                    <Badge style={{ backgroundColor: '#F2A7C3', color: '#C599B6' }}>
                      {room.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(room.rating) ? 'fill-current' : ''}`}
                          style={{ color: '#C599B6' }}
                        />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: '#C599B6' }}>
                      {room.rating} ({room.reviews} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm" style={{ color: '#C599B6' }}>
                    <MapPin className="w-4 h-4" />
                    <span>{room.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{room.detailedDescription}</p>

              {/* Room Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" style={{ color: '#C599B6' }} />
                  <div>
                    <div className="text-sm" style={{ color: '#C599B6' }}>Khách tối đa</div>
                    <div className="text-lg" style={{ color: '#C599B6' }}>{room.maxGuests} người</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5" style={{ color: '#C599B6' }} />
                  <div>
                    <div className="text-sm" style={{ color: '#C599B6' }}>Giường</div>
                    <div className="text-lg" style={{ color: '#C599B6' }}>{room.beds} giường</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5" style={{ color: '#C599B6' }} />
                  <div>
                    <div className="text-sm" style={{ color: '#C599B6' }}>Phòng tắm</div>
                    <div className="text-lg" style={{ color: '#C599B6' }}>{room.bathrooms} phòng</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Maximize2 className="w-5 h-5" style={{ color: '#C599B6' }} />
                  <div>
                    <div className="text-sm" style={{ color: '#C599B6' }}>Diện tích</div>
                    <div className="text-lg" style={{ color: '#C599B6' }}>{room.size}m²</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs for details */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#FAD0C4' }}>
                <TabsTrigger value="amenities" style={{ color: '#C599B6' }}>Tiện nghi</TabsTrigger>
                <TabsTrigger value="policies" style={{ color: '#C599B6' }}>Chính sách</TabsTrigger>
                <TabsTrigger value="reviews" style={{ color: '#C599B6' }}>Đánh giá</TabsTrigger>
              </TabsList>
              
              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-2 p-3 rounded-lg"
                      style={{ backgroundColor: '#FAD0C4' }}
                    >
                      <CheckCircle className="w-4 h-4" style={{ color: '#C599B6' }} />
                      <span className="text-sm" style={{ color: '#C599B6' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="policies" className="mt-6">
                <div className="space-y-3">
                  {room.policies.map((policy, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-3 p-3 rounded-lg"
                      style={{ backgroundColor: '#FAD0C4' }}
                    >
                      <Clock className="w-4 h-4 mt-0.5" style={{ color: '#C599B6' }} />
                      <span className="text-sm" style={{ color: '#C599B6' }}>{policy}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#FAD0C4' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div style={{ color: '#C599B6' }}>{review.name}</div>
                            <div className="text-xs opacity-70" style={{ color: '#C599B6' }}>{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`}
                              style={{ color: '#C599B6' }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: '#C599B6' }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl" style={{ color: '#C599B6' }}>
                        {formatPrice(room.price)}
                      </span>
                      {room.originalPrice > room.price && (
                        <span className="text-lg line-through opacity-60" style={{ color: '#C599B6' }}>
                          {formatPrice(room.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm opacity-80" style={{ color: '#C599B6' }}>
                      /đêm (đã bao gồm thuế)
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label style={{ color: '#C599B6' }}>Nhận phòng</Label>
                        <Input 
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label style={{ color: '#C599B6' }}>Trả phòng</Label>
                        <Input 
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label style={{ color: '#C599B6' }}>Số khách</Label>
                      <Input 
                        type="number"
                        min="1"
                        max={room.maxGuests}
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="space-y-3 mb-6 p-4 rounded-lg bg-white/50">
                    <div className="flex justify-between text-sm" style={{ color: '#C599B6' }}>
                      <span>{formatPrice(room.price)} x {calculateNights()} đêm</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: '#C599B6' }}>
                      <span>Phí dịch vụ</span>
                      <span>Miễn phí</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between" style={{ color: '#C599B6' }}>
                        <span>Tổng cộng</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full mb-4 text-white"
                    style={{ backgroundColor: '#C599B6' }}
                  >
                    Đặt phòng ngay
                  </Button>
                  
                  <div className="text-center text-xs opacity-70" style={{ color: '#C599B6' }}>
                    Bạn sẽ chưa bị tính phí
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" style={{ color: '#C599B6' }} />
                      <span className="text-sm" style={{ color: '#C599B6' }}>+84 123 456 789</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" style={{ color: '#C599B6' }} />
                      <span className="text-sm" style={{ color: '#C599B6' }}>info@rosehomestay.com</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { Card, CardContent } from "../card/card";
import { Button } from "../ui/button";
import { MapPin, Bed, Users, Bath, Wifi, Car, Tv, Coffee, Wind } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Locations() {
  const locations = [
    {
      id: 1,
      district: "Tây Hồ",
      addresses: [
        "6 Trịnh Công Sơn",
        "274 Vũ Miên", 
        "133B Yên Phụ",
        "145 Âu Cơ"
      ],
      image: "https://images.unsplash.com/photo-1675621926040-b514257d5941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZXN0YXklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Annie", "Yume", "Sora"],
      amenities: ["Home Cinema", "Master Chef Kitchen", "Romantic Bath", "Self Check-in", "Wifi cao cấp"],
      description: "Khu vực Tây Hồ yên tĩnh, gần Hồ Tây với nhiều quán cafe và nhà hàng"
    },
    {
      id: 2,
      district: "Ba Đình",
      addresses: [
        "29 Phạm Hồng Thái"
      ],
      image: "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWx1eGUlMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzU3NDQ2NDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Aika", "Peony"],
      amenities: ["Home Cinema", "Master Chef Kitchen", "Romantic Bath", "Self Check-in", "Điều hòa thông minh"],
      description: "Trung tâm chính trị, gần Lăng Chủ tịch Hồ Chí Minh và các điểm tham quan"
    },
    {
      id: 3,
      district: "Hoàn Kiếm",
      addresses: [
        "7A ngõ Dã Tượng"
      ],
      image: "https://images.unsplash.com/photo-1659177567968-220c704d58a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NTc0NDY0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Aki"],
      amenities: ["Home Cinema", "Master Chef Kitchen", "Self Check-in", "Wifi tốc độ cao"],
      description: "Trung tâm phố cổ Hà Nội, gần Hồ Hoàn Kiếm và khu vực mua sắm"
    },
    {
      id: 4,
      district: "Thanh Xuân",
      addresses: [
        "29D Phương Liệt"
      ],
      image: "https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsaXZpbmclMjByb29tJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Yume", "Sora"],
      amenities: ["Home Cinema", "Romantic Bath", "Self Check-in", "Chỗ đậu xe riêng"],
      description: "Khu vực phát triển mới với giao thông thuận tiện và nhiều tiện ích"
    },
    {
      id: 5,
      district: "Đống Đa",
      addresses: [
        "30 Vườn hoa 1-6, Hoàng Cầu"
      ],
      image: "https://images.unsplash.com/photo-1572534382965-ef9f328c8db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Annie", "Peony"],
      amenities: ["Master Chef Kitchen", "Romantic Bath", "Self Check-in", "Wifi tốc độ cao"],
      description: "Khu vực sầm uất với nhiều trường đại học và trung tâm thương mại"
    },
    {
      id: 6,
      district: "Cầu Giấy",
      addresses: [
        "18 Xuân Quỳnh, Yên Hòa"
      ],
      image: "https://images.unsplash.com/photo-1743813584899-696881ddc8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lc3RheSUyMG91dGRvb3IlMjBnYXJkZW58ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rooms: ["Aika", "Aki"],
      amenities: ["Home Cinema", "Master Chef Kitchen", "Self Check-in", "Không gian xanh"],
      description: "Khu vực hiện đại với nhiều tòa nhà cao tầng và không gian xanh"
    }
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'home cinema':
        return <Tv className="w-4 h-4" />;
      case 'master chef kitchen':
        return <Coffee className="w-4 h-4" />;
      case 'romantic bath':
        return <Bath className="w-4 h-4" />;
      case 'self check-in':
        return <Users className="w-4 h-4" />;
      case 'wifi tốc độ cao':
      case 'wifi cao cấp':
        return <Wifi className="w-4 h-4" />;
      case 'chỗ đậu xe riêng':
        return <Car className="w-4 h-4" />;
      case 'điều hòa thông minh':
        return <Wind className="w-4 h-4" />;
      default:
        return <Bed className="w-4 h-4" />;
    }
  };

  return (
    <section id="locations" className="py-20" style={{ backgroundColor: '#FDF7F7' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#82213D' }}>
            Hệ thống cơ sở KatHome In Town
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#82213D' }}>
            Khám phá các cơ sở KatHome In Town tại những vị trí đắc địa nhất Hà Nội
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {locations.map((location) => (
            <Card 
              key={location.id} 
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#FFF5F5' }}
            >
              <div className="relative h-64">
                <ImageWithFallback
                  src={location.image}
                  alt={`KatHome In Town ${location.district}`}
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: '#82213D' }}
                >
                  {location.district}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Addresses */}
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#82213D' }}>
                      Địa chỉ
                    </h3>
                    <div className="space-y-1">
                      {location.addresses.map((address, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#82213D' }} />
                          <span style={{ color: '#82213D' }}>{address}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Rooms */}
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#82213D' }}>
                      Các phòng có sẵn
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {location.rooms.map((room, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#F8E8EC', color: '#82213D' }}
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#82213D' }}>
                      Tiện nghi
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {location.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <div style={{ color: '#82213D' }}>
                            {getAmenityIcon(amenity)}
                          </div>
                          <span style={{ color: '#82213D' }}>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm opacity-80" style={{ color: '#82213D' }}>
                    {location.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Locations Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-2 hover:bg-white/20 px-8 py-3 font-semibold"
            style={{ 
              borderColor: '#82213D',
              color: '#82213D'
            }}
          >
            Xem bảng giá các cơ sở
          </Button>
        </div>
      </div>
    </section>
  );
}

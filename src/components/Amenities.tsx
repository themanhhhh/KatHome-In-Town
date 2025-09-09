import { Card, CardContent } from "./ui/card";
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils,
  Tv,
  Wind,
  Bath,
  Shield,
  MapPin,
  Users,
  Clock,
  Phone
} from "lucide-react";

export function Amenities() {
  const amenities = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Wifi miễn phí",
      description: "Tốc độ cao, ổn định"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Chỗ đậu xe",
      description: "An toàn, rộng rãi"
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Điều hòa",
      description: "Mỗi phòng có máy lạnh"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Bếp đầy đủ",
      description: "Nấu ăn tự do"
    },
    {
      icon: <Tv className="w-8 h-8" />,
      title: "TV Smart",
      description: "Netflix, YouTube"
    },
    {
      icon: <Bath className="w-8 h-8" />,
      title: "Phòng tắm riêng",
      description: "Nước nóng 24/7"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Cafe & Trà",
      description: "Miễn phí cho khách"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "An ninh 24/7",
      description: "Camera giám sát"
    }
  ];

  const services = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Tư vấn tour",
      description: "Hỗ trợ lập lịch trình, đặt tour du lịch Đà Lạt"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Thuê xe máy",
      description: "Xe máy chất lượng tốt, giá cả hợp lý"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Đón tiễn sân bay",
      description: "Dịch vụ đưa đón sân bay Liên Khương"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Check-in linh hoạt",
      description: "Nhận phòng sớm, trả phòng muộn (có phí)"
    }
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#D91A73' }}>
            Tiện nghi & Dịch vụ
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#D91A73' }}>
            Chúng tôi cung cấp đầy đủ tiện nghi hiện đại để đảm bảo kỳ nghỉ của bạn thật thoải mái
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="mb-16">
          <h3 className="text-2xl mb-8 text-center" style={{ color: '#D91A73' }}>
            Tiện nghi phòng
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 cursor-pointer group"
                style={{ backgroundColor: '#F2D8D8' }}
              >
                <CardContent className="p-0 space-y-4">
                  <div 
                    className="inline-flex p-4 rounded-full group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F2A7C3' }}
                  >
                    <div style={{ color: '#D91A73' }}>
                      {amenity.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1" style={{ color: '#D91A73' }}>
                      {amenity.title}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                      {amenity.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services */}
        <div 
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#F2BBC9' }}
        >
          <h3 className="text-2xl mb-8 text-center" style={{ color: '#D91A73' }}>
            Dịch vụ thêm
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 bg-white/80 border-0 hover:bg-white transition-colors">
                <CardContent className="p-0 flex items-start space-x-4">
                  <div 
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: '#F2A7C3' }}
                  >
                    <div style={{ color: '#D91A73' }}>
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#D91A73' }}>
                      {service.title}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div 
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: '#D91A73' }}
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white">
                Liên hệ: 0123 456 789 để biết thêm chi tiết
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
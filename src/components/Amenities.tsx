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
        icon: <Shield className="w-8 h-8" />,
        title: "SELF CHECK IN / CHECK OUT",
        description: "Chúng mình không có lễ tân. Riêng tư và bảo mật là tiêu chí hàng đầu của KatHome In Town."
      },
      {
        icon: <Tv className="w-8 h-8" />,
        title: "HOME CINEMA",
        description: "Với hệ thống smart tivi và máy chiếu màn ảnh rộng 120-150 inch sắc nét, âm thanh sống động"
      },
      {
        icon: <Utensils className="w-8 h-8" />,
        title: "MASTER CHEF",
        description: "Nhập vai siêu đầu bếp trổ tài nấu nướng cho những người thân yêu trong căn bếp ấm cúng"
      },
      {
        icon: <Bath className="w-8 h-8" />,
        title: "ROMANTIC BATH EXPERIENCE",
        description: "Mảnh ghép hoàn hảo cho buổi hẹn hò tinh hoa hội tụ. Lãng mạn, ngọt ngào"
      },
      {
        icon: <Wifi className="w-8 h-8" />,
        title: "Wifi tốc độ cao",
        description: "Internet ổn định cho công việc và giải trí"
      },
      {
        icon: <Wind className="w-8 h-8" />,
        title: "Điều hòa thông minh",
        description: "Hệ thống làm mát hiện đại"
      },
      {
        icon: <Coffee className="w-8 h-8" />,
        title: "Cafe & Trà",
        description: "Đồ uống miễn phí cho khách"
      },
      {
        icon: <Car className="w-8 h-8" />,
        title: "Chỗ đậu xe an toàn",
        description: "Bãi đậu xe riêng biệt, giám sát 24/7"
      }
    ];

  const services = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Tư vấn tour Hà Nội",
      description: "Hỗ trợ lập lịch trình tham quan thủ đô và các điểm du lịch lân cận"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "Thuê xe di chuyển",
      description: "Dịch vụ thuê xe máy/xe đạp để khám phá Hà Nội"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Đón tiễn sân bay",
      description: "Dịch vụ đưa đón sân bay Nội Bài và sân bay Gia Lâm"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Check-in linh hoạt",
      description: "Nhận phòng sớm, trả phòng muộn theo nhu cầu khách hàng"
    }
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#C599B6' }}>
            Tiện nghi & Dịch vụ
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#C599B6' }}>
            Chúng tôi cung cấp đầy đủ tiện nghi hiện đại để đảm bảo kỳ nghỉ của bạn thật thoải mái
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="mb-16">
          <h3 className="text-2xl mb-8 text-center" style={{ color: '#C599B6' }}>
            Tiện nghi phòng
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 cursor-pointer group"
                style={{ backgroundColor: '#FAD0C4' }}
              >
                <CardContent className="p-0 space-y-4">
                  <div 
                    className="inline-flex p-4 rounded-full group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F2A7C3' }}
                  >
                    <div style={{ color: '#C599B6' }}>
                      {amenity.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1" style={{ color: '#C599B6' }}>
                      {amenity.title}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
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
          style={{ backgroundColor: '#E6B2BA' }}
        >
          <h3 className="text-2xl mb-8 text-center" style={{ color: '#C599B6' }}>
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
                    <div style={{ color: '#C599B6' }}>
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2" style={{ color: '#C599B6' }}>
                      {service.title}
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
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
              style={{ backgroundColor: '#C599B6' }}
            >
               <Phone className="w-5 h-5 text-white" />
               <span className="text-white">
                 Hotline: 098 894 65 68 để được tư vấn
               </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
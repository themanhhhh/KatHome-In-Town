import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Palette, 
  Bike, 
  Sparkles, 
  Shirt, 
  Clock,
  Phone
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Trang trí phòng theo yêu cầu",
      description: "Trang trí sinh nhật, kỷ niệm, cầu hôn theo ý tưởng của bạn",
      price: "Từ 200.000đ"
    },
    {
      icon: <Bike className="w-8 h-8" />,
      title: "Thuê xe đạp, xe máy",
      description: "Xe đạp, xe máy chất lượng tốt để khám phá Hà Nội",
      price: "Xe đạp: 50.000đ/ngày • Xe máy: 150.000đ/ngày"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Dọn phòng",
      description: "Dịch vụ dọn phòng sạch sẽ trong thời gian lưu trú",
      price: "100.000đ/lần"
    },
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "Giặt là",
      description: "Giặt và là quần áo, chăn ga gối đệm sạch sẽ",
      price: "30.000đ/kg"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Check-in linh hoạt",
      description: "Nhận phòng sớm, trả phòng muộn theo nhu cầu",
      price: "Check-in sớm: 100.000đ • Check-out muộn: 150.000đ"
    }
  ];

  const additionalServices = [
    {
      title: "Đặt tour du lịch",
      description: "Hỗ trợ đặt tour tham quan các điểm du lịch nổi tiếng Hà Nội và vùng lân cận"
    },
    {
      title: "Đưa đón sân bay",
      description: "Dịch vụ đưa đón sân bay Nội Bài 24/7 với giá ưu đãi"
    },
    {
      title: "Tư vấn ẩm thực",
      description: "Giới thiệu các quán ăn ngon, đặc sản Hà Nội gần khu vực lưu trú"
    },
    {
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ khách hàng 24/7 qua hotline và Zalo"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#E8A5B8' }}>
            Dịch vụ KatHome In Town
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#E8A5B8' }}>
            Trải nghiệm dịch vụ chăm sóc khách hàng tận tâm và chuyên nghiệp
          </p>
        </div>

        {/* Main Services */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#E8A5B8' }}>
            Dịch vụ chính
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 cursor-pointer group"
                style={{ backgroundColor: '#FFF5F5' }}
              >
                <CardContent className="p-0 space-y-4">
                  <div 
                    className="inline-flex p-4 rounded-full group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#F8E8EC' }}
                  >
                    <div style={{ color: '#E8A5B8' }}>
                      {service.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#E8A5B8' }}>
                      {service.title}
                    </h4>
                    <p className="text-sm opacity-80 mb-3" style={{ color: '#E8A5B8' }}>
                      {service.description}
                    </p>
                    <div 
                      className="text-sm font-semibold px-3 py-1 rounded-full inline-block"
                      style={{ backgroundColor: '#F0D4DC', color: '#E8A5B8' }}
                    >
                      {service.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div 
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#FDF7F7' }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center" style={{ color: '#E8A5B8' }}>
            Dịch vụ hỗ trợ thêm
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="p-6 bg-white border-0 hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <h4 className="font-bold mb-2" style={{ color: '#E8A5B8' }}>
                    {service.title}
                  </h4>
                  <p className="text-sm opacity-80" style={{ color: '#E8A5B8' }}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div 
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full"
              style={{ backgroundColor: '#E8A5B8' }}
            >
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                Hotline: 098 894 65 68 để được tư vấn chi tiết
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

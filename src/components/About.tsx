import { Card, CardContent } from "./ui/card";
import { CheckCircle, Heart, Home, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
    const features = [
      {
        icon: <Home className="w-6 h-6" />,
        title: "Self Check-in/out",
        description: "Chúng mình không có lễ tân. Riêng tư và bảo mật là tiêu chí hàng đầu của KatHome In Town."
      },
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Home Cinema",
        description: "Smart tivi và máy chiếu màn ảnh rộng 120-150 inch sắc nét, âm thanh sống động"
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: "Master Chef Kitchen",
        description: "Nhập vai siêu đầu bếp trổ tài nấu nướng trong căn bếp ấm cúng và tiện nghi"
      }
    ];

  const highlights = [
    "Hệ thống nhiều cơ sở tại Hà Nội (Tây Hồ, Ba Đình, Hoàn Kiếm...)",
    "Phòng ốc sạch sẽ, thiết kế hiện đại với không gian riêng tư",
    "Bếp đầy đủ tiện nghi cho trải nghiệm Master Chef",
    "Home Cinema với smart TV và máy chiếu màn hình lớn",
    "Self check-in/check-out đảm bảo riêng tư tuyệt đối",
    "Romantic Bath Experience cho những khoảnh khắc lãng mạn"
  ];

  return (
    <section id="about" className="py-20" style={{ backgroundColor: '#FFF7F3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#C599B6' }}>
            Về KatHome In Town 
          </h2>
            <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#C599B6' }}>
             Chúng tôi tự hào mang đến cho du khách những trải nghiệm lưu trú đáng nhớ 
             tại thủ đô Hà Nội với hệ thống homestay hiện đại
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl" style={{ color: '#C599B6' }}>
                Tại sao chọn KatHome In Town ?
              </h3>
               <p className="text-lg leading-relaxed opacity-90" style={{ color: '#C599B6' }}>
                 KatHome In Town không chỉ là nơi nghỉ ngơi mà còn là ngôi nhà thứ hai của bạn tại Hà Nội. 
                 Với thiết kế hiện đại kết hợp phong cách địa phương, chúng tôi tạo ra không gian 
                 vừa quen thuộc vừa mới mẻ, mang đến cảm giác ấm cúng như ở nhà.
               </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={index} className="p-4 bg-white/50 border-0 hover:bg-white/80 transition-colors">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#F2A7C3' }}
                    >
                      <div style={{ color: '#C599B6' }}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ color: '#C599B6' }}>
                        {feature.title}
                      </h4>
                      <p className="text-sm opacity-80" style={{ color: '#C599B6' }}>
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1606202598125-e2077bb5ebcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBsaXZpbmclMjByb29tJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Living room"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1572534382965-ef9f328c8db4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaG9tZXN0YXl8ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Kitchen"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1743813584899-696881ddc8aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lc3RheSUyMG91dGRvb3IlMjBnYXJkZW58ZW58MXx8fHwxNzU3NDQxMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Garden"
                  className="w-full h-32 object-cover rounded-xl"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1675621926040-b514257d5941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZXN0YXklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Bedroom"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <Card className="p-8 bg-white/70 border-0">
          <CardContent className="p-0">
            <h3 className="text-xl mb-6 text-center" style={{ color: '#C599B6' }}>
              Điểm nổi bật của KatHome In Town 
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#C599B6' }} />
                  <span className="text-sm" style={{ color: '#C599B6' }}>
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
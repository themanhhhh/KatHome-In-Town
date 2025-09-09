import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  MessageCircle
} from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20" style={{ backgroundColor: '#F2BBC9' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#D91A73' }}>
            Liên hệ & Đặt phòng
          </h2>
          <p className="text-lg max-w-2xl mx-auto opacity-80" style={{ color: '#D91A73' }}>
            Hãy để lại thông tin để chúng tôi tư vấn và hỗ trợ bạn tốt nhất
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl mb-6" style={{ color: '#D91A73' }}>
                Thông tin liên hệ
              </h3>
              <div className="space-y-6">
                <Card className="p-4 bg-white/80 border-0">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: '#F2A7C3' }}
                    >
                      <MapPin className="w-6 h-6" style={{ color: '#D91A73' }} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ color: '#D91A73' }}>Địa chỉ</h4>
                      <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                        123 Đường Hoa Hồng, Phường 1<br />
                        Thành phố Đà Lạt, Lâm Đồng
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 bg-white/80 border-0">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: '#F2A7C3' }}
                    >
                      <Phone className="w-6 h-6" style={{ color: '#D91A73' }} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ color: '#D91A73' }}>Điện thoại</h4>
                      <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                        Hotline: 0123 456 789<br />
                        Zalo: 0123 456 789
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 bg-white/80 border-0">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: '#F2A7C3' }}
                    >
                      <Mail className="w-6 h-6" style={{ color: '#D91A73' }} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ color: '#D91A73' }}>Email</h4>
                      <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                        info@rosehomestay.com<br />
                        booking@rosehomestay.com
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 bg-white/80 border-0">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: '#F2A7C3' }}
                    >
                      <Clock className="w-6 h-6" style={{ color: '#D91A73' }} />
                    </div>
                    <div>
                      <h4 className="mb-1" style={{ color: '#D91A73' }}>Giờ làm việc</h4>
                      <p className="text-sm opacity-80" style={{ color: '#D91A73' }}>
                        Thứ 2 - Chủ nhật: 6:00 - 22:00<br />
                        Hỗ trợ khẩn cấp: 24/7
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="mb-4" style={{ color: '#D91A73' }}>
                Kết nối với chúng tôi
              </h4>
              <div className="flex space-x-4">
                <Button 
                  size="icon" 
                  className="text-white"
                  style={{ backgroundColor: '#D91A73' }}
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="text-white"
                  style={{ backgroundColor: '#D91A73' }}
                >
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="text-white"
                  style={{ backgroundColor: '#D91A73' }}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-white/90 border-0">
            <CardContent className="p-0">
              <h3 className="text-xl mb-6" style={{ color: '#D91A73' }}>
                Gửi yêu cầu đặt phòng
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Họ và tên *</Label>
                    <Input placeholder="Nhập họ và tên" required />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Số điện thoại *</Label>
                    <Input placeholder="Nhập số điện thoại" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#D91A73' }}>Email *</Label>
                  <Input type="email" placeholder="Nhập email" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Ngày nhận phòng</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Ngày trả phòng</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#D91A73' }}>Số khách</Label>
                  <Input type="number" placeholder="Nhập số khách" min="1" max="8" />
                </div>

                <div className="space-y-2">
                  <Label style={{ color: '#D91A73' }}>Yêu cầu đặc biệt</Label>
                  <Textarea 
                    placeholder="Ví dụ: Phòng tầng cao, view đẹp, có nôi em bé..."
                    rows={4}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit"
                    className="flex-1 text-white"
                    style={{ backgroundColor: '#D91A73' }}
                  >
                    Gửi yêu cầu đặt phòng
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    style={{ 
                      borderColor: '#D91A73',
                      color: '#D91A73'
                    }}
                  >
                    Gọi ngay: 0123 456 789
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F2D8D8' }}>
                <p className="text-sm text-center opacity-80" style={{ color: '#D91A73' }}>
                  * Chúng tôi sẽ phản hồi trong vòng 30 phút trong giờ làm việc
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
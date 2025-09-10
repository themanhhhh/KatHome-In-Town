import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook,
  Instagram,
  MessageCircle,
  Heart
} from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16" style={{ backgroundColor: '#C599B6' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl text-white">KatHome In Town </h3>
             <p className="text-white/80 text-sm leading-relaxed">
               Hệ thống homestay hiện đại tại Hà Nội với thiết kế ấm cúng.
               THOẢI MÁI & RIÊNG TƯ - Nơi lý tưởng để thư giãn.
             </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Facebook className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="text-white/80 hover:text-white transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#amenities" className="text-white/80 hover:text-white transition-colors">
                  Tiện nghi
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-white/80 hover:text-white transition-colors">
                  Hình ảnh
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
               <li className="text-white/80">Đặt phòng trực tuyến</li>
               <li className="text-white/80">Tư vấn tour Hà Nội</li>
               <li className="text-white/80">Thuê xe di chuyển</li>
               <li className="text-white/80">Đón tiễn sân bay Nội Bài</li>
               <li className="text-white/80">Hỗ trợ 24/7</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white">Thông tin liên hệ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                 <MapPin className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
                 <span className="text-white/80">
                   Hệ thống cơ sở tại Hà Nội<br />
                   Tây Hồ, Ba Đình, Hoàn Kiếm...
                 </span>
              </div>
              <div className="flex items-center space-x-3">
                 <Phone className="w-4 h-4 text-white/80 flex-shrink-0" />
                 <span className="text-white/80">098 894 65 68</span>
              </div>
              <div className="flex items-center space-x-3">
                 <Mail className="w-4 h-4 text-white/80 flex-shrink-0" />
                 <span className="text-white/80">kathome.luv@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 KatHome In Town . Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center space-x-1 text-white/60 text-sm mt-4 md:mt-0">
            <span>Được thiết kế với</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
             <span>tại Hà Nội</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
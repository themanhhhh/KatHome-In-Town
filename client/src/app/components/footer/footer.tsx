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
    <footer className="py-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderTop: '1px solid #F8E8EC' }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-heading" style={{ color: '#3D0301' }}>KatHome In Town </h3>
             <p className="text-sm leading-relaxed" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
               Hệ thống homestay hiện đại tại Hà Nội với thiết kế ấm cúng.
               THOẢI MÁI & RIÊNG TƯ - Nơi lý tưởng để thư giãn.
             </p>
            <div className="flex space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer" 
                style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.1)'}
              >
                <Facebook className="w-4 h-4" style={{ color: '#3D0301' }} />
              </div>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer" 
                style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.1)'}
              >
                <Instagram className="w-4 h-4" style={{ color: '#3D0301' }} />
              </div>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer" 
                style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(61, 3, 1, 0.1)'}
              >
                <MessageCircle className="w-4 h-4" style={{ color: '#3D0301' }} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 style={{ color: '#3D0301' }}>Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="transition-colors" style={{ color: 'rgba(61, 3, 1, 0.7)' }} onMouseEnter={(e) => e.target.style.color = '#3D0301'} onMouseLeave={(e) => e.target.style.color = 'rgba(61, 3, 1, 0.7)'}>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors" style={{ color: 'rgba(61, 3, 1, 0.7)' }} onMouseEnter={(e) => e.target.style.color = '#3D0301'} onMouseLeave={(e) => e.target.style.color = 'rgba(61, 3, 1, 0.7)'}>
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#amenities" className="transition-colors" style={{ color: 'rgba(61, 3, 1, 0.7)' }} onMouseEnter={(e) => e.target.style.color = '#3D0301'} onMouseLeave={(e) => e.target.style.color = 'rgba(61, 3, 1, 0.7)'}>
                  Tiện nghi
                </a>
              </li>
              <li>
                <a href="#gallery" className="transition-colors" style={{ color: 'rgba(61, 3, 1, 0.7)' }} onMouseEnter={(e) => e.target.style.color = '#3D0301'} onMouseLeave={(e) => e.target.style.color = 'rgba(61, 3, 1, 0.7)'}>
                  Hình ảnh
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors" style={{ color: 'rgba(61, 3, 1, 0.7)' }} onMouseEnter={(e) => e.target.style.color = '#3D0301'} onMouseLeave={(e) => e.target.style.color = 'rgba(61, 3, 1, 0.7)'}>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 style={{ color: '#3D0301' }}>Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
               <li style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Đặt phòng trực tuyến</li>
               <li style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Tư vấn tour Hà Nội</li>
               <li style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Thuê xe di chuyển</li>
               <li style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Đón tiễn sân bay Nội Bài</li>
               <li style={{ color: 'rgba(61, 3, 1, 0.7)' }}>Hỗ trợ 24/7</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 style={{ color: '#3D0301' }}>Thông tin liên hệ</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                 <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'rgba(61, 3, 1, 0.7)' }} />
                 <span style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                   Hệ thống cơ sở tại Hà Nội<br />
                   Tây Hồ, Ba Đình, Hoàn Kiếm...
                 </span>
              </div>
              <div className="flex items-center space-x-3">
                 <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(61, 3, 1, 0.7)' }} />
                 <span style={{ color: 'rgba(61, 3, 1, 0.7)' }}>098 894 65 68</span>
              </div>
              <div className="flex items-center space-x-3">
                 <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(61, 3, 1, 0.7)' }} />
                 <span style={{ color: 'rgba(61, 3, 1, 0.7)' }}>kathome.luv@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderTop: '1px solid rgba(61, 3, 1, 0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.6)' }}>
            © 2025 KatHome In Town . Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center space-x-1 text-sm mt-4 md:mt-0" style={{ color: 'rgba(61, 3, 1, 0.6)' }}>
            <span>Được thiết kế với</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
             <span>tại Hà Nội</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
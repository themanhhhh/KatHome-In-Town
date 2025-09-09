import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CalendarDays, Users, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeroProps {
  onSearch?: (searchData: { checkIn: string; checkOut: string; guests: number }) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    // Nếu không có ngày, tự động set ngày hiện tại và ngày mai
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const finalCheckIn = checkIn || today.toISOString().split('T')[0];
    const finalCheckOut = checkOut || tomorrow.toISOString().split('T')[0];
    
    if (onSearch) {
      onSearch({ 
        checkIn: finalCheckIn, 
        checkOut: finalCheckOut, 
        guests: guests || 2 
      });
    }
  };
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-opacity-20 to-opacity-40"
        style={{ 
          backgroundColor: '#F2D8D8',
          backgroundImage: `linear-gradient(135deg, #F2D8D8 0%, #F2BBC9 50%, #F2A7C3 100%)`
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm" style={{ color: '#D91A73' }}>
                <MapPin className="w-4 h-4" />
                <span>Đà Lạt, Lâm Đồng</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl leading-tight" style={{ color: '#D91A73' }}>
                KatHome In Town 
                <br />
                <span className="text-2xl md:text-3xl" style={{ color: '#D95291' }}>
                  Không gian ấm cúng như nhà
                </span>
              </h1>
              
              <p className="text-lg opacity-80 max-w-lg" style={{ color: '#D91A73' }}>
                Trải nghiệm kỳ nghỉ tuyệt vời tại homestay xinh đẹp giữa lòng Đà Lạt. 
                Nơi lý tưởng để thư giãn và tận hưởng không khí trong lành của thành phố ngàn hoa.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#D91A73' }} />
                  ))}
                </div>
                <span className="text-sm" style={{ color: '#D91A73' }}>4.9/5 (127 đánh giá)</span>
              </div>
            </div>
            
            {/* Quick booking form */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-0">
                <h3 className="mb-4" style={{ color: '#D91A73' }}>Đặt phòng nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Ngày nhận phòng</Label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        className="pl-10"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                      <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Ngày trả phòng</Label>
                    <div className="relative">
                      <Input 
                        type="date" 
                        className="pl-10"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                      <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label style={{ color: '#D91A73' }}>Số khách</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="2 khách" 
                        className="pl-10" 
                        min="1" 
                        max="8"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value) || 2)}
                      />
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      className="w-full text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#D91A73' }}
                      onClick={handleSearch}
                    >
                      Tìm phòng trống
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1675621926040-b514257d5941?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwaG9tZXN0YXklMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3NDQxMzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="KatHome In Town  bedroom"
                className="w-full h-[600px] object-cover"
              />
              {/* Overlay badge */}
              <div 
                className="absolute top-6 left-6 px-4 py-2 rounded-full text-white text-sm"
                style={{ backgroundColor: '#D91A73' }}
              >
                Từ 800.000đ/đêm
              </div>
            </div>
            
            {/* Floating elements */}
            <div 
              className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-white shadow-lg"
              style={{ borderLeft: `4px solid #D91A73` }}
            >
              <div className="text-sm" style={{ color: '#D91A73' }}>Đặc biệt</div>
              <div className="text-xs opacity-70">Giảm 20% cho khách mới</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
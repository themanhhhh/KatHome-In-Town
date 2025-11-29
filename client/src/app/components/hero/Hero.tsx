'use client';

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { CalendarDays, Users, MapPin, Star, Building2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { coSoApi } from "../../../lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select/select";
import { toast } from "sonner";

interface HeroProps {
  onSearch?: (searchData: { checkIn: string; checkOut: string; guests: number; coSoId?: string }) => void;
}

interface CoSo {
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  sdt: string;
}

export function Hero({ onSearch }: HeroProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedCoSo, setSelectedCoSo] = useState<string>("all");
  const [coSoList, setCoSoList] = useState<CoSo[]>([]);
  const [dateError, setDateError] = useState<string>("");

  useEffect(() => {
    const fetchCoSo = async () => {
      try {
        const data = await coSoApi.getAll();
        setCoSoList(data as CoSo[]);
      } catch (error) {
        console.error("Error fetching co so:", error);
      }
    };
    fetchCoSo();
  }, []);

  // Validate dates
  const validateDates = (checkInDate: string, checkOutDate: string): string => {
    if (!checkInDate && !checkOutDate) {
      return ""; // No error if both empty (will use defaults)
    }
    
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkIn >= checkOut) {
        return "Ngày nhận phòng phải trước ngày trả phòng";
      }
    }
    
    return "";
  };

  // Handle check-in date change
  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    if (value && checkOut) {
      const error = validateDates(value, checkOut);
      setDateError(error);
      if (error) {
        toast.error('Ngày không hợp lệ', {
          description: error,
          duration: 3000,
        });
      }
    } else {
      setDateError("");
    }
  };

  // Handle check-out date change
  const handleCheckOutChange = (value: string) => {
    setCheckOut(value);
    if (checkIn && value) {
      const error = validateDates(checkIn, value);
      setDateError(error);
      if (error) {
        toast.error('Ngày không hợp lệ', {
          description: error,
          duration: 3000,
        });
      }
    } else {
      setDateError("");
    }
  };

  const handleSearch = () => {
    // Validate dates if both are provided
    if (checkIn && checkOut) {
      const error = validateDates(checkIn, checkOut);
      if (error) {
        setDateError(error);
        return; // Don't proceed if validation fails
      }
    }

    // Nếu không có ngày, tự động set ngày hiện tại và ngày mai
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const finalCheckIn = checkIn || today.toISOString().split('T')[0];
    const finalCheckOut = checkOut || tomorrow.toISOString().split('T')[0];
    
    // Final validation with default dates
    const finalError = validateDates(finalCheckIn, finalCheckOut);
    if (finalError) {
      setDateError(finalError);
      return;
    }
    
    setDateError(""); // Clear error if validation passes
    
    if (onSearch) {
      onSearch({ 
        checkIn: finalCheckIn, 
        checkOut: finalCheckOut, 
        guests: guests || 2,
        coSoId: selectedCoSo && selectedCoSo !== "all" ? selectedCoSo : undefined
      });
    }
  };

  // Get minimum date for check-out (should be at least 1 day after check-in)
  const getMinCheckOutDate = (): string => {
    if (!checkIn) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    const minDate = new Date(checkIn);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  // Get minimum date for check-in (should be today or later)
  const getMinCheckInDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center">
      {/* Background with gradient overlay */}
       <div 
         className="absolute inset-0 bg-gradient-to-br from-opacity-20 to-opacity-40"
         style={{ 
           backgroundColor: '#FDF7F7',
           backgroundImage: `linear-gradient(135deg, #FDF7F7 0%, #FFF5F5 50%, #F8E8EC 100%)`
         }}
       />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
               <div className="flex items-center space-x-2 text-sm font-medium" style={{ color: '#82213D' }}>
                 <MapPin className="w-4 h-4" />
                 <span>Hà Nội, Việt Nam</span>
               </div>
               
               <div className="space-y-3">
                 <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight font-heading" style={{ color: '#82213D' }}>
                   KatHome In Town
                 </h1>
                 <h2 className="text-xl md:text-2xl font-semibold font-heading" style={{ color: '#B8899A' }}>
                   THOẢI MÁI & RIÊNG TƯ
                 </h2>
               </div>
               
               <p className="text-lg max-w-lg leading-relaxed font-light" style={{ color: '#6B7280' }}>
                 Ở KatHome In Town, mỗi một vị khách khi ghé thăm đều là một người bạn thân thiết tới chơi nhà. 
                 Chúng mình mong muốn trở thành điểm dừng chân thân thuộc, an yên và riêng biệt của bạn giữa nhịp sống hối hả.
               </p>
              
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-1">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#82213D' }} />
                   ))}
                 </div>
                 <span className="text-sm font-medium" style={{ color: '#82213D' }}>4.9/5 (127 đánh giá)</span>
              </div>
            </div>
            
            {/* Quick booking form */}
            <Card className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
               <CardContent className="p-0">
                 <h3 className="mb-4 font-bold" style={{ color: '#82213D' }}>Đặt phòng nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label className="font-semibold" style={{ color: '#82213D' }}>Cơ sở</Label>
                     <Select value={selectedCoSo} onValueChange={setSelectedCoSo}>
                       <SelectTrigger className="w-full">
                         <Building2 className="w-4 h-4 mr-2" style={{ color: '#82213D' }} />
                         <SelectValue placeholder="Chọn cơ sở" />
                       </SelectTrigger>
                       <SelectContent 
                         className="bg-white border shadow-lg"
                         style={{ backgroundColor: '#ffffff' }}
                       >
                         <SelectItem value="all">Tất cả cơ sở</SelectItem>
                         {coSoList.map((coSo) => (
                           <SelectItem key={coSo.maCoSo} value={coSo.maCoSo}>
                             {coSo.tenCoSo}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                  </div>
                  
                  <div className="space-y-2">
                     <Label className="font-semibold" style={{ color: '#82213D' }}>Ngày nhận phòng</Label>
                     <div className="relative">
                       <Input 
                         type="date" 
                         className={`pl-10 ${dateError ? 'border-red-500' : ''}`}
                         value={checkIn}
                         min={getMinCheckInDate()}
                         onChange={(e) => handleCheckInChange(e.target.value)}
                       />
                       <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#82213D' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <Label className="font-semibold" style={{ color: '#82213D' }}>Ngày trả phòng</Label>
                     <div className="relative">
                       <Input 
                         type="date" 
                         className={`pl-10 ${dateError ? 'border-red-500' : ''}`}
                         value={checkOut}
                         min={getMinCheckOutDate()}
                         onChange={(e) => handleCheckOutChange(e.target.value)}
                       />
                       <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#82213D' }} />
                    </div>
                  </div>
                  
                  
                  <div className="space-y-2">
                     <Label className="font-semibold" style={{ color: '#82213D' }}>Số khách</Label>
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
                       <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#82213D' }} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 flex items-end">
                     <Button 
                       className="w-full text-white hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                       style={{ backgroundColor: '#82213D' }}
                       onClick={handleSearch}
                       disabled={!!dateError}
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
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
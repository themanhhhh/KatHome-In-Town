'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Textarea } from "../textarea/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select/select";
import { Separator } from "../separator/separator";
import { Badge } from "../badge/badge";
import { donDatPhongApi } from "@/lib/api";
import { 
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Bed,
  Clock,
  Shield,
  AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface BookingData {
  roomData: {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    maxGuests: number;
    beds: number;
    bathrooms: number;
  };
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    specialRequests: string;
  };
  paymentInfo: {
    method: string;
    total: number;
  };
  bookingId: string;
  bookingDate: string;
}

interface CheckoutProps {
  roomData: {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    maxGuests: number;
    beds: number;
    bathrooms: number;
    branchId?: string; // coSoId
    branchName?: string;
  };
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    branchId?: string; // coSoId from search
  };
  onBack: () => void;
  onProceedToVerification: (bookingData: BookingData) => void;
}

export function Checkout({ roomData, searchData, onBack, onProceedToVerification }: CheckoutProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    specialRequests: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const calculateNights = () => {
    const checkInDate = new Date(searchData.checkIn);
    const checkOutDate = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalPrice = () => {
    const subtotal = roomData.price * calculateNights();
    const serviceFee = subtotal * 0.05; // 5% service fee
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + serviceFee + tax;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.city.trim()) newErrors.city = "Vui lòng chọn thành phố";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
    
    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = "Vui lòng nhập số thẻ";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = "Số thẻ không hợp lệ";
      if (!formData.expiryDate.trim()) newErrors.expiryDate = "Vui lòng nhập ngày hết hạn";
      if (!formData.cvv.trim()) newErrors.cvv = "Vui lòng nhập CVV";
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "CVV không hợp lệ";
      if (!formData.cardName.trim()) newErrors.cardName = "Vui lòng nhập tên trên thẻ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create booking via API
      const totalPrice = getTotalPrice();
      const customerName = `${formData.firstName} ${formData.lastName}`;
      
      // Get coSoId from roomData or searchData
      const coSoId = roomData.branchId || searchData.branchId;
      
      if (!coSoId) {
        throw new Error('Branch information is missing. Please go back and search again.');
      }
      
      const response = await donDatPhongApi.create({
        coSoId,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerName,
        rooms: [{
          roomId: roomData.id,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          adults: searchData.guests,
          children: 0,
          price: totalPrice,
        }],
        notes: formData.specialRequests || undefined,
      }) as { success: boolean; data: { maDatPhong: string; ngayDat: string }; message?: string };

      if (!response.success) {
        throw new Error(response.message || 'Failed to create booking');
      }

      const booking = response.data;
      
      // For cash payment, proceed to payment success with booking info
      const bookingData: BookingData = {
        roomData,
        searchData,
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          specialRequests: formData.specialRequests
        },
        paymentInfo: {
          method: formData.paymentMethod || 'cash',
          total: totalPrice
        },
        bookingId: booking.maDatPhong,
        bookingDate: booking.ngayDat
      };
      
      setIsProcessing(false);
      onProceedToVerification(bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      setIsProcessing(false);
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đặt phòng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen" data-allow-select="true" data-checkout="true" style={{ backgroundColor: '#fef5f6' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#F8E8EC' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
              style={{ color: '#3D0301' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </Button>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold font-heading" style={{ color: '#3D0301' }}>Thanh toán</h1>
              <Badge style={{ backgroundColor: 'rgba(61, 3, 1, 0.1)', color: '#3D0301' }}>
                Bước 1/2
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                    <User className="w-5 h-5" />
                    <span>Thông tin khách hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: '#3D0301' }}>Họ *</Label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nguyễn"
                        className={errors.firstName ? 'border-red-500' : ''}
                        style={{ color: '#3D0301' }}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.firstName}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: '#3D0301' }}>Tên *</Label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Văn A"
                        className={errors.lastName ? 'border-red-500' : ''}
                        style={{ color: '#3D0301' }}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.lastName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#3D0301' }}>Email *</Label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@email.com"
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        style={{ color: '#3D0301' }}
                      />
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#3D0301' }}>Số điện thoại *</Label>
                    <div className="relative">
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="0123456789"
                        className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        style={{ color: '#3D0301' }}
                      />
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#3D0301' }}>Địa chỉ *</Label>
                    <div className="relative">
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Đường ABC, Quận/Huyện"
                        className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
                        style={{ color: '#3D0301' }}
                      />
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#3D0301' }} />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.address}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: '#3D0301' }}>Thành phố *</Label>
                      <Select value={formData.city} onValueChange={(value: string) => handleInputChange('city', value)}>
                        <SelectTrigger className={`${errors.city ? 'border-red-500' : ''} bg-white`} style={{ color: '#3D0301', backgroundColor: '#ffffff' }}>
                          <SelectValue placeholder="Chọn thành phố" />
                        </SelectTrigger>
                        <SelectContent className="bg-white" style={{ backgroundColor: '#ffffff' }}>
                          <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
                          <SelectItem value="ha-noi">Hà Nội</SelectItem>
                          <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                          <SelectItem value="da-lat">Đà Lạt</SelectItem>
                          <SelectItem value="nha-trang">Nha Trang</SelectItem>
                          <SelectItem value="hoi-an">Hội An</SelectItem>
                          <SelectItem value="phu-quoc">Phú Quốc</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.city && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label style={{ color: '#3D0301' }}>Mã bưu điện</Label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="70000"
                        style={{ color: '#3D0301' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#3D0301' }}>Yêu cầu đặc biệt</Label>
                    <Textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Ví dụ: Tầng cao, view đẹp, giường đôi..."
                      rows={3}
                      style={{ color: '#3D0301' }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#3D0301' }}>
                    <CreditCard className="w-5 h-5" />
                    <span>Thông tin thanh toán</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label style={{ color: '#3D0301' }}>Phương thức thanh toán *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value: string) => handleInputChange('paymentMethod', value)}>
                      <SelectTrigger className={`${errors.paymentMethod ? 'border-red-500' : ''} bg-white`} style={{ color: '#3D0301', backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent className="bg-white" style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="card">Thẻ tín dụng/ghi nợ</SelectItem>
                        <SelectItem value="bank-transfer">Chuyển khoản ngân hàng</SelectItem>
                        <SelectItem value="cash">Thanh toán tại chỗ</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-sm text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.paymentMethod}</span>
                      </p>
                    )}
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 rounded-lg bg-white/50">
                      <div className="space-y-2">
                        <Label style={{ color: '#3D0301' }}>Số thẻ *</Label>
                        <Input
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                            handleInputChange('cardNumber', value);
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={errors.cardNumber ? 'border-red-500' : ''}
                          style={{ color: '#3D0301' }}
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-red-500 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.cardNumber}</span>
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label style={{ color: '#3D0301' }}>Ngày hết hạn *</Label>
                          <Input
                            value={formData.expiryDate}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                              handleInputChange('expiryDate', value);
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={errors.expiryDate ? 'border-red-500' : ''}
                            style={{ color: '#3D0301' }}
                          />
                          {errors.expiryDate && (
                            <p className="text-sm text-red-500 flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.expiryDate}</span>
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label style={{ color: '#3D0301' }}>CVV *</Label>
                          <Input
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            className={errors.cvv ? 'border-red-500' : ''}
                            style={{ color: '#3D0301' }}
                          />
                          {errors.cvv && (
                            <p className="text-sm text-red-500 flex items-center space-x-1">
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.cvv}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label style={{ color: '#3D0301' }}>Tên trên thẻ *</Label>
                        <Input
                          value={formData.cardName}
                          onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                          placeholder="NGUYEN VAN A"
                          className={errors.cardName ? 'border-red-500' : ''}
                          style={{ color: '#3D0301' }}
                        />
                        {errors.cardName && (
                          <p className="text-sm text-red-500 flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.cardName}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "bank-transfer" && (
                    <div className="p-4 rounded-lg bg-white/50">
                      <div className="space-y-2">
                        <h4 className="font-heading" style={{ color: '#3D0301' }}>Thông tin chuyển khoản:</h4>
                        <div className="text-sm space-y-1" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                          <p><strong>Ngân hàng:</strong> Vietcombank</p>
                          <p><strong>Số tài khoản:</strong> 0123456789</p>
                          <p><strong>Tên tài khoản:</strong> KatHome In Town </p>
                          <p><strong>Nội dung:</strong> {formData.firstName} {formData.lastName} - Dat phong</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "cash" && (
                    <div className="p-4 rounded-lg bg-white/50">
                      <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        Bạn sẽ thanh toán trực tiếp tại homestay khi nhận phòng.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full text-white py-3"
                style={{ backgroundColor: '#3D0301' }}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Xác nhận & Thanh toán</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FAD0C4' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#3D0301' }}>Tóm tắt đặt phòng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Room Info */}
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={roomData.image}
                        alt={roomData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-heading" style={{ color: '#3D0301' }}>{roomData.name}</h3>
                      <p className="text-sm opacity-80" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>{roomData.type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{roomData.maxGuests} khách</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bed className="w-3 h-3" />
                          <span>{roomData.beds} giường</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4" style={{ color: '#3D0301' }} />
                      <div className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        <div>Nhận phòng: {formatDate(searchData.checkIn)}</div>
                        <div>Trả phòng: {formatDate(searchData.checkOut)}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4" style={{ color: '#3D0301' }} />
                      <span className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        {searchData.guests} khách, {calculateNights()} đêm
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm" style={{ color: '#3D0301' }}>
                      <span>{formatPrice(roomData.price)} x {calculateNights()} đêm</span>
                      <span>{formatPrice(roomData.price * calculateNights())}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: '#3D0301' }}>
                      <span>Phí dịch vụ (5%)</span>
                      <span>{formatPrice(roomData.price * calculateNights() * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: '#3D0301' }}>
                      <span>Thuế (10%)</span>
                      <span>{formatPrice(roomData.price * calculateNights() * 0.1)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg" style={{ color: '#3D0301' }}>
                      <span>Tổng cộng</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Security Notice */}
                  <div className="flex items-start space-x-2 p-3 rounded-lg bg-white/50">
                    <Shield className="w-4 h-4 mt-0.5" style={{ color: '#3D0301' }} />
                    <div className="text-xs" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                      <p className="font-medium">Thanh toán an toàn</p>
                      <p className="opacity-80">Thông tin của bạn được bảo mật với công nghệ mã hóa SSL</p>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="text-xs space-y-2" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">Chính sách hủy phòng</span>
                    </div>
                    <p className="opacity-80">Hủy miễn phí trước 24 tiếng. Sau thời gian này sẽ tính phí 50% tổng giá trị đặt phòng.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

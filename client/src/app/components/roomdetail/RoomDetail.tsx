'use client';

import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../card/card";
import { Badge } from "../badge/badge";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs/tabs";
import {
  ArrowLeft,
  Users,
  Bed,
  Bath,
  Maximize2,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { phongApi } from "@/lib/api";
import { toast } from "sonner";

interface PhongDetail {
  maPhong: string;
  tenPhong: string;
  moTa: string;
  sucChua: number;
  donGia4h: number;
  donGiaQuaDem: number;
  hinhAnh?: string;
  coSo?: {
    maCoSo: string;
    tenCoSo: string;
    diaChi: string;
    sdt: string;
    hinhAnh?: string;
  };
}

interface RoomData {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  branchId?: string;
  branchName?: string;
}

interface RoomDetailProps {
  roomId: string;
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onBackToSearch: () => void;
  onBackToHome: () => void;
  // Trả thêm thông tin ngày và số khách khi sang trang thanh toán
  onProceedToCheckout: (
    roomData: RoomData,
    searchData: { checkIn: string; checkOut: string; guests: number }
  ) => void;
}

const NIGHT_IN_MS = 1000 * 60 * 60 * 24;

const formatCurrency = (value: number) => {
  if (!value) {
    return "Liên hệ";
  }
  return `${new Intl.NumberFormat("vi-VN").format(value)} VND`;
};

const getNightCount = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) {
    return 1;
  }
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }
  const diff = end.getTime() - start.getTime();
  if (diff <= 0) {
    return 1;
  }
  return Math.ceil(diff / NIGHT_IN_MS);
};

export function RoomDetail({
  roomId,
  searchData,
  onBackToSearch,
  onBackToHome,
  onProceedToCheckout,
}: RoomDetailProps) {
  const [room, setRoom] = useState<PhongDetail | null>(null);
  const [pricing, setPricing] = useState<{ fourHour: number; overnight: number }>(
    { fourHour: 0, overnight: 0 }
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchData.checkIn);
  const [checkOut, setCheckOut] = useState(searchData.checkOut);
  const [guests, setGuests] = useState(searchData.guests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setCheckIn(searchData.checkIn);
    setCheckOut(searchData.checkOut);
    setGuests(searchData.guests);
  }, [searchData.checkIn, searchData.checkOut, searchData.guests]);

  useEffect(() => {
    let active = true;

    const loadRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await phongApi.getById(roomId) as PhongDetail;
        if (!active) {
          return;
        }

        setRoom(data);

        // Sử dụng đơn giá trực tiếp từ phòng
        if (data && active) {
          setPricing({
            fourHour: data.donGia4h ?? 0,
            // Chỉ dùng giá qua đêm để hiển thị và tính toán
            overnight: data.donGiaQuaDem ?? 0,
          });
        } else if (active) {
          setPricing({ fourHour: 0, overnight: 0 });
        }
      } catch (err) {
        if (!active) {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : "Không thể tải dữ liệu phòng";
        const errorDetails = err instanceof Error ? err.stack : String(err);
        
        setError(errorMessage);
        
        // Hiển thị toast với chi tiết lỗi
        toast.error('Lỗi khi tải thông tin phòng', {
          description: errorMessage,
          duration: 5000,
          action: {
            label: 'Chi tiết',
            onClick: () => {
              console.error('Chi tiết lỗi:', errorDetails);
              toast.error('Chi tiết lỗi', {
                description: errorDetails,
                duration: 10000,
              });
            }
          }
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRoom();

    return () => {
      active = false;
    };
  }, [roomId]);

  const imageSources = useMemo(() => {
    if (!room) return [];
    const candidates = [room.hinhAnh].filter(
      (src): src is string => Boolean(src && src.trim())
    );
    return Array.from(new Set(candidates));
  }, [room]);

  useEffect(() => {
    if (imageSources.length === 0 && currentImageIndex !== 0) {
      setCurrentImageIndex(0);
    } else if (imageSources.length > 0 && currentImageIndex >= imageSources.length) {
      setCurrentImageIndex(0);
    }
  }, [imageSources.length, currentImageIndex]);

  const hasImages = imageSources.length > 0;
  const displayName =
    room?.tenPhong || room?.moTa || `Phong ${roomId}`;
  const displayType = room?.tenPhong || "Phong";
  const capacity = room?.sucChua ?? Math.max(2, guests || 1);
  const beds = Math.max(1, Math.ceil(capacity / 2));
  // Chỉ hiển thị giá qua đêm, không fallback sang giá 4 giờ
  const pricePerNight = pricing.overnight || 0;
  const nights = useMemo(
    () => getNightCount(checkIn, checkOut),
    [checkIn, checkOut]
  );
  const subtotal = pricePerNight * nights;
  // Bỏ hoàn toàn phí dịch vụ/thuế: tổng chỉ là giá phòng * số đêm
  const total = subtotal;

  const locationName = room?.coSo?.tenCoSo ?? "Chưa có thông tin cơ sở";
  const locationAddress = room?.coSo?.diaChi ?? "Chưa cập nhật địa chỉ";
  const contactPhone = room?.coSo?.sdt ?? "Chưa cập nhật số điện thoại";
  const contactEmail = "Chưa cập nhật email";
  const locationDisplay =
    room?.coSo
      ? [room.coSo.tenCoSo, room.coSo.diaChi]
          .filter((value): value is string => Boolean(value && value.trim()))
          .join(" - ") || "Chưa có thông tin cơ sở"
      : "Chưa có thông tin cơ sở";

  const description =
    room?.moTa || "Thông tin về phòng sẽ được cập nhật sớm.";

const amenitiesToShow = useMemo(() => {
  const list = (room as unknown as { tienNghi?: string[] } | null)?.tienNghi;
  return Array.isArray(list)
    ? list.filter((item): item is string => Boolean(item && item.trim()))
    : [];
}, [room]);

  const policiesToShow: string[] = [];

  const handleCheckout = () => {
    if (!room) {
      return;
    }

    // Yêu cầu người dùng chọn ngày trước khi sang trang thanh toán
    if (!checkIn || !checkOut) {
      toast.error('Thiếu thông tin đặt phòng', {
        description: 'Vui lòng chọn ngày nhận phòng và trả phòng trước khi thanh toán.',
        duration: 4000,
      });
      return;
    }
    
    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime())) {
      toast.error('Ngày nhận phòng không hợp lệ', {
        description: `Ngày nhận phòng "${checkIn}" không đúng định dạng.`,
        duration: 4000,
      });
      return;
    }
    
    if (isNaN(checkOutDate.getTime())) {
      toast.error('Ngày trả phòng không hợp lệ', {
        description: `Ngày trả phòng "${checkOut}" không đúng định dạng.`,
        duration: 4000,
      });
      return;
    }
    
    if (checkOutDate <= checkInDate) {
      toast.error('Ngày trả phòng không hợp lệ', {
        description: 'Ngày trả phòng phải sau ngày nhận phòng.',
        duration: 4000,
      });
      return;
    }

    const primaryImage = imageSources[0] ?? "";
    onProceedToCheckout(
      {
        id: room.maPhong,
        name: displayName,
        type: displayType,
        price: pricePerNight,
        image: primaryImage,
        maxGuests: capacity,
        beds,
        bathrooms: 1,
        branchId: room.coSo?.maCoSo,
        branchName: room.coSo?.tenCoSo,
      },
      {
        checkIn,
        checkOut,
        guests,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fef5f6" }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3" style={{ color: "#3D0301" }}>
            <div className="w-12 h-12 mx-auto border-4 border-t-transparent rounded-full animate-spin" />
            <p>Đang tải thông tin phòng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#fef5f6" }}>
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md shadow-lg border-0" style={{ backgroundColor: "#FAD0C4" }}>
            <CardContent className="space-y-4 p-6 text-center" style={{ color: "#3D0301" }}>
              <h2 className="text-xl font-semibold">Không thể tải phòng</h2>
              <p>{error || "Phòng không tồn tại hoặc đã được cập nhật."}</p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  style={{ borderColor: "#3D0301", color: "#3D0301" }}
                  onClick={onBackToSearch}
                >
                  Quay lại tìm kiếm
                </Button>
                <Button
                  className="text-white"
                  style={{ backgroundColor: "#3D0301" }}
                  onClick={onBackToHome}
                >
                  Về trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const primaryImage = hasImages
    ? imageSources[currentImageIndex % imageSources.length]
    : undefined;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fef5f6" }}>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onBackToSearch}
              className="flex items-center gap-2"
              style={{ color: "#3D0301" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại kết quả</span>
            </Button>
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="flex items-center gap-2"
              style={{ color: "#3D0301" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              style={{ borderColor: "#3D0301", color: "#3D0301" }}
              onClick={() => setIsFavorite((prev) => !prev)}
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? "#3D0301" : "transparent"}
              />
              <span>{isFavorite ? "Đã lưu" : "Lưu phòng"}</span>
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: "#3D0301", color: "#3D0301" }}
            >
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#FAD0C4" }}>
              <CardContent className="p-0">
                {hasImages ? (
                  <>
                    <div className="relative">
                      <ImageWithFallback
                        src={primaryImage || ""}
                        alt={displayName}
                        className="w-full h-[420px] object-cover"
                      />
                      {imageSources.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                            style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "#fff" }}
                            onClick={() =>
                              setCurrentImageIndex(
                                (prev) =>
                                  (prev - 1 + imageSources.length) % imageSources.length
                              )
                            }
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                            style={{ backgroundColor: "rgba(0,0,0,0.4)", color: "#fff" }}
                            onClick={() =>
                              setCurrentImageIndex(
                                (prev) => (prev + 1) % imageSources.length
                              )
                            }
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                        <Maximize2 className="inline w-3 h-3 mr-1" />
                        {imageSources.length} hình
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 p-4">
                      {imageSources.slice(0, 4).map((src, index) => (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          className={`rounded-lg overflow-hidden border-2 ${
                            currentImageIndex % imageSources.length === index
                              ? "border-[#3D0301]"
                              : "border-transparent"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <ImageWithFallback
                            src={src}
                            alt={`${displayName} ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-[420px] flex items-center justify-center text-sm" style={{ color: "#3D0301", backgroundColor: "rgba(255,255,255,0.5)" }}>
                    Chưa có hình ảnh cho phòng này
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: "#FAD0C4" }}>
              <CardContent className="space-y-6 p-6">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: "#ffffff", color: "#3D0301", borderColor: "#3D0301" }}
                      >
                        {displayType}
                      </Badge>
                      <span className="text-sm" style={{ color: "rgba(61,3,1,0.7)" }}>
                        Mã phòng: {room.maPhong}
                      </span>
                    </div>
                    <h1
                      className="text-2xl font-semibold font-heading"
                      style={{ color: "#3D0301" }}
                    >
                      {displayName}
                    </h1>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(61,3,1,0.7)" }}>
                      <MapPin className="w-4 h-4" />
                      <span>{locationDisplay}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    
                    <div className="text-2xl font-semibold" style={{ color: "#3D0301" }}>
                      {formatCurrency(pricing.overnight)}
                    </div>
                    
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#3D0301" }}>
                    <Users className="w-4 h-4" />
                    <span>Tối đa {capacity} khách</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#3D0301" }}>
                    <Bed className="w-4 h-4" />
                    <span>{beds} giường</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#3D0301" }}>
                    <Bath className="w-4 h-4" />
                    <span>1 phòng tắm</span>
                  </div>
                </div>

                

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-3 bg-white" style={{ color: "#3D0301" }}>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    <TabsTrigger value="policy">Chính sách</TabsTrigger>
                    <TabsTrigger value="area">Khu vực</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="overview"
                    className="mt-4 text-sm space-y-3"
                    style={{ color: "rgba(61,3,1,0.7)" }}
                  >
                    <p>{description}</p>
                  </TabsContent>
                  <TabsContent
                    value="policy"
                    className="mt-4 text-sm space-y-2"
                    style={{ color: "rgba(61,3,1,0.7)" }}
                  >
                    {policiesToShow.length > 0 ? (
                      policiesToShow.map((policy) => (
                        <div key={policy} className="flex items-start gap-2">
                          <CheckCircle
                            className="w-4 h-4 mt-1"
                            style={{ color: "#3D0301" }}
                          />
                          <span>{policy}</span>
                        </div>
                      ))
                    ) : (
                      <span>Chưa có chính sách được cung cấp.</span>
                    )}
                  </TabsContent>
                  <TabsContent
                    value="area"
                    className="mt-4 text-sm space-y-2"
                    style={{ color: "rgba(61,3,1,0.7)" }}
                  >
                    <p>Cơ sở: {locationName}</p>
                    <p>Địa chỉ: {locationAddress}</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{contactEmail}</span>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-24" style={{ backgroundColor: "#FAD0C4" }}>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: "#3D0301" }}>
                    Đặt phòng
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(61,3,1,0.7)" }}>
                    Giá đã bao gồm phí dịch vụ và thuế.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label style={{ color: "#3D0301" }}>Nhận phòng</Label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(event) => setCheckIn(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ color: "#3D0301" }}>Trả phòng</Label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(event) => setCheckOut(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label style={{ color: "#3D0301" }}>Số khách</Label>
                  <Input
                    type="number"
                    min={1}
                    max={capacity}
                    value={guests}
                    onChange={(event) =>
                      setGuests(Math.min(capacity, Math.max(1, Number(event.target.value) || 1)))
                    }
                  />
                </div>

                <div className="p-4 rounded-lg bg-white/60 space-y-3" style={{ color: "#3D0301" }}>
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatCurrency(pricePerNight)} x {nights} đêm
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: "#3D0301" }}
                  onClick={handleCheckout}
                >
                  Đặt phòng ngay
                </Button>

                <div className="space-y-3 text-sm" style={{ color: "rgba(61,3,1,0.7)" }}>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-1" style={{ color: "#3D0301" }} />
                    <span>Hủy miễn phí trước 24 giờ. Sau đó sẽ tính phí 50% tổng giá trị.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-1" style={{ color: "#3D0301" }} />
                    <span>Thanh toán an toàn với giao thức mã hóa SSL.</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm" style={{ color: "rgba(61,3,1,0.7)" }}>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{contactEmail}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

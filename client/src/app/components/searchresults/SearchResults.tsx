'use client';

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../card/card";
import { Badge } from "../badge/badge";
import {
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Calendar,
  MapPin,
  ChevronDown,
  Filter,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  AvailabilityRoom,
  DonGia,
  availabilityApi,
  donGiaApi,
} from "@/lib/api";

interface SearchResultsProps {
  searchData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  onBackToHome: () => void;
  onViewRoomDetail: (roomId: string) => void;
}

interface UiRoom {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  image?: string;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  size?: number;
  amenities: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  available: boolean;
  location?: string;
  hangPhongCode?: string;
}

export function SearchResults({
  searchData,
  onBackToHome,
  onViewRoomDetail,
}: SearchResultsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState<UiRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await availabilityApi.search({
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: searchData.guests,
        });

        if (!isMounted) {
          return;
        }

        let fallbackPriceMap: Record<string, Record<string, number>> = {};
        const needsFallback = (data || []).some(
          (room) => !(room.hangPhong?.donGia && room.hangPhong.donGia.length)
        );

        if (needsFallback) {
          const priceList = await donGiaApi.getAll();
          if (!isMounted) {
            return;
          }

          fallbackPriceMap = (priceList as DonGia[]).reduce<
            Record<string, Record<string, number>>
          >((acc, item) => {
            if (!acc[item.maHangPhong]) {
              acc[item.maHangPhong] = {};
            }
            acc[item.maHangPhong][item.donViTinh] = item.donGia;
            return acc;
          }, {});
        }

        const mapped: UiRoom[] = (data || []).map((room: AvailabilityRoom) => {
          const hangPhongCode = room.hangPhong?.maHangPhong;

          const inlinePrice = (room.hangPhong?.donGia || []).reduce<
            Record<string, number>
          >((acc, item) => {
            acc[item.donViTinh] = item.donGia;
            return acc;
          }, {});

          const priceByUnit =
            Object.keys(inlinePrice).length > 0
              ? inlinePrice
              : hangPhongCode
              ? fallbackPriceMap[hangPhongCode]
              : undefined;

          const price4h = priceByUnit?.["4h"] ?? 0;
          const priceOvernight = priceByUnit?.["quaDem"] ?? price4h;
          const capacity =
            room.hangPhong?.sucChua ?? Math.max(2, searchData.guests || 1);
          return {
            id: room.maPhong,
            name: room.moTa || room.hangPhong?.tenHangPhong || `Phong ${room.maPhong}`,
            type: room.hangPhong?.tenHangPhong || "Phong",
            price: price4h,
            originalPrice: priceOvernight,
            image: room.hinhAnh || room.hangPhong?.hinhAnh,
            maxGuests: capacity,
            beds: Math.max(1, Math.ceil(capacity / 2)),
            bathrooms: 1,
            size: undefined,
            amenities: [],
            rating: undefined,
            reviews: undefined,
            description: room.moTa || room.hangPhong?.moTa,
            available: true,
            location: room.coSo?.tenCoSo,
            hangPhongCode,
          };
        });

        setRooms(mapped);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Khong the tai danh sach phong";
        setError(message);
        setRooms([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (searchData.checkIn && searchData.checkOut) {
      fetchAvailability();
    }

    return () => {
      isMounted = false;
    };
  }, [searchData.checkIn, searchData.checkOut, searchData.guests]);

  const formatPrice = (price: number) => {
    if (!price) {
      return "Lien he";
    }
    return `${new Intl.NumberFormat("vi-VN").format(price)} VND`;
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fef5f6" }}>
      <div
        className="sticky top-0 z-10 bg-white border-b"
        style={{ borderColor: "#F8E8EC" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="flex items-center space-x-2"
              style={{ color: "#3D0301" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ve trang chu</span>
            </Button>

            <div className="text-sm" style={{ color: "#3D0301" }}>
              {loading ? "Dang tai..." : `${rooms.length} phong con trong`}
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-4 p-4 rounded-lg"
            style={{ backgroundColor: "#FAD0C4" }}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" style={{ color: "#3D0301" }} />
              <span className="text-sm" style={{ color: "#3D0301" }}>
                {formatDate(searchData.checkIn)} -{" "}
                {formatDate(searchData.checkOut)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" style={{ color: "#3D0301" }} />
              <span className="text-sm" style={{ color: "#3D0301" }}>
                {searchData.guests} khach
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" style={{ color: "#3D0301" }} />
              <span className="text-sm" style={{ color: "#3D0301" }}>
                Dia diem: Khong bo loc
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl mb-2 font-heading" style={{ color: "#3D0301" }}>
              Phong con trong
            </h1>
            <p
              className="opacity-80"
              style={{ color: "rgba(61, 3, 1, 0.7)" }}
            >
              {loading
                ? "Dang tai ket qua..."
                : `Tim thay ${rooms.length} phong phu hop voi yeu cau`}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
              style={{ borderColor: "#3D0301", color: "#3D0301" }}
            >
              <Filter className="w-4 h-4" />
              <span>Bo loc</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: "#3D0301" }}>
                Sap xep:
              </span>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                style={{ borderColor: "#3D0301", color: "#3D0301" }}
              >
                <span>Gia thap nhat</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm" style={{ color: "#B00020" }}>
            {error}
          </div>
        )}

        <div className="space-y-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden hover:shadow-lg transition-shadow border-0"
              style={{ backgroundColor: "#FAD0C4" }}
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={room.image || ""}
                      alt={room.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    {room.size && (
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {room.size}m2
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3
                            className="text-xl font-heading"
                            style={{ color: "#3D0301" }}
                          >
                            {room.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: "rgba(61, 3, 1, 0.1)",
                              color: "#3D0301",
                            }}
                          >
                            {room.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-2 text-sm" style={{ color: "#3D0301" }}>
                          <MapPin className="w-4 h-4" />
                          <span>{room.location ?? "Chua co thong tin co so"}</span>
                        </div>
                        <p
                          className="text-sm opacity-80 mb-4"
                          style={{ color: "rgba(61, 3, 1, 0.7)" }}
                        >
                          {room.description ?? "Chua co mo ta chi tiet cho phong nay."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-lg bg-white/50">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" style={{ color: "#3D0301" }} />
                        <span className="text-sm" style={{ color: "#3D0301" }}>
                          Toi da {room.maxGuests} khach
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bed className="w-4 h-4" style={{ color: "#3D0301" }} />
                        <span className="text-sm" style={{ color: "#3D0301" }}>
                          {room.beds} giuong
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bath className="w-4 h-4" style={{ color: "#3D0301" }} />
                        <span className="text-sm" style={{ color: "#3D0301" }}>
                          {room.bathrooms} phong tam
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 5).map((amenity, index) => (
                          <Badge
                            key={`${amenity}-${index}`}
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: "#3D0301", color: "#3D0301" }}
                          >
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: "#3D0301", color: "#3D0301" }}
                          >
                            +{room.amenities.length - 5} tien nghi
                          </Badge>
                        )}
                        {room.amenities.length === 0 && (
                          <span className="text-sm opacity-70" style={{ color: "rgba(61, 3, 1, 0.7)" }}>
                            Chua co danh sach tien nghi
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl" style={{ color: "#3D0301" }}>
                            {formatPrice(room.price)}
                          </span>
                          {room.originalPrice > room.price && (
                            <span
                              className="text-sm line-through opacity-60"
                              style={{ color: "rgba(61, 3, 1, 0.7)" }}
                            >
                              {formatPrice(room.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-sm opacity-80"
                          style={{ color: "rgba(61, 3, 1, 0.7)" }}
                        >
                          /4h (da bao gom thue)
                        </span>
                        {room.originalPrice > room.price && (
                          <div
                            className="text-xs mt-1"
                            style={{ color: "#3D0301" }}
                          >
                            Tiet kiem {formatPrice(room.originalPrice - room.price)}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          style={{ borderColor: "#3D0301", color: "#3D0301" }}
                          onClick={() => onViewRoomDetail(room.id)}
                        >
                          Xem chi tiet
                        </Button>
                        <Button
                          className="text-white"
                          style={{ backgroundColor: "#3D0301" }}
                          onClick={() => onViewRoomDetail(room.id)}
                        >
                          Dat phong ngay
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled
              style={{ borderColor: "#3D0301", color: "rgba(61, 3, 1, 0.5)" }}
            >
              Truoc
            </Button>
            <Button
              className="text-white"
              style={{ backgroundColor: "#3D0301" }}
            >
              1
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: "#3D0301", color: "#3D0301" }}
            >
              2
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: "#3D0301", color: "#3D0301" }}
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}




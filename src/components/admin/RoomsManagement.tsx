import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search,
  Filter,
  Bed,
  Users,
  Bath,
  Maximize2,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Star,
  DollarSign,
  Calendar,
  Wifi,
  Wind,
  Tv,
  Home
} from "lucide-react";

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  rating: number;
  reviews: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  description: string;
  totalBookings: number;
  revenue: number;
}

export function RoomsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [rooms] = useState<Room[]>([
    {
      id: 1,
      name: "Phòng Deluxe với Ban công",
      type: "Deluxe",
      price: 1200000,
      originalPrice: 1500000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 35,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Ban công"],
      rating: 4.8,
      reviews: 124,
      status: "available",
      description: "Phòng sang trọng với ban công riêng và tầm nhìn đẹp",
      totalBookings: 45,
      revenue: 54000000
    },
    {
      id: 2,
      name: "Phòng Superior",
      type: "Superior",
      price: 900000,
      originalPrice: 1100000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 28,
      amenities: ["Wifi", "Điều hòa", "Tivi"],
      rating: 4.5,
      reviews: 89,
      status: "occupied",
      description: "Phòng tiện nghi với không gian thoải mái",
      totalBookings: 38,
      revenue: 34200000
    },
    {
      id: 3,
      name: "Phòng Standard",
      type: "Standard",
      price: 600000,
      originalPrice: 750000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 22,
      amenities: ["Wifi", "Điều hòa"],
      rating: 4.2,
      reviews: 67,
      status: "available",
      description: "Phòng cơ bản với đầy đủ tiện nghi cần thiết",
      totalBookings: 32,
      revenue: 19200000
    },
    {
      id: 4,
      name: "Suite Gia đình",
      type: "Suite",
      price: 2000000,
      originalPrice: 2400000,
      maxGuests: 4,
      beds: 2,
      bathrooms: 2,
      size: 55,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Bếp nhỏ", "Ban công", "Phòng khách"],
      rating: 4.9,
      reviews: 156,
      status: "maintenance",
      description: "Suite rộng rãi dành cho gia đình với đầy đủ tiện nghi",
      totalBookings: 28,
      revenue: 56000000
    },
    {
      id: 5,
      name: "Phòng VIP",
      type: "VIP",
      price: 1800000,
      originalPrice: 2200000,
      maxGuests: 2,
      beds: 1,
      bathrooms: 1,
      size: 45,
      amenities: ["Wifi", "Điều hòa", "Tivi", "Ban công", "Minibar", "Jacuzzi"],
      rating: 4.7,
      reviews: 98,
      status: "cleaning",
      description: "Phòng VIP cao cấp với jacuzzi riêng",
      totalBookings: 22,
      revenue: 39600000
    }
  ]);

  // Filter functions
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Selection functions
  const handleSelectAll = () => {
    if (selectedRooms.length === filteredRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(filteredRooms.map(room => room.id));
    }
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-100 text-blue-800">Đã thuê</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-800">Bảo trì</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-100 text-yellow-800">Dọn dẹp</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-3 h-3" />;
      case 'điều hòa':
        return <Wind className="w-3 h-3" />;
      case 'tivi':
        return <Tv className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#D91A73' }}>
            Quản lý phòng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin và trạng thái các phòng tại KatHome In Town 
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            style={{ borderColor: '#D91A73', color: '#D91A73' }}
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </Button>
          <Button
            size="sm"
            className="flex items-center space-x-2 text-white"
            style={{ backgroundColor: '#D91A73' }}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phòng</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#D91A73' }} />
                <Input
                  placeholder="Tìm theo tên phòng, loại phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" style={{ color: '#D91A73' }} />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Có sẵn</SelectItem>
                    <SelectItem value="occupied">Đã thuê</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                    <SelectItem value="cleaning">Dọn dẹp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Loại phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Superior">Superior</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Suite">Suite</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {rooms.length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng phòng
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {rooms.filter(r => r.status === 'available').length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Có sẵn
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {rooms.filter(r => r.status === 'occupied').length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Đã thuê
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {formatPrice(rooms.reduce((sum, r) => sum + r.revenue, 0))}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng doanh thu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Table */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#D91A73' }}>
              Danh sách phòng ({filteredRooms.length})
            </CardTitle>
            {selectedRooms.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: '#D91A73' }}>
                  Đã chọn {selectedRooms.length} phòng
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#D91A73', color: '#D91A73' }}
                >
                  Thao tác hàng loạt
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#F2A7C3' }}>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedRooms.length === filteredRooms.length}
                      onChange={handleSelectAll}
                      style={{ accentColor: '#D91A73' }}
                    />
                  </th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Phòng</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Giá & Loại</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Chi tiết</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Tiện nghi</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Đánh giá</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Thống kê</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Trạng thái</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="border-b hover:bg-white/50" style={{ borderColor: '#F2A7C3' }}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.id)}
                        onChange={() => handleSelectRoom(room.id)}
                        style={{ accentColor: '#D91A73' }}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium" style={{ color: '#D91A73' }}>
                          {room.name}
                        </div>
                        <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                          ID: {room.id}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: '#D91A73' }}>
                          {formatPrice(room.price)}
                        </div>
                        {room.originalPrice > room.price && (
                          <div className="text-xs line-through opacity-60" style={{ color: '#D91A73' }}>
                            {formatPrice(room.originalPrice)}
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {room.type}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm" style={{ color: '#D91A73' }}>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3 h-3" />
                          <span>{room.maxGuests} khách</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bed className="w-3 h-3" />
                          <span>{room.beds} giường</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bath className="w-3 h-3" />
                          <span>{room.bathrooms} phòng tắm</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Maximize2 className="w-3 h-3" />
                          <span>{room.size}m²</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-1 text-xs" style={{ color: '#D91A73' }}>
                            {getAmenityIcon(amenity)}
                            <span>{amenity}</span>
                          </div>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                            +{room.amenities.length - 3} khác
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium" style={{ color: '#D91A73' }}>
                            {room.rating}
                          </span>
                        </div>
                        <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                          {room.reviews} đánh giá
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" style={{ color: '#D91A73' }} />
                          <span className="text-sm" style={{ color: '#D91A73' }}>
                            {room.totalBookings} booking
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3 h-3" style={{ color: '#D91A73' }} />
                          <span className="text-sm" style={{ color: '#D91A73' }}>
                            {formatPrice(room.revenue)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(room.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" style={{ color: '#D91A73' }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRooms.length === 0 && (
              <div className="text-center py-12 opacity-60" style={{ color: '#D91A73' }}>
                <Home className="w-12 h-12 mx-auto mb-4" />
                <p>Không tìm thấy phòng nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
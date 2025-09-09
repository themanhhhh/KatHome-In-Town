import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Download,
  UserPlus,
  Calendar,
  DollarSign,
  Star
} from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  registrationDate: string;
  lastLogin: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'banned';
  averageRating: number;
}

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Mock data - trong thực tế sẽ fetch từ API
  const [users] = useState<User[]>([
    {
      id: 1,
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyenvana@email.com",
      phone: "0987654321",
      city: "TP. Hồ Chí Minh",
      registrationDate: "2024-01-15",
      lastLogin: "2024-12-25",
      totalBookings: 5,
      totalSpent: 8500000,
      status: "active",
      averageRating: 4.8
    },
    {
      id: 2,
      firstName: "Trần",
      lastName: "Thị B",
      email: "tranthib@email.com",
      phone: "0976543210",
      city: "Hà Nội",
      registrationDate: "2024-02-20",
      lastLogin: "2024-12-20",
      totalBookings: 3,
      totalSpent: 4200000,
      status: "active",
      averageRating: 4.5
    },
    {
      id: 3,
      firstName: "Lê",
      lastName: "Văn C",
      email: "levanc@email.com",
      phone: "0965432109",
      city: "Đà Nẵng",
      registrationDate: "2024-03-10",
      lastLogin: "2024-12-15",
      totalBookings: 2,
      totalSpent: 3100000,
      status: "active",
      averageRating: 4.2
    },
    {
      id: 4,
      firstName: "Phạm",
      lastName: "Thị D",
      email: "phamthid@email.com",
      phone: "0954321098",
      city: "Đà Lạt",
      registrationDate: "2024-04-05",
      lastLogin: "2024-11-30",
      totalBookings: 1,
      totalSpent: 1600000,
      status: "inactive",
      averageRating: 4.0
    },
    {
      id: 5,
      firstName: "Hoàng",
      lastName: "Văn E",
      email: "hoangvane@email.com",
      phone: "0943210987",
      city: "Nha Trang",
      registrationDate: "2024-05-12",
      lastLogin: "2024-10-15",
      totalBookings: 0,
      totalSpent: 0,
      status: "inactive",
      averageRating: 0
    },
    {
      id: 6,
      firstName: "Vũ",
      lastName: "Thị F",
      email: "vuthif@email.com",
      phone: "0932109876",
      city: "Hội An",
      registrationDate: "2024-06-18",
      lastLogin: "2024-09-20",
      totalBookings: 1,
      totalSpent: 1200000,
      status: "banned",
      averageRating: 2.0
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Không hoạt động', className: 'bg-yellow-100 text-yellow-800' },
      banned: { label: 'Bị cấm', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#D91A73' }}>
            Quản lý người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin và hoạt động của khách hàng
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
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
            <UserPlus className="w-4 h-4" />
            <span>Thêm người dùng</span>
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
                  placeholder="Tìm theo tên, email, số điện thoại..."
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
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="banned">Bị cấm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {users.length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng người dùng
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Đang hoạt động
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {users.reduce((sum, u) => sum + u.totalBookings, 0)}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng booking
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: '#D91A73' }}>
              {formatPrice(users.reduce((sum, u) => sum + u.totalSpent, 0))}
            </div>
            <div className="text-sm opacity-80" style={{ color: '#D91A73' }}>
              Tổng chi tiêu
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg" style={{ backgroundColor: '#F2D8D8' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#D91A73' }}>
              Danh sách người dùng ({filteredUsers.length})
            </CardTitle>
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: '#D91A73' }}>
                  Đã chọn {selectedUsers.length} người dùng
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
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      style={{ accentColor: '#D91A73' }}
                    />
                  </th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Người dùng</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Liên hệ</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Địa điểm</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Hoạt động</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Thống kê</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Trạng thái</th>
                  <th className="text-left p-4" style={{ color: '#D91A73' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-white/50" style={{ borderColor: '#F2A7C3' }}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        style={{ accentColor: '#D91A73' }}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium" style={{ color: '#D91A73' }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs opacity-60" style={{ color: '#D91A73' }}>
                          ID: {user.id}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm flex items-center space-x-2" style={{ color: '#D91A73' }}>
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="text-sm flex items-center space-x-2" style={{ color: '#D91A73' }}>
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2" style={{ color: '#D91A73' }}>
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{user.city}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm space-y-1" style={{ color: '#D91A73' }}>
                        <div>
                          <span className="opacity-60">Đăng ký: </span>
                          {formatDate(user.registrationDate)}
                        </div>
                        <div>
                          <span className="opacity-60">Truy cập: </span>
                          {formatDate(user.lastLogin)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" style={{ color: '#D91A73' }} />
                          <span className="text-sm" style={{ color: '#D91A73' }}>
                            {user.totalBookings} booking
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3 h-3" style={{ color: '#D91A73' }} />
                          <span className="text-sm" style={{ color: '#D91A73' }}>
                            {formatPrice(user.totalSpent)}
                          </span>
                        </div>
                        {user.averageRating > 0 && (
                          <div className="flex items-center space-x-2">
                            <Star className="w-3 h-3" style={{ color: '#D91A73' }} />
                            <span className="text-sm" style={{ color: '#D91A73' }}>
                              {user.averageRating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
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
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 opacity-60" style={{ color: '#D91A73' }}>
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

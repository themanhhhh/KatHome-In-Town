# Cấu trúc API - Booking Website

## Tổng quan

Dự án sử dụng kiến trúc client-server với:
- **Backend**: Express.js + TypeORM + PostgreSQL (port 3000)
- **Frontend**: Next.js 15 với App Router (API Routes làm proxy)

## Backend Server (Express.js)

### Vị trí: `server/`

#### Cấu trúc:
```
server/
├── controllers/          # Controllers xử lý logic
│   ├── UserController.ts
│   ├── CoSoController.ts
│   ├── PhongController.ts
│   ├── DonDatPhongController.ts
│   └── ...
├── entities/            # TypeORM entities
│   ├── User.ts
│   ├── CoSo.ts
│   ├── Phong.ts
│   └── ...
├── routes/              # Route definitions
│   └── index.ts
├── data/
│   └── datasource.ts    # Database config
└── index.ts             # Entry point
```

#### Endpoints Backend:
- Base URL: `http://localhost:3000/api`
- Tất cả endpoints: xem file `server/routes/index.ts`

#### Khởi động Backend:
```bash
cd server
npm install
npm run dev
```

## Client API Routes (Next.js)

### Vị trí: `client/src/app/api/`

#### Cấu trúc:
```
client/src/app/api/
├── config.ts            # API configuration
├── helpers.ts           # Helper functions
├── README.md            # API documentation
│
├── users/               # Users endpoints
│   ├── route.ts         # GET, POST /api/users
│   └── [id]/
│       └── route.ts     # GET, PUT, DELETE /api/users/:id
│
├── coso/                # Cơ sở endpoints
│   ├── route.ts
│   └── [id]/route.ts
│
├── hangphong/           # Hạng phòng
├── phong/               # Phòng
├── khachhang/           # Khách hàng
├── nhanvien/            # Nhân viên
├── chucvu/              # Chức vụ
├── dichvu/              # Dịch vụ
├── dondatphong/         # Đơn đặt phòng
├── dongia/              # Đơn giá
├── calam/               # Ca làm
└── khieunai/            # Khiếu nại
```

#### Chức năng:
- API Routes hoạt động như **proxy layer**
- Forward requests từ client đến backend server
- Xử lý authentication, validation (nếu cần)
- Giúp bảo mật backend URL và credentials

## API Client Library

### Vị trí: `client/src/lib/api.ts`

Thư viện helper để gọi API dễ dàng từ React components:

```typescript
import { phongApi } from '@/lib/api';

// Sử dụng trong component
const rooms = await phongApi.getAll();
const room = await phongApi.getById('P101');
const newRoom = await phongApi.create(data);
```

#### Available APIs:
- `usersApi`
- `cosoApi`
- `hangPhongApi`
- `phongApi`
- `khachHangApi`
- `nhanVienApi`
- `chucVuApi`
- `dichVuApi`
- `donDatPhongApi`
- `donGiaApi`
- `caLamApi`
- `khieuNaiApi`

## Luồng dữ liệu

```
React Component
    ↓
lib/api.ts (phongApi.getAll())
    ↓
/api/phong (Next.js API Route)
    ↓
http://localhost:3000/api/phong (Backend)
    ↓
PhongController
    ↓
Database (PostgreSQL)
```

## Cấu hình

### Environment Variables

Tạo file `.env.local` trong `client/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Danh sách đầy đủ Endpoints

### 1. Users
- `GET /api/users` - Danh sách
- `GET /api/users/:id` - Chi tiết
- `POST /api/users` - Tạo mới
- `PUT /api/users/:id` - Cập nhật
- `DELETE /api/users/:id` - Xóa

### 2. Cơ sở (CoSo)
- `GET /api/coso`
- `GET /api/coso/:id`
- `POST /api/coso`
- `PUT /api/coso/:id`
- `DELETE /api/coso/:id`

### 3. Hạng phòng (HangPhong)
- `GET /api/hangphong`
- `GET /api/hangphong/:id`
- `POST /api/hangphong`
- `PUT /api/hangphong/:id`
- `DELETE /api/hangphong/:id`

### 4. Phòng (Phong)
- `GET /api/phong`
- `GET /api/phong/:id`
- `POST /api/phong`
- `PUT /api/phong/:id`
- `DELETE /api/phong/:id`

### 5. Khách hàng (KhachHang)
- `GET /api/khachhang`
- `GET /api/khachhang/:id`
- `POST /api/khachhang`
- `PUT /api/khachhang/:id`
- `DELETE /api/khachhang/:id`

### 6. Nhân viên (NhanVien)
- `GET /api/nhanvien`
- `GET /api/nhanvien/:id`
- `POST /api/nhanvien`
- `PUT /api/nhanvien/:id`
- `DELETE /api/nhanvien/:id`

### 7. Chức vụ (ChucVu)
- `GET /api/chucvu`
- `GET /api/chucvu/:id`
- `POST /api/chucvu`
- `PUT /api/chucvu/:id`
- `DELETE /api/chucvu/:id`

### 8. Dịch vụ (DichVu)
- `GET /api/dichvu`
- `GET /api/dichvu/:id`
- `POST /api/dichvu`
- `PUT /api/dichvu/:id`
- `DELETE /api/dichvu/:id`

### 9. Đơn đặt phòng (DonDatPhong)
- `GET /api/dondatphong`
- `GET /api/dondatphong/:id`
- `POST /api/dondatphong`
- `PUT /api/dondatphong/:id`
- `DELETE /api/dondatphong/:id`

### 10. Đơn giá (DonGia)
- `GET /api/dongia`
- `POST /api/dongia`

### 11. Ca làm (CaLam)
- `GET /api/calam`
- `GET /api/calam/:id`
- `POST /api/calam`
- `PUT /api/calam/:id`
- `DELETE /api/calam/:id`

### 12. Khiếu nại (KhieuNai)
- `GET /api/khieunai`
- `GET /api/khieunai/:id`
- `POST /api/khieunai`
- `PUT /api/khieunai/:id`
- `DELETE /api/khieunai/:id`

## Ví dụ sử dụng

### Trong React Component:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { phongApi } from '@/lib/api';

export function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    phongApi.getAll()
      .then(data => setRooms(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : rooms.map(room => (
        <div key={room.maPhong}>{room.tenPhong}</div>
      ))}
    </div>
  );
}
```

### Tạo đơn đặt phòng:

```typescript
import { donDatPhongApi, khachHangApi } from '@/lib/api';

async function createBooking(bookingData) {
  try {
    // Tạo khách hàng trước
    const customer = await khachHangApi.create({
      tenKhachHang: bookingData.name,
      soDienThoai: bookingData.phone,
      email: bookingData.email
    });

    // Tạo đơn đặt phòng
    const booking = await donDatPhongApi.create({
      maKhachHang: customer.maKhachHang,
      maCoSo: bookingData.facility,
      ngayDat: new Date(),
      // ... other fields
    });

    return booking;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}
```

## Testing

### Test API với curl:

```bash
# Get all rooms
curl http://localhost:3001/api/phong

# Get room by ID
curl http://localhost:3001/api/phong/P101

# Create room
curl -X POST http://localhost:3001/api/phong \
  -H "Content-Type: application/json" \
  -d '{"maPhong":"P101","tenPhong":"Room 101"}'
```

### Test với Postman:
Import các endpoints vào Postman và test từng API

## Troubleshooting

### Backend không kết nối được:
1. Kiểm tra backend đã chạy chưa: `http://localhost:3000`
2. Kiểm tra database connection trong `server/data/datasource.ts`
3. Xem logs trong terminal backend

### Client không gọi được API:
1. Kiểm tra `.env.local` có `NEXT_PUBLIC_API_URL`
2. Restart Next.js dev server
3. Kiểm tra Network tab trong browser DevTools

### CORS errors:
Backend đã bật CORS trong `server/index.ts`:
```typescript
app.use(cors());
```

Nếu vẫn lỗi, thêm origin cụ thể:
```typescript
app.use(cors({
  origin: 'http://localhost:3001'
}));
```


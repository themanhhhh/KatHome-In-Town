# API Routes Documentation

Đây là cấu trúc API routes cho phía client Next.js. Các routes này hoạt động như proxy để forward requests đến backend server.

## Cấu hình

Tạo file `.env.local` trong thư mục `client/` với nội dung:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Cấu trúc API

Tất cả API routes đều có cấu trúc CRUD chuẩn:

- `GET /api/{resource}` - Lấy danh sách
- `POST /api/{resource}` - Tạo mới
- `GET /api/{resource}/{id}` - Lấy chi tiết
- `PUT /api/{resource}/{id}` - Cập nhật
- `DELETE /api/{resource}/{id}` - Xóa

## Danh sách Resources

### 1. Users
- `GET /api/users` - Lấy danh sách users
- `POST /api/users` - Tạo user mới
- `GET /api/users/:id` - Lấy thông tin user
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user

### 2. Cơ sở (CoSo)
- `GET /api/coso` - Lấy danh sách cơ sở
- `POST /api/coso` - Tạo cơ sở mới
- `GET /api/coso/:id` - Lấy thông tin cơ sở
- `PUT /api/coso/:id` - Cập nhật cơ sở
- `DELETE /api/coso/:id` - Xóa cơ sở

### 3. Hạng phòng (HangPhong)
- `GET /api/hangphong` - Lấy danh sách hạng phòng
- `POST /api/hangphong` - Tạo hạng phòng mới
- `GET /api/hangphong/:id` - Lấy thông tin hạng phòng
- `PUT /api/hangphong/:id` - Cập nhật hạng phòng
- `DELETE /api/hangphong/:id` - Xóa hạng phòng

### 4. Phòng (Phong)
- `GET /api/phong` - Lấy danh sách phòng
- `POST /api/phong` - Tạo phòng mới
- `GET /api/phong/:id` - Lấy thông tin phòng
- `PUT /api/phong/:id` - Cập nhật phòng
- `DELETE /api/phong/:id` - Xóa phòng

### 5. Khách hàng (KhachHang)
- `GET /api/khachhang` - Lấy danh sách khách hàng
- `POST /api/khachhang` - Tạo khách hàng mới
- `GET /api/khachhang/:id` - Lấy thông tin khách hàng
- `PUT /api/khachhang/:id` - Cập nhật khách hàng
- `DELETE /api/khachhang/:id` - Xóa khách hàng

### 6. Nhân viên (NhanVien)
- `GET /api/nhanvien` - Lấy danh sách nhân viên
- `POST /api/nhanvien` - Tạo nhân viên mới
- `GET /api/nhanvien/:id` - Lấy thông tin nhân viên
- `PUT /api/nhanvien/:id` - Cập nhật nhân viên
- `DELETE /api/nhanvien/:id` - Xóa nhân viên

### 7. Chức vụ (ChucVu)
- `GET /api/chucvu` - Lấy danh sách chức vụ
- `POST /api/chucvu` - Tạo chức vụ mới
- `GET /api/chucvu/:id` - Lấy thông tin chức vụ
- `PUT /api/chucvu/:id` - Cập nhật chức vụ
- `DELETE /api/chucvu/:id` - Xóa chức vụ

### 8. Dịch vụ (DichVu)
- `GET /api/dichvu` - Lấy danh sách dịch vụ
- `POST /api/dichvu` - Tạo dịch vụ mới
- `GET /api/dichvu/:id` - Lấy thông tin dịch vụ
- `PUT /api/dichvu/:id` - Cập nhật dịch vụ
- `DELETE /api/dichvu/:id` - Xóa dịch vụ

### 9. Đơn đặt phòng (DonDatPhong)
- `GET /api/dondatphong` - Lấy danh sách đơn đặt phòng
- `POST /api/dondatphong` - Tạo đơn đặt phòng mới
- `GET /api/dondatphong/:id` - Lấy thông tin đơn đặt phòng
- `PUT /api/dondatphong/:id` - Cập nhật đơn đặt phòng
- `DELETE /api/dondatphong/:id` - Xóa đơn đặt phòng

### 10. Đơn giá (DonGia)
- `GET /api/dongia` - Lấy danh sách đơn giá
- `POST /api/dongia` - Tạo đơn giá mới

### 11. Ca làm (CaLam)
- `GET /api/calam` - Lấy danh sách ca làm
- `POST /api/calam` - Tạo ca làm mới
- `GET /api/calam/:id` - Lấy thông tin ca làm
- `PUT /api/calam/:id` - Cập nhật ca làm
- `DELETE /api/calam/:id` - Xóa ca làm

### 12. Khiếu nại (KhieuNai)
- `GET /api/khieunai` - Lấy danh sách khiếu nại
- `POST /api/khieunai` - Tạo khiếu nại mới
- `GET /api/khieunai/:id` - Lấy thông tin khiếu nại
- `PUT /api/khieunai/:id` - Cập nhật khiếu nại
- `DELETE /api/khieunai/:id` - Xóa khiếu nại

## Sử dụng từ Frontend

### Ví dụ với fetch:

```typescript
// Lấy danh sách phòng
const response = await fetch('/api/phong');
const rooms = await response.json();

// Tạo phòng mới
const newRoom = await fetch('/api/phong', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    maPhong: 'P101',
    tenPhong: 'Phòng 101',
    // ... other fields
  })
});

// Cập nhật phòng
const updated = await fetch('/api/phong/P101', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tenPhong: 'Phòng 101 Updated'
  })
});

// Xóa phòng
await fetch('/api/phong/P101', {
  method: 'DELETE'
});
```

### Ví dụ với axios:

```typescript
import axios from 'axios';

// Lấy danh sách
const { data } = await axios.get('/api/phong');

// Tạo mới
const newRoom = await axios.post('/api/phong', roomData);

// Cập nhật
const updated = await axios.put('/api/phong/P101', updateData);

// Xóa
await axios.delete('/api/phong/P101');
```

## Error Handling

Tất cả API routes đều trả về error response dạng:

```json
{
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi"
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Helper Functions

File `helpers.ts` cung cấp các helper functions để tạo route handlers:

- `createCrudHandlers(resourceName)` - Tạo GET và POST handlers
- `createItemHandlers(resourceName)` - Tạo GET, PUT, DELETE handlers cho item
- `forwardToBackend(request, endpoint)` - Forward request đến backend

## Backend Server

Backend server cần chạy trước khi sử dụng API routes:

```bash
cd server
npm install
npm run dev
```

Backend sẽ chạy tại: http://localhost:3000


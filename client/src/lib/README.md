# API Client Library

## Sử dụng trong Components

### Ví dụ cơ bản:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { phongApi } from '@/lib/api';

export function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const data = await phongApi.getAll();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {rooms.map(room => (
        <div key={room.maPhong}>{room.tenPhong}</div>
      ))}
    </div>
  );
}
```

### Tạo mới:

```typescript
import { phongApi } from '@/lib/api';

async function createRoom() {
  try {
    const newRoom = await phongApi.create({
      maPhong: 'P101',
      tenPhong: 'Phòng 101',
      maHangPhong: 'DELUXE',
      maCoSo: 'CS001',
      trangThai: 'Trống'
    });
    console.log('Created:', newRoom);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Cập nhật:

```typescript
import { phongApi } from '@/lib/api';

async function updateRoom(id: string) {
  try {
    const updated = await phongApi.update(id, {
      trangThai: 'Đang sử dụng'
    });
    console.log('Updated:', updated);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Xóa:

```typescript
import { phongApi } from '@/lib/api';

async function deleteRoom(id: string) {
  try {
    await phongApi.delete(id);
    console.log('Deleted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Error Handling:

```typescript
import { phongApi, ApiError } from '@/lib/api';

async function handleApiCall() {
  try {
    const data = await phongApi.getAll();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // API error
      console.error(`API Error ${error.status}:`, error.message);
      console.error('Data:', error.data);
    } else {
      // Network error
      console.error('Network error:', error);
    }
  }
}
```

## Available APIs

Tất cả các APIs đều có cấu trúc tương tự:

- `usersApi` - Quản lý users
- `cosoApi` - Quản lý cơ sở
- `hangPhongApi` - Quản lý hạng phòng
- `phongApi` - Quản lý phòng
- `khachHangApi` - Quản lý khách hàng
- `nhanVienApi` - Quản lý nhân viên
- `chucVuApi` - Quản lý chức vụ
- `dichVuApi` - Quản lý dịch vụ
- `donDatPhongApi` - Quản lý đơn đặt phòng
- `donGiaApi` - Quản lý đơn giá
- `caLamApi` - Quản lý ca làm
- `khieuNaiApi` - Quản lý khiếu nại

Mỗi API (trừ donGiaApi) đều có các methods:
- `getAll()` - Lấy danh sách
- `getById(id)` - Lấy chi tiết theo ID
- `create(data)` - Tạo mới
- `update(id, data)` - Cập nhật
- `delete(id)` - Xóa


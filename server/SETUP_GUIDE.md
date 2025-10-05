# 🚀 Hướng dẫn Setup Server KatHome

## 📋 Yêu cầu hệ thống

- **Node.js** (v16 trở lên)
- **PostgreSQL** (v12 trở lên)
- **npm** hoặc **yarn**

## 🔧 Cài đặt từ đầu

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd "Homepage for Booking Website/server"
```

### Bước 2: Chạy script setup tự động
```bash
node setup.js
```

### Bước 3: Cấu hình database
1. Mở file `.env`
2. Cập nhật thông tin database:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password
DB_NAME=postgres
JWT_SECRET=your_random_secret_key
```

### Bước 4: Chạy migrations (nếu chưa chạy)
```bash
npx typeorm-ts-node-commonjs migration:run -d ./data/datasource.ts
```

### Bước 5: Import dữ liệu mẫu (tùy chọn)
1. Mở pgAdmin
2. Kết nối đến database
3. Mở Query Tool
4. Copy và paste nội dung file `seed-data.sql`
5. Execute query

### Bước 6: Chạy server
```bash
npm run dev
```

## 🛠️ Lệnh hữu ích

### Migration Commands
```bash
# Chạy migrations
npm run migration:run

# Tạo migration mới
npm run migration:generate -- src/migrations/YourMigrationName

# Revert migration cuối
npm run migration:revert

# Xem trạng thái migrations
npm run migration:show
```

### Development
```bash
# Chạy server development
npm run dev

# Build production
npm run build

# Chạy production
npm run serve
```

## 🔍 Troubleshooting

### Lỗi kết nối database
```
error: password authentication failed for user "postgres"
```
**Giải pháp:**
1. Kiểm tra mật khẩu PostgreSQL trong `.env`
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra user có quyền truy cập database

### Lỗi migration
```
Cannot find module 'typeorm-ts-node-commonjs'
```
**Giải pháp:**
```bash
npm install
npx typeorm-ts-node-commonjs migration:run -d ./data/datasource.ts
```

### Lỗi port đã được sử dụng
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Giải pháp:**
1. Tìm process đang sử dụng port 3001:
```bash
netstat -ano | findstr :3001
```
2. Kill process:
```bash
taskkill /PID <process_id> /F
```

## 📁 Cấu trúc thư mục

```
server/
├── data/
│   └── datasource.ts          # Cấu hình database
├── entities/                   # Database entities
├── src/migrations/            # Migration files
├── controllers/               # API controllers
├── services/                  # Business logic
├── routes/                    # API routes
├── .env                       # Environment variables
├── seed-data.sql             # Sample data
└── setup.js                  # Auto setup script
```

## 🌐 API Endpoints

- **Auth**: `/api/auth/*`
- **Branches**: `/api/coso/*`
- **Rooms**: `/api/phong/*`
- **Bookings**: `/api/dondatphong/*`

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Logs trong terminal
2. File `.env` có đúng cấu hình
3. PostgreSQL đang chạy
4. Port 3001 không bị chiếm dụng

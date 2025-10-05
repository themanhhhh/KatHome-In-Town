# 🏨 Booking Website Server

Backend API server cho hệ thống đặt phòng khách sạn.

## 🚀 Bắt đầu

### Yêu cầu

- Node.js >= 18
- PostgreSQL >= 14
- npm hoặc yarn

### Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình database trong file `data/datasource.ts`:
```typescript
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "your_password",  // Thay đổi password của bạn
  database: "postgres",
  synchronize: false,  // Sử dụng migrations thay vì auto-sync
  logging: true,
  entities: [...],
  migrations: ["src/migrations/*.ts"]
});
```

3. Chạy server:

**Development mode (với hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc thư mục

```
server/
├── controllers/          # Business logic cho mỗi entity
│   ├── UserController.ts
│   ├── CoSoController.ts
│   ├── PhongController.ts
│   └── ...
├── entities/            # TypeORM entities
│   ├── User.ts
│   ├── CoSo.ts
│   ├── Phong.ts
│   └── ...
├── routes/              # API routes
│   └── index.ts
├── data/
│   └── datasource.ts    # Database configuration
├── index.ts             # Entry point
└── package.json
```

## 🔧 Scripts

### Server Scripts
- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với hot reload
- `npm run build` - Build TypeScript sang JavaScript
- `npm run serve` - Chạy server từ build output

### Migration Scripts
- `npm run migration:generate` - Tạo migration từ thay đổi entity
- `npm run migration:create` - Tạo migration trống
- `npm run migration:run` - Chạy tất cả migrations chưa được áp dụng
- `npm run migration:revert` - Hoàn tác migration gần nhất
- `npm run migration:show` - Xem trạng thái migrations

## 📚 API Documentation

Xem chi tiết tại [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Endpoints chính:

- `/api/users` - Quản lý người dùng
- `/api/coso` - Quản lý cơ sở
- `/api/hangphong` - Quản lý hạng phòng
- `/api/phong` - Quản lý phòng
- `/api/khachhang` - Quản lý khách hàng
- `/api/nhanvien` - Quản lý nhân viên
- `/api/chucvu` - Quản lý chức vụ
- `/api/dichvu` - Quản lý dịch vụ
- `/api/dondatphong` - Quản lý đơn đặt phòng
- `/api/chitietdondatphong` - Quản lý chi tiết đơn đặt phòng
- `/api/dongia` - Quản lý đơn giá
- `/api/dondatdichvu` - Quản lý đơn đặt dịch vụ
- `/api/calam` - Quản lý ca làm
- `/api/dangkycalam` - Quản lý đăng ký ca làm
- `/api/theodoicalam` - Quản lý theo dõi ca làm
- `/api/khieunai` - Quản lý khiếu nại

## 🧪 Test API

### Sử dụng cURL:

```bash
# Lấy tất cả users
curl http://localhost:3000/api/users

# Tạo user mới
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"taiKhoan":"test","matKhau":"123","gmail":"test@test.com","vaiTro":"user"}'
```

### Sử dụng Postman hoặc Insomnia:

Import collection từ `API_DOCUMENTATION.md` để test các endpoints.

## 🗄️ Database

### Entities

Server sử dụng TypeORM với các entities:

- `User` - Người dùng hệ thống
- `CoSo` - Cơ sở/Chi nhánh
- `HangPhong` - Hạng phòng (Standard, Deluxe, Suite...)
- `Phong` - Phòng
- `KhachHang` - Khách hàng
- `NhanVien` - Nhân viên
- `ChucVu` - Chức vụ
- `DichVu` - Dịch vụ
- `DonDatPhong` - Đơn đặt phòng
- `ChiTietDonDatPhong` - Chi tiết đơn đặt phòng
- `DonGia` - Đơn giá theo hạng phòng
- `DonDatDichVu` - Đơn đặt dịch vụ
- `CaLam` - Ca làm việc
- `DangKyCaLam` - Đăng ký ca làm
- `TheoDoiCaLam` - Theo dõi ca làm
- `KhieuNai` - Khiếu nại từ khách hàng

### Database Migrations

Dự án sử dụng **TypeORM Migrations** để quản lý database schema một cách an toàn.

#### Quy trình làm việc với Migrations:

1. **Thay đổi Entity:**
   ```typescript
   // Ví dụ: Thêm cột mới vào User entity
   @Entity()
   export class User {
     @PrimaryGeneratedColumn("uuid")
     id!: string;
     
     @Column({ length: 50 })
     taiKhoan!: string;
     
     @Column({ nullable: true })
     avatar?: string; // Cột mới
   }
   ```

2. **Tạo Migration:**
   ```bash
   npm run migration:generate src/migrations/AddAvatarToUser
   ```

3. **Kiểm tra Migration:**
   ```bash
   npm run migration:show
   ```

4. **Chạy Migration:**
   ```bash
   npm run migration:run
   ```

#### Ví dụ Migration được tạo:

```typescript
export class AddAvatarToUser1759388249913 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }
}
```

#### Lưu ý quan trọng:

- ✅ **Luôn backup database** trước khi chạy migration
- ✅ **Test migration** trên database copy trước
- ✅ **Kiểm tra migration file** trước khi chạy
- ❌ **KHÔNG BAO GIỜ** dùng `synchronize: true` trong production

## 🔐 Security

### TODO: Cần implement

- [ ] JWT Authentication
- [ ] Request validation
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection prevention (TypeORM đã hỗ trợ cơ bản)

## 🐛 Debug

Enable logging trong datasource:
```typescript
logging: true  // Hiển thị SQL queries
```

## 📝 License

ISC

## 🚀 Hướng dẫn Migrations chi tiết

### Các lệnh Migration cơ bản:

```bash
# Tạo migration từ thay đổi entity
npm run migration:generate src/migrations/TenMigration

# Tạo migration trống
npm run migration:create src/migrations/TenMigration

# Chạy tất cả migrations chưa được áp dụng
npm run migration:run

# Hoàn tác migration gần nhất
npm run migration:revert

# Xem trạng thái migrations
npm run migration:show
```

### Ví dụ thực tế:

**Bước 1:** Thay đổi entity
```typescript
// entities/User.ts - Thêm cột mới
@Column({ nullable: true })
avatar?: string;
```

**Bước 2:** Tạo migration
```bash
npm run migration:generate src/migrations/AddAvatarToUser
```

**Bước 3:** Kiểm tra migration được tạo
```typescript
// src/migrations/1759388249913-AddAvatarToUser.ts
export class AddAvatarToUser1759388249913 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }
}
```

**Bước 4:** Chạy migration
```bash
npm run migration:run
```

**Bước 5:** Kiểm tra kết quả
```bash
npm run migration:show
# [X] 1 InitialMigration1759388140834
# [X] 2 AddAvatarToUser1759388249913
```

### Troubleshooting:

**Migration đã tồn tại:**
```bash
npm run migration:show  # Xem trạng thái
npm run migration:revert  # Hoàn tác nếu cần
```

**Database connection error:**
- Kiểm tra thông tin kết nối trong `data/datasource.ts`
- Đảm bảo PostgreSQL đang chạy

**Entity không được nhận diện:**
- Kiểm tra import trong `entities/index.ts`
- Đảm bảo entity được thêm vào `datasource.ts`

### 📚 Tài liệu tham khảo:

- [MIGRATIONS_GUIDE.md](./MIGRATIONS_GUIDE.md) - Hướng dẫn chi tiết về migrations
- [TypeORM Migrations Documentation](https://typeorm.io/migrations)

## 👥 Team

Phát triển bởi Team Booking Website


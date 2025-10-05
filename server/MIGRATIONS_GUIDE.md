# 🚀 Hướng dẫn sử dụng TypeORM Migrations

## 📋 Tổng quan

Dự án đã được cấu hình để sử dụng **TypeORM Migrations** thay vì `synchronize: true` để quản lý database schema một cách an toàn.

## 🔧 Cấu hình hiện tại

- ✅ `synchronize: false` - Tắt auto-sync
- ✅ Migrations được lưu trong `src/migrations/`
- ✅ Migration history được lưu trong bảng `migrations`

## 📝 Các lệnh Migration

### 1. **Tạo Migration mới**
```bash
# Tạo migration trống
npm run migration:create src/migrations/TenMigration

# Tự động tạo migration từ thay đổi entity
npm run migration:generate src/migrations/TenMigration
```

### 2. **Chạy Migrations**
```bash
# Chạy tất cả migrations chưa được áp dụng
npm run migration:run

# Xem trạng thái migrations
npm run migration:show

# Hoàn tác migration gần nhất
npm run migration:revert
```

## 🎯 Quy trình làm việc

### **Khi thay đổi Entity:**

1. **Chỉnh sửa entity** (ví dụ: thêm cột mới)
2. **Tạo migration:**
   ```bash
   npm run migration:generate src/migrations/AddNewColumn
   ```
3. **Kiểm tra migration file** được tạo
4. **Chạy migration:**
   ```bash
   npm run migration:run
   ```

### **Ví dụ thực tế:**

```typescript
// Trước khi thay đổi - User.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  
  @Column({ length: 50 })
  taiKhoan!: string;
}

// Sau khi thêm cột mới
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

**Tạo migration:**
```bash
npm run migration:generate src/migrations/AddAvatarToUser
```

**Migration được tạo:**
```typescript
export class AddAvatarToUser1234567890 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }
}
```

## ⚠️ Lưu ý quan trọng

### **Trước khi chạy migration:**
- ✅ **Backup database** trước khi chạy migration
- ✅ **Test migration** trên database copy
- ✅ **Kiểm tra migration file** trước khi chạy

### **Trong Production:**
- ❌ **KHÔNG BAO GIỜ** dùng `synchronize: true`
- ✅ **Luôn sử dụng migrations**
- ✅ **Backup trước mỗi lần deploy**

## 🛠️ Troubleshooting

### **Lỗi thường gặp:**

1. **Migration đã tồn tại:**
   ```bash
   # Xem trạng thái
   npm run migration:show
   
   # Hoàn tác nếu cần
   npm run migration:revert
   ```

2. **Database connection error:**
   - Kiểm tra thông tin kết nối trong `data/datasource.ts`
   - Đảm bảo PostgreSQL đang chạy

3. **Entity không được nhận diện:**
   - Kiểm tra import trong `entities/index.ts`
   - Đảm bảo entity được thêm vào `datasource.ts`

## 📊 Trạng thái hiện tại

- **Migration ban đầu:** `InitialMigration1759388140834` (trống)
- **Database:** Đã có sẵn tất cả bảng
- **Schema:** Khớp với entity definitions

## 🎉 Kết luận

Bây giờ bạn có thể:
- ✅ Thay đổi entity một cách an toàn
- ✅ Tạo migrations có kiểm soát
- ✅ Deploy lên production mà không lo mất dữ liệu
- ✅ Hoàn tác thay đổi nếu cần

**Chúc bạn làm việc hiệu quả với TypeORM Migrations! 🚀**


# 🚀 Quick Start - Authentication System

## Bắt đầu ngay trong 5 phút!

### Bước 1: Cấu hình Email ⏱️ 2 phút

1. Tạo file `server/.env`:
```bash
cd server
echo "JWT_SECRET=my-super-secret-key-2025
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLIENT_URL=http://localhost:3001" > .env
```

2. Lấy Gmail App Password:
   - Vào: https://myaccount.google.com/security
   - Bật "2-Step Verification"
   - Tìm "App passwords" → Tạo mới
   - Copy password → Update vào `.env`

### Bước 2: Khởi động Server ⏱️ 1 phút

```bash
cd server
npm run dev
```

✅ Server chạy tại: http://localhost:3000

### Bước 3: Test API ⏱️ 2 phút

#### 1. Đăng ký (dùng email thật của bạn):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "taiKhoan": "testuser",
    "matKhau": "Test123!",
    "gmail": "YOUR_EMAIL@gmail.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng kiểm tra email...",
  "user": { ... }
}
```

#### 2. Check Email & Copy mã 6 chữ số

📧 **Subject**: "Mã xác thực đăng ký - KatHome In Town"

Ví dụ: `123456`

#### 3. Xác thực Email:

```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "gmail": "YOUR_EMAIL@gmail.com",
    "code": "123456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Xác thực email thành công!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

🎉 Nhận được welcome email!

#### 4. Đăng nhập:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "taiKhoan": "testuser",
    "matKhau": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## ✅ Success! Hệ thống hoạt động!

### Các API có sẵn:

| Endpoint | Method | Chức năng |
|----------|--------|-----------|
| `/api/auth/register` | POST | Đăng ký |
| `/api/auth/verify-email` | POST | Xác thực email |
| `/api/auth/resend-verification` | POST | Gửi lại mã |
| `/api/auth/login` | POST | Đăng nhập |
| `/api/auth/forgot-password` | POST | Quên mật khẩu |
| `/api/auth/reset-password` | POST | Đặt lại mật khẩu |
| `/api/auth/me` | GET | Thông tin user |

---

## 📖 Chi tiết Documentation

- **Full API Docs**: `server/AUTH_README.md`
- **Implementation Summary**: `AUTH_IMPLEMENTATION_SUMMARY.md`
- **API Structure**: `API_STRUCTURE.md`

---

## 🎯 Next Steps

1. ✅ Server authentication hoạt động
2. 🔲 Tích hợp vào Frontend (Next.js)
3. 🔲 Tạo UI components cho Login/Register
4. 🔲 Implement protected routes
5. 🔲 Add token management (localStorage/cookies)

---

## 💡 Tips

### Test với Postman:
Import collection từ các curl commands trên

### Test với Browser:
```javascript
// Đăng ký
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    taiKhoan: 'testuser',
    matKhau: 'Test123!',
    gmail: 'your@email.com'
  })
}).then(r => r.json()).then(console.log);
```

### Check Database:
```sql
SELECT * FROM "user";
```

---

**🎉 Chúc mừng! Authentication system đã sẵn sàng!**


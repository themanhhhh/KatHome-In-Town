# 🔍 DEBUG STEPS - Frontend không hiển thị data

## ✅ Đã xác nhận: Database CÓ DATA
- 5 bookings (1 real + 4 test)
- Tổng doanh thu: ~8 triệu
- Có cả CF và CC status

## 🔍 Bước tiếp theo: Kiểm tra Frontend

### 1. Mở Browser Console (F12)
   - Navigate to: http://localhost:3000/admin/reportsmanagement
   - Mở Console tab
   - Tìm các logs sau:

```
🔍 Raw bookings data: [...]  ← Phải có array với data
🔍 Bookings loading: false
🔍 Bookings error: null hoặc undefined
📊 Calculating stats from bookings: X bookings
📅 Selected date range: month
📈 Bookings by status: {...}
💰 Revenue stats: {...}
📅 Monthly revenue: [...]
```

### 2. Kiểm tra Network Request
   - F12 → Network tab
   - Filter: "dondatphong"
   - Xem request có được gọi không?
   - Response có data không?

### 3. Nếu thấy lỗi CORS:
   ```
   Access-Control-Allow-Origin
   ```
   → Backend cần enable CORS cho localhost:3000

### 4. Nếu API trả về 404/500:
   → Backend server có đang chạy không?
   → Check: http://localhost:3001/api/dondatphong

### 5. Nếu data = [] (rỗng):
   → Backend không query đúng
   → Check backend logs

## 🎯 Copy Console Logs và gửi cho tôi:
1. Tất cả logs bắt đầu với 🔍 📊 📅 💰
2. Network tab → dondatphong request → Response
3. Bất kỳ lỗi đỏ nào trong Console

## 🚨 Quick Fixes:

### Fix 1: Restart Backend
```bash
cd server
npm run dev
```

### Fix 2: Check Backend URL
File: `client/src/lib/api.ts`
```typescript
const API_BASE_URL = 'http://localhost:3001'
```

### Fix 3: Test API trực tiếp
Mở browser: http://localhost:3001/api/dondatphong
→ Phải thấy JSON array với bookings


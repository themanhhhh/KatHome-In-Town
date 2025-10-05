# 🚀 HƯỚNG DẪN CÀI ĐẶT DỮ LIỆU MẪU - NHANH

## ⚡ QUICK START

### **1. Chạy Migration (Thêm trường sucChua)**
```bash
cd server
npm run migration:run
```

✅ Migration này sẽ thêm cột `sucChua` (sức chứa) vào bảng `hang_phong`.

---

### **2. Import Dữ Liệu Mẫu**

#### **Option A: Sử dụng MySQL Workbench / pgAdmin (Khuyến nghị)**
1. Mở MySQL Workbench hoặc pgAdmin
2. Kết nối đến database `booking_db`
3. Mở file `seed-data.sql`
4. Click **Execute** / **Run**

#### **Option B: Sử dụng Command Line**

**MySQL:**
```bash
mysql -u root -p booking_db < seed-data.sql
```

**PostgreSQL:**
```bash
psql -U postgres -d booking_db -f seed-data.sql
```

---

### **3. Restart Server (Nếu đang chạy)**
```bash
# Server sẽ tự động restart nếu dùng nodemon
# Hoặc nhấn Ctrl+C và chạy lại:
npm run dev
```

---

### **4. Test Thử**

#### **A. Kiểm tra API:**
```bash
# Lấy danh sách cơ sở (nên có 9 cơ sở)
curl http://localhost:3001/api/coso

# Lấy chi tiết cơ sở 145AC (12 phòng)
curl http://localhost:3001/api/coso/145AC
```

#### **B. Kiểm tra UI:**
1. Mở browser: `http://localhost:3000`
2. Click dropdown "Cơ sở" trên header
3. Bạn sẽ thấy **9 cơ sở**
4. Click vào bất kỳ cơ sở nào → Xem chi tiết
5. Hoặc vào trực tiếp: `http://localhost:3000/branches`

---

## 📊 DỮ LIỆU ĐÃ IMPORT

✅ **9 cơ sở** (TCS, VM, YP, 145AC, PHT, 7ADT, PL, HC, XQ)  
✅ **6 loại hạng phòng** (VIP, Standard, Deluxe, Suite, Double, Twin)  
✅ **75 phòng** phân bổ đều cho các cơ sở

---

## ❓ TROUBLESHOOTING

### **Lỗi: duplicate key**
```sql
-- Xoá dữ liệu cũ trước
DELETE FROM phong;
DELETE FROM hang_phong;
DELETE FROM co_so;

-- Sau đó chạy lại seed-data.sql
```

### **Lỗi: column "sucChua" does not exist**
```bash
# Chạy migration
cd server
npm run migration:run
```

### **Dropdown "Cơ sở" rỗng**
1. Kiểm tra server đang chạy: `http://localhost:3001/api/coso`
2. Kiểm tra CORS trong `server/index.ts`
3. Kiểm tra browser console (F12) xem có lỗi không

---

## 🎉 DONE!

Giờ bạn có thể:
- ✅ Xem danh sách tất cả cơ sở
- ✅ Click vào từng cơ sở để xem chi tiết
- ✅ Xem phòng được nhóm theo loại (VIP, Standard, etc.)
- ✅ Test booking flow

**Happy Testing! 🚀**


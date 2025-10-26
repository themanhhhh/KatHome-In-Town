# 📊 HƯỚNG DẪN SEED DỮ LIỆU MẪU CHO BÁO CÁO DOANH THU

## 🎯 Mục đích
Script này tạo dữ liệu mẫu để test trang báo cáo doanh thu với các charts và tính năng xuất Excel.

## 📝 Dữ liệu được tạo

### 1. **Khách hàng mẫu**
- 10 khách hàng test (KH-TEST001 đến KH-TEST010)
- Có đầy đủ thông tin: tên, email, số điện thoại, CCCD

### 2. **Booking mẫu**
- **60-72 bookings** trong 6 tháng gần nhất
- Phân bố đều qua các tháng (10-12 bookings/tháng)
- Đa dạng trạng thái:
  - 70% Hoàn thành (CC - Checked out/Completed)
  - 20% Đã xác nhận (CF - Confirmed)
  - 10% Đã hủy (AB - Aborted/Cancelled)

### 3. **Doanh thu**
- Giá trị booking từ 500,000đ đến 3,000,000đ
- Revenue records cho tất cả booking không bị hủy
- Phương thức thanh toán: 70% Cash, 30% Card

## 🚀 CÁCH SỬ DỤNG

### Bước 1: Mở pgAdmin4
1. Kết nối đến database của bạn
2. Click chuột phải vào database → chọn **Query Tool**

### Bước 2: Chạy Script Seed
1. Mở file `server/seed-revenue-data.sql`
2. Copy toàn bộ nội dung
3. Paste vào Query Tool của pgAdmin4
4. Click **Execute/F5** để chạy

### Bước 3: Kiểm tra kết quả
Script sẽ tự động hiển thị:
- Số booking theo từng tháng
- Tổng doanh thu
- Số booking theo trạng thái

### Bước 4: Xem báo cáo
1. Vào trang: `http://localhost:3000/admin/reportsmanagement`
2. Bạn sẽ thấy:
   - ✅ Charts với dữ liệu thực
   - ✅ Thống kê chi tiết
   - ✅ Có thể xuất Excel

## 📊 KẾT QUẢ MONG ĐỢI

### Charts hiển thị:
1. **Bar Chart**: Doanh thu 6 tháng gần nhất
2. **Line Chart**: Số lượng booking theo tháng
3. **Pie Chart**: Phân bố trạng thái booking
4. **Summary Stats**: Tổng quan chi tiết

### File Excel xuất ra gồm 3 sheets:
1. **Tổng quan**: Thống kê tổng hợp
2. **Doanh thu theo tháng**: Chi tiết 6 tháng
3. **Chi tiết booking**: Tất cả bookings

## 🧹 XÓA DỮ LIỆU TEST

Khi không cần nữa, chạy script cleanup:
```sql
-- Mở file server/cleanup-test-data.sql
-- Copy và chạy trong pgAdmin4
```

Hoặc chạy trực tiếp:
```sql
-- Xóa revenue test
DELETE FROM revenue 
WHERE "donDatPhongMaDatPhong" IN (
  SELECT "maDatPhong" FROM don_dat_phong WHERE "maDatPhong" LIKE 'BOOK-TEST%'
);

-- Xóa chi tiết booking
DELETE FROM chi_tiet_don_dat_phong WHERE "maChiTiet" LIKE 'CT-TEST%';

-- Xóa booking
DELETE FROM don_dat_phong WHERE "maDatPhong" LIKE 'BOOK-TEST%';

-- Xóa khách hàng test
DELETE FROM khach_hang WHERE "maKhachHang" LIKE 'KH-TEST%';
```

## ⚠️ LỖI THƯỜNG GẶP

### 1. "Không tìm thấy cơ sở nào"
**Nguyên nhân**: Chưa có dữ liệu cơ sở (co_so)
**Giải pháp**: Tạo ít nhất 1 cơ sở trước

### 2. "Không tìm thấy phòng nào"
**Nguyên nhân**: Chưa có phòng trong database
**Giải pháp**: Tạo ít nhất 1 phòng thuộc cơ sở đó

### 3. "Duplicate key value violates unique constraint"
**Nguyên nhân**: Đã chạy script trước đó
**Giải pháp**: 
- Option 1: Chạy cleanup script trước
- Option 2: Script có `ON CONFLICT DO NOTHING` nên an toàn

## 📌 LƯU Ý

1. ✅ Script **AN TOÀN** - không xóa dữ liệu thật
2. ✅ Tất cả dữ liệu test có prefix **"TEST"**
3. ✅ Có thể chạy nhiều lần (sẽ skip nếu đã tồn tại)
4. ✅ Dữ liệu random nên mỗi lần chạy khác nhau
5. ⚠️ Cần có ít nhất 1 cơ sở và 1 phòng trong DB

## 🎉 KẾT QUẢ

Sau khi chạy script, bạn sẽ có:
- 📊 Dashboard đầy đủ data
- 📈 Charts hiển thị đẹp
- 📥 Có thể xuất Excel
- 🎯 Test mọi tính năng báo cáo

---

**Chúc bạn thành công! 🚀**

Nếu có vấn đề gì, kiểm tra lại:
1. Database connection
2. Có cơ sở và phòng chưa
3. Foreign key constraints


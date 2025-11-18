# Phân tích luồng đặt phòng qua Web so với Flowchart

## So sánh từng bước:

### ✅ 1. TÌM PHÒNG (Search Room) - ĐÚNG

**Flowchart yêu cầu:**
- Khách hàng: Yêu cầu tìm phòng
- Hệ thống: Tiếp nhận yêu cầu → Tra cứu phòng theo yêu cầu
- Khách hàng: Nhận kết quả tra cứu

**Luồng hiện tại:**
- ✅ API: `GET /api/availability?checkIn=...&checkOut=...&guests=...`
- ✅ Controller: `PhongController.searchAvailability`
- ✅ Service: `BookingService.getAvailableRooms`
- ✅ Trả về danh sách phòng trống với đầy đủ thông tin

**Kết luận:** ✅ Đúng với flowchart

---

### ⚠️ 2. THỰC HIỆN ĐẶT PHÒNG (Perform Booking) - THIẾU MỘT SỐ BƯỚC

**Flowchart yêu cầu:**
- Khách hàng: Yêu cầu đặt phòng
- Hệ thống: 
  - Tiếp nhận và xử lý đơn đặt phòng
  - Kiểm tra "Có phòng theo yêu cầu?"
    - **Không:** Thông báo đặt phòng không thành công
    - **Có:** Phiếu xác nhận thông tin đặt phòng và yêu cầu thanh toán

**Luồng hiện tại:**
- ✅ API: `POST /api/dondatphong`
- ✅ Controller: `DonDatPhongController.create`
- ✅ Service: `BookingService.createBooking`
- ✅ Kiểm tra availability trước khi tạo booking
- ✅ Nếu không có phòng: Throw error (trả về lỗi)
- ✅ Nếu có phòng: Tạo booking với:
  - Status: 'R' (Reserved - Đã đặt)
  - PaymentStatus: 'pending'
  - Gửi OTP email để xác nhận
- ⚠️ **THIẾU:** Không có "Phiếu xác nhận thông tin đặt phòng và yêu cầu thanh toán" rõ ràng
  - Hiện tại chỉ trả về booking object trong response
  - Không có document/PDF confirmation slip
  - Không có bước yêu cầu thanh toán rõ ràng (chỉ có paymentStatus = 'pending')

**Kết luận:** ⚠️ Thiếu bước tạo và gửi "Phiếu xác nhận thông tin đặt phòng và yêu cầu thanh toán"

---

### ❌ 3. KHÁCH HÀNG THANH TOÁN THÀNH CÔNG - KHÁC VỚI FLOWCHART

**Flowchart yêu cầu:**
- Khách hàng: Thanh toán tiền đặt phòng thành công
- **Nhân viên CSKH:** Nhập thông tin thanh toán và gửi Hóa đơn
- Khách hàng: Nhận Hóa đơn
- Hệ thống: Lưu Hóa đơn vào tệp

**Luồng hiện tại:**
- ✅ API: `POST /api/dondatphong/:bookingId/finalize-payment`
- ✅ Controller: `DonDatPhongController.finalizePayment`
- ✅ Cập nhật paymentStatus = 'paid'
- ✅ Tạo Revenue record (lưu hóa đơn)
- ✅ Gửi email xác nhận thanh toán
- ❌ **VẤN ĐỀ:** 
  - API có thể được gọi trực tiếp từ frontend (khách hàng)
  - **KHÔNG có bước nhân viên CSKH nhập thông tin thanh toán**
  - Không có phân quyền để chỉ nhân viên mới có thể finalize payment
  - Không có bước nhân viên xác nhận và gửi hóa đơn

**Kết luận:** ❌ Khác với flowchart - Thiếu vai trò nhân viên CSKH trong quá trình thanh toán

---

## Tổng kết:

| Bước | Flowchart | Hiện tại | Trạng thái |
|------|-----------|----------|------------|
| 1. Tìm phòng | ✅ | ✅ | ✅ Đúng |
| 2. Đặt phòng | ✅ | ⚠️ | ⚠️ Thiếu phiếu xác nhận |
| 3. Thanh toán | ✅ (có nhân viên) | ❌ | ❌ Thiếu vai trò nhân viên |

## Đề xuất sửa:

### 1. Thêm "Phiếu xác nhận đặt phòng"
- Tạo endpoint để generate PDF confirmation slip
- Gửi email với confirmation slip sau khi tạo booking thành công
- Hoặc trả về confirmation data trong response để frontend hiển thị

### 2. Sửa luồng thanh toán
- **Option A:** Khách thanh toán → Hệ thống lưu payment info → Nhân viên CSKH xác nhận và finalize
- **Option B:** Khách thanh toán → Nhân viên CSKH nhập thông tin → Finalize và gửi hóa đơn
- Thêm middleware authentication để chỉ nhân viên mới có thể finalize payment
- Tạo API riêng cho nhân viên để nhập thông tin thanh toán

### 3. Thêm entity/table cho Hóa đơn (Invoice)
- Tạo bảng `hoa_don` để lưu trữ hóa đơn
- Link với `DonDatPhong` và `Revenue`
- Có thể generate PDF invoice



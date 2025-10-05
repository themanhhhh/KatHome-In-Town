# 🚀 Routing Quick Reference

## Cấu trúc Routes (Tóm tắt)

| URL | File | Component | Mục đích |
|-----|------|-----------|----------|
| `/` | `app/page.tsx` | Home | Trang chủ với Hero, About, Services, Contact |
| `/search` | `app/search/page.tsx` | SearchResults | Kết quả tìm kiếm phòng |
| `/rooms/[id]` | `app/rooms/[id]/page.tsx` | RoomDetail | Chi tiết phòng |
| `/checkout` | `app/checkout/page.tsx` | Checkout | Thanh toán |
| `/verify-email` | `app/verify-email/page.tsx` | EmailVerification | Xác thực email |
| `/payment-success` | `app/payment-success/page.tsx` | PaymentSuccess | Thành công |
| `/login` | `app/login/page.tsx` | Login | Đăng nhập |
| `/register` | `app/register/page.tsx` | Register | Đăng ký |
| `/admin` | `app/admin/page.tsx` | Admin | Quản trị |

---

## Navigation Flow

```
/ (Home)
  ↓ Search
/search?checkIn=...&checkOut=...&guests=...
  ↓ View Room
/rooms/123?checkIn=...&checkOut=...&guests=...
  ↓ Checkout (+ save to sessionStorage)
/checkout
  ↓ Verify (+ save to sessionStorage)
/verify-email
  ↓ Success (+ clear sessionStorage)
/payment-success
  ↓ Home
/ (Home)
```

---

## Data Storage

### URL Params (shareable)
- Search criteria: `checkIn`, `checkOut`, `guests`
- Room ID: Dynamic route param

### sessionStorage (temporary)
```javascript
// Checkout flow
sessionStorage.setItem('checkoutRoomData', JSON.stringify(data));
sessionStorage.setItem('checkoutSearchData', JSON.stringify(data));
sessionStorage.setItem('verificationBookingData', JSON.stringify(data));
sessionStorage.setItem('paymentSuccessData', JSON.stringify(data));
```

---

## Navigation Examples

### Navigate with Query Params
```typescript
const params = new URLSearchParams({
  checkIn: '2024-12-20',
  checkOut: '2024-12-22',
  guests: '2'
});
router.push(`/search?${params.toString()}`);
```

### Navigate with Dynamic Route
```typescript
router.push(`/rooms/${roomId}`);
```

### Save to sessionStorage and Navigate
```typescript
sessionStorage.setItem('checkoutRoomData', JSON.stringify(roomData));
router.push('/checkout');
```

---

## Files Created

```
✅ app/page.tsx                    (Updated)
✅ app/layout.tsx                  (Added AuthProvider)
✅ app/search/page.tsx             (New)
✅ app/rooms/[id]/page.tsx         (New)
✅ app/checkout/page.tsx           (New)
✅ app/verify-email/page.tsx       (New)
✅ app/payment-success/page.tsx    (New)
✅ app/login/page.tsx              (New)
✅ app/register/page.tsx           (New)
```

---

## Key Changes

### ❌ Removed
- State management in main page
- `currentPage` state
- Props drilling through multiple components

### ✅ Added
- Proper Next.js routing
- URL-based navigation
- sessionStorage for checkout flow
- AuthProvider in layout

### 🔄 Changed Nothing
- Component code (zero changes)
- Component logic
- Styling
- Functionality

---

## Quick Test

```bash
# Start dev server
cd client
npm run dev

# Test URLs
http://localhost:3001/
http://localhost:3001/search?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
http://localhost:3001/rooms/1?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
http://localhost:3001/login
http://localhost:3001/register
```

---

**✅ Refactoring Complete!**
- Better URLs
- Better UX
- Better code organization
- Zero breaking changes


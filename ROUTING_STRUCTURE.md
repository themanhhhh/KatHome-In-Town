# 📁 Routing Structure - Refactored

## ✅ Hoàn thành Refactoring

Đã refactor từ **single-page state management** sang **proper Next.js App Router** với các routes riêng biệt.

---

## 🗺️ Cấu trúc Routes

### Before (Old Structure)
```
Single page với state management:
- currentPage state để switch giữa các views
- Tất cả components render trong 1 page
- Data truyền qua props drilling
```

### After (New Structure)
```
app/
├── page.tsx                    → / (Home)
├── search/
│   └── page.tsx               → /search?checkIn=...&checkOut=...&guests=...
├── rooms/
│   └── [id]/
│       └── page.tsx           → /rooms/123?checkIn=...&checkOut=...&guests=...
├── checkout/
│   └── page.tsx               → /checkout
├── verify-email/
│   └── page.tsx               → /verify-email
├── payment-success/
│   └── page.tsx               → /payment-success
├── login/
│   └── page.tsx               → /login
├── register/
│   └── page.tsx               → /register
└── admin/
    └── page.tsx               → /admin (existing)
```

---

## 📄 Chi tiết từng Route

### 1. Home Page (`/`)
**File**: `app/page.tsx`

**Components**:
- Header
- Hero
- About
- Services
- Contact
- Footer

**Actions**:
- Search → Navigate to `/search`
- Login → Navigate to `/login`
- Register → Navigate to `/register`

---

### 2. Search Results (`/search`)
**File**: `app/search/page.tsx`

**Query Params**:
- `checkIn` - Check-in date
- `checkOut` - Check-out date
- `guests` - Number of guests

**Example URL**:
```
/search?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
```

**Component**: `<SearchResults />`

**Actions**:
- Back to Home → Navigate to `/`
- View Room → Navigate to `/rooms/[id]`

---

### 3. Room Detail (`/rooms/[id]`)
**File**: `app/rooms/[id]/page.tsx`

**Dynamic Params**:
- `id` - Room ID (from URL path)

**Query Params**:
- `checkIn` - Check-in date
- `checkOut` - Check-out date
- `guests` - Number of guests

**Example URL**:
```
/rooms/123?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
```

**Component**: `<RoomDetail />`

**Actions**:
- Back to Search → Navigate to `/search` (with params)
- Back to Home → Navigate to `/`
- Proceed to Checkout → Save data to sessionStorage → Navigate to `/checkout`

---

### 4. Checkout (`/checkout`)
**File**: `app/checkout/page.tsx`

**Data Source**: `sessionStorage`
- `checkoutRoomData` - Room information
- `checkoutSearchData` - Search criteria

**Component**: `<Checkout />`

**Actions**:
- Back → Navigate to `/rooms/[id]` (with params)
- Proceed → Save booking data → Navigate to `/verify-email`

**Note**: If no data in sessionStorage, redirect to home

---

### 5. Email Verification (`/verify-email`)
**File**: `app/verify-email/page.tsx`

**Data Source**: `sessionStorage`
- `verificationBookingData` - Booking information

**Component**: `<EmailVerification />`

**Actions**:
- Back → Navigate to `/checkout`
- Success → Save to sessionStorage → Navigate to `/payment-success`

**Note**: If no data in sessionStorage, redirect to home

---

### 6. Payment Success (`/payment-success`)
**File**: `app/payment-success/page.tsx`

**Data Source**: `sessionStorage`
- `paymentSuccessData` - Completed booking info

**Component**: `<PaymentSuccess />`

**Actions**:
- Back to Home → Clear sessionStorage → Navigate to `/`

**Note**: Automatically clears all checkout data from sessionStorage

---

### 7. Login (`/login`)
**File**: `app/login/page.tsx`

**Component**: `<Login />`

**Actions**:
- Back → Navigate to `/`
- Switch to Register → Navigate to `/register`
- Login Success → Navigate to `/`

---

### 8. Register (`/register`)
**File**: `app/register/page.tsx`

**Component**: `<Register />`

**Actions**:
- Back → Navigate to `/`
- Switch to Login → Navigate to `/login`
- Register Success → Navigate to `/`

---

### 9. Admin (`/admin`)
**File**: `app/admin/page.tsx` (existing)

Protected admin dashboard

---

## 🔄 Data Flow

### Search → Room Detail → Checkout → Verify → Success

```
1. Home (/)
   User searches
   ↓
2. Search (/search?params)
   Query params: checkIn, checkOut, guests
   ↓
3. Room Detail (/rooms/123?params)
   URL params + sessionStorage
   ↓
4. Checkout (/checkout)
   sessionStorage:
   - checkoutRoomData
   - checkoutSearchData
   ↓
5. Verify Email (/verify-email)
   sessionStorage:
   - verificationBookingData
   ↓
6. Payment Success (/payment-success)
   sessionStorage:
   - paymentSuccessData
   Clear all data
   ↓
7. Home (/)
```

---

## 💾 Data Storage Strategy

### URL Parameters (Query Params)
Used for **shareable** data:
- Search criteria (checkIn, checkOut, guests)
- Room ID
- Filters

**Benefits**:
- ✅ Shareable links
- ✅ Bookmark-able
- ✅ Browser back/forward works
- ✅ SEO friendly

### sessionStorage
Used for **temporary** checkout flow data:
- Room details during checkout
- Guest information
- Booking details

**Benefits**:
- ✅ Survives page refresh
- ✅ Clears on tab close
- ✅ Isolated per tab
- ✅ Secure (not in URL)

**Keys Used**:
```typescript
sessionStorage.setItem('checkoutRoomData', JSON.stringify(roomData));
sessionStorage.setItem('checkoutSearchData', JSON.stringify(searchData));
sessionStorage.setItem('verificationBookingData', JSON.stringify(bookingData));
sessionStorage.setItem('paymentSuccessData', JSON.stringify(finalData));
```

---

## 🛣️ Navigation Methods

### 1. useRouter (Client-side navigation)
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/search?checkIn=2024-12-20');
```

### 2. Link component (Declarative)
```typescript
import Link from 'next/link';

<Link href="/login">Login</Link>
```

### 3. Programmatic with params
```typescript
const params = new URLSearchParams({
  checkIn: '2024-12-20',
  checkOut: '2024-12-22',
  guests: '2'
});
router.push(`/search?${params.toString()}`);
```

---

## 🔧 Layout Changes

### Root Layout (`app/layout.tsx`)
**Added**:
- `<AuthProvider>` wrapper
- Updated metadata (title, description)
- Changed lang to "vi"

**Now wraps all pages with Auth Context**:
```typescript
<AuthProvider>
  {children}
</AuthProvider>
```

---

## 📊 Benefits of New Structure

### ✅ Proper Routing
- Each page has its own URL
- Shareable links
- Browser back/forward works correctly
- Better SEO

### ✅ Better Code Organization
- Separated concerns
- Each page is independent
- Easier to maintain
- Easier to add new pages

### ✅ Performance
- Automatic code splitting per route
- Lazy loading of page components
- Better initial load time

### ✅ Developer Experience
- Follows Next.js conventions
- Easier to understand
- Better for team collaboration
- Type-safe routing

### ✅ User Experience
- Bookmarkable pages
- Shareable links
- Browser history works
- Faster navigation

---

## 🔍 How to Navigate

### From Home to Search
```typescript
const handleSearch = (data) => {
  const params = new URLSearchParams({
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    guests: data.guests.toString(),
  });
  router.push(`/search?${params.toString()}`);
};
```

### From Search to Room Detail
```typescript
const handleViewRoom = (roomId) => {
  const params = new URLSearchParams({
    checkIn: searchData.checkIn,
    checkOut: searchData.checkOut,
    guests: searchData.guests.toString(),
  });
  router.push(`/rooms/${roomId}?${params.toString()}`);
};
```

### From Room to Checkout
```typescript
const handleCheckout = (roomData) => {
  // Save to sessionStorage
  sessionStorage.setItem('checkoutRoomData', JSON.stringify(roomData));
  sessionStorage.setItem('checkoutSearchData', JSON.stringify(searchData));
  // Navigate
  router.push('/checkout');
};
```

---

## 📝 Migration Notes

### What Changed:
- ❌ Removed state management in main page
- ❌ Removed currentPage state
- ❌ Removed prop drilling
- ✅ Added proper Next.js routes
- ✅ Added sessionStorage for checkout flow
- ✅ Added URL parameters for search data
- ✅ Added AuthProvider in layout

### What Stayed the Same:
- ✅ All component code unchanged
- ✅ All component logic unchanged
- ✅ All styling unchanged
- ✅ All functionality works the same

### Files Modified:
- `app/page.tsx` - Now only shows home
- `app/layout.tsx` - Added AuthProvider

### Files Created:
- `app/search/page.tsx`
- `app/rooms/[id]/page.tsx`
- `app/checkout/page.tsx`
- `app/verify-email/page.tsx`
- `app/payment-success/page.tsx`
- `app/login/page.tsx`
- `app/register/page.tsx`

---

## 🧪 Testing URLs

### Test these URLs:
```
http://localhost:3001/
http://localhost:3001/search?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
http://localhost:3001/rooms/1?checkIn=2024-12-20&checkOut=2024-12-22&guests=2
http://localhost:3001/checkout
http://localhost:3001/verify-email
http://localhost:3001/payment-success
http://localhost:3001/login
http://localhost:3001/register
http://localhost:3001/admin
```

---

## 🎯 Summary

**Before**: Single page app with state management
**After**: Proper Next.js app with multiple routes

**Result**:
- ✅ Better UX (shareable links, browser history)
- ✅ Better DX (cleaner code, easier to maintain)
- ✅ Better Performance (code splitting, lazy loading)
- ✅ Better SEO (proper URLs, metadata)
- ✅ No component code changes needed

**Zero Breaking Changes** - All functionality preserved! 🎉


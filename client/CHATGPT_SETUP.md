# Hướng dẫn tích hợp ChatGPT vào AIChat

## 1. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục `client/` với nội dung:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 2. Lấy OpenAI API Key

1. Truy cập https://platform.openai.com/
2. Đăng nhập hoặc tạo tài khoản
3. Vào API Keys section
4. Tạo API key mới
5. Copy và paste vào file `.env.local`

## 3. Cài đặt dependencies (nếu cần)

```bash
npm install
```

## 4. Khởi động ứng dụng

```bash
npm run dev
```

## 5. Sử dụng

AIChat component sẽ tự động sử dụng ChatGPT API khi có API key được cấu hình.

## Lưu ý

- API key cần có credit trong tài khoản OpenAI
- Mỗi request sẽ tốn một ít credit
- Có thể giới hạn số lượng request trong code nếu cần

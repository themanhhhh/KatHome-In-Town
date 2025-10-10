# Hướng dẫn sử dụng AIChat với ChatGPT

## 🚀 Tính năng mới

AIChat component giờ đã được tích hợp ChatGPT API, cho phép:
- Trò chuyện thông minh với AI
- Toggle giữa ChatGPT và Local responses
- Fallback tự động khi API lỗi
- Context conversation (nhớ 10 tin nhắn gần nhất)

## 🔧 Cách sử dụng

### 1. Cấu hình API Key

Tạo file `.env.local` trong thư mục `client/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Toggle AI Mode

- **ChatGPT Mode**: Sử dụng OpenAI API (cần API key)
- **Local Mode**: Sử dụng responses có sẵn (không cần API key)

### 3. Giao diện

- **Header**: Hiển thị "ChatGPT" badge khi đang dùng OpenAI
- **Toggle Button**: Chuyển đổi giữa ChatGPT và Local
- **Status**: "Powered by OpenAI" khi dùng ChatGPT

## 💡 Tính năng

### ChatGPT Mode
- ✅ Trả lời thông minh và tự nhiên
- ✅ Hiểu context cuộc trò chuyện
- ✅ Hỗ trợ đa ngôn ngữ
- ✅ Kiến thức rộng về booking và hospitality

### Local Mode
- ✅ Hoạt động offline
- ✅ Responses nhanh
- ✅ Không tốn chi phí
- ✅ Responses được tối ưu cho KatHome In Town

### Fallback System
- ✅ Tự động chuyển về Local khi API lỗi
- ✅ Thông báo lỗi rõ ràng
- ✅ Không làm gián đoạn cuộc trò chuyện

## 🎯 Use Cases

### Cho khách hàng:
- Tìm hiểu về phòng và dịch vụ
- Hướng dẫn đặt phòng
- Hỏi về giá cả và chính sách
- Hỗ trợ 24/7

### Cho admin:
- Hỗ trợ khách hàng qua chat
- Trả lời câu hỏi thường gặp
- Tăng trải nghiệm người dùng

## 🔒 Bảo mật

- API key được lưu trong environment variables
- Không lưu trữ conversation history
- Chỉ gửi 10 tin nhắn gần nhất cho context
- Fallback an toàn khi API lỗi

## 💰 Chi phí

- **ChatGPT**: ~$0.002 per 1K tokens (rất rẻ)
- **Local**: Miễn phí
- **Fallback**: Tự động chuyển về Local khi cần

## 🛠️ Troubleshooting

### Lỗi "OpenAI API key not configured"
- Kiểm tra file `.env.local`
- Đảm bảo API key hợp lệ
- Restart server sau khi thêm API key

### Lỗi "Failed to get AI response"
- Kiểm tra kết nối internet
- Kiểm tra API key có credit
- Component sẽ tự động fallback về Local

### ChatGPT không hoạt động
- Toggle về Local mode
- Kiểm tra console để xem lỗi
- Đảm bảo API key có quyền truy cập GPT-3.5-turbo

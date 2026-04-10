# 🤖 Hướng dẫn tích hợp Gemini AI cho Chatbot

## ✅ Đã cài đặt thư viện

Thư viện `@google/generative-ai` đã được cài đặt sẵn!

```bash
✓ @google/generative-ai installed
```

## Bước 1: Lấy API Key miễn phí

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click "Create API Key"
4. Chọn project hoặc tạo project mới
5. Copy API key (dạng: `AIzaSy...`)

## Bước 2: Cấu hình API Key

Mở file: `FrontEnd/src/services/geminiService.js`

Tìm dòng:
```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
```

Thay bằng API key của bạn:
```javascript
const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
```

## Bước 3: Test Chatbot

1. Refresh trang web
2. Click vào icon chatbot ở góc phải
3. Gõ câu hỏi: "Tư vấn iPhone cho tôi"
4. AI sẽ trả lời thông minh dựa trên sản phẩm thực tế

## Tính năng AI Chatbot

✅ **Tư vấn sản phẩm thông minh**
- AI hiểu ngữ cảnh và lịch sử hội thoại
- Gợi ý sản phẩm phù hợp với nhu cầu
- Trả lời dựa trên danh sách sản phẩm thực tế

✅ **Hỗ trợ đa dạng**
- Tư vấn mua hàng
- So sánh sản phẩm
- Giải đáp chính sách
- Hướng dẫn thanh toán

✅ **Toggle AI Mode**
- Click icon 🤖/💬 ở header để bật/tắt AI
- Chế độ AI: Sử dụng Gemini AI (thông minh)
- Chế độ thường: Sử dụng câu trả lời có sẵn (nhanh)

## Giới hạn miễn phí

- **60 requests/phút**
- **1500 requests/ngày**
- Đủ cho demo và testing

## Nâng cấp (nếu cần)

Nếu cần nhiều request hơn:
1. Truy cập: https://console.cloud.google.com/
2. Enable billing (có thể dùng $300 credit miễn phí)
3. Tăng quota lên 1000 requests/phút

## Bảo mật

⚠️ **QUAN TRỌNG**: 
- Không commit API key lên Git
- Trong production, nên để API key ở backend
- Sử dụng environment variables

## Troubleshooting

**Lỗi: "Gemini API error"**
- Kiểm tra API key đã đúng chưa
- Kiểm tra đã enable Gemini API chưa
- Kiểm tra quota còn không

**AI trả lời chậm**
- Bình thường, AI cần 2-5 giây để xử lý
- Có typing indicator để user biết đang chờ

**AI trả lời không chính xác**
- Điều chỉnh system prompt trong geminiService.js
- Thêm nhiều thông tin sản phẩm vào context

## Demo câu hỏi

Thử hỏi AI:
- "Tư vấn iPhone cho sinh viên giá dưới 15 triệu"
- "So sánh iPhone 15 và Samsung S24"
- "Laptop nào tốt cho lập trình viên?"
- "Tai nghe không dây giá rẻ"

Chúc bạn thành công! 🎉

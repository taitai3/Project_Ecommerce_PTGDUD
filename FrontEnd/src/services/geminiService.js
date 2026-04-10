// Gemini AI Service for Chatbot using Official SDK
// Get your free API key at: https://makersuite.google.com/app/apikey

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyDcEWo2j7i47VrVvh7be5Hd7WrxOIPUpAg'; // Thay bằng API key của bạn

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chat = null;
    this.initializeAI();
  }

  initializeAI() {
    try {
      if (GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      }
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  async startChat(productContext = null) {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please add your API key.');
    }

    // Build system context
    let systemContext = `Bạn là trợ lý ảo thông minh của CellPhones - cửa hàng điện thoại và công nghệ hàng đầu Việt Nam.

NHIỆM VỤ:
- Tư vấn sản phẩm điện thoại, laptop, tablet, phụ kiện
- Giải đáp thắc mắc về giá cả, khuyến mãi
- Hướng dẫn mua hàng, thanh toán, giao hàng
- Hỗ trợ chính sách bảo hành, đổi trả

PHONG CÁCH:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời ngắn gọn, súc tích (2-3 câu)
- Sử dụng emoji phù hợp
- Luôn gợi ý sản phẩm cụ thể khi có thể

THÔNG TIN CỬA HÀNG:
- Hotline: 1800-xxxx
- Email: support@cellphones.com
- Giao hàng: Toàn quốc, 1-3 ngày
- Thanh toán: COD, chuyển khoản, ví điện tử
- Bảo hành: 12 tháng chính hãng
- Đổi trả: 7 ngày nếu có lỗi`;

    // Add product context if available
    if (productContext) {
      systemContext += `\n\nSẢN PHẨM HIỆN CÓ:\n${productContext}`;
    }

    // Start chat session
    this.chat = this.model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
      history: [
        {
          role: "user",
          parts: [{ text: systemContext }],
        },
        {
          role: "model",
          parts: [{ text: "Xin chào! Tôi là trợ lý ảo của CellPhones. Tôi sẵn sàng tư vấn sản phẩm và hỗ trợ bạn! 😊" }],
        },
      ],
    });
  }

  async sendMessage(userMessage, productContext = null) {
    try {
      // Initialize chat if not started
      if (!this.chat) {
        await this.startChat(productContext);
      }

      // Send message and get response
      const result = await this.chat.sendMessage(userMessage);
      const response = result.response;
      const text = response.text();

      return text;

    } catch (error) {
      console.error('Gemini AI Error:', error);
      
      // Fallback to simple response
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('iphone')) {
      return 'Chúng tôi có nhiều dòng iPhone từ iPhone 13 đến iPhone 15 Pro Max với giá từ 10-35 triệu. Bạn quan tâm dòng nào? 📱';
    }
    if (msg.includes('laptop')) {
      return 'Laptop của chúng tôi có nhiều thương hiệu: Dell, HP, Asus, Lenovo, Macbook. Bạn cần laptop cho mục đích gì? 💻';
    }
    if (msg.includes('giá')) {
      return 'Giá sản phẩm rất cạnh tranh! Bạn có thể xem chi tiết trên từng sản phẩm. Cần tư vấn sản phẩm nào? 💰';
    }
    
    return 'Xin lỗi, tôi đang gặp sự cố kết nối AI. Bạn có thể liên hệ hotline 1800-xxxx để được hỗ trợ trực tiếp! 📞';
  }

  clearHistory() {
    this.chat = null;
  }

  isInitialized() {
    return this.model !== null;
  }
}

export default new GeminiService();

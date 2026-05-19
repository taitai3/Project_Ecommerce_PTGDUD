// Gemini AI Service for Chatbot using Official SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = 'AIzaSyDS23kRfi_nOKrZw4WgA83xLXa8bymoPXM';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chat = null;
    this.productContext = null;
    this.products = []; // Lưu raw products để fallback dùng
    this.categories = [];
    this.retryCount = 0;
    this.maxRetries = 2;
    this.isQuotaExceeded = false;
    this.initializeAI();
  }

  initializeAI() {
    try {
      if (GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });
        console.log('✅ Gemini AI initialized with gemini-2.0-flash');
      }
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  setProductData(products, categories) {
    this.products = products || [];
    this.categories = categories || [];
    
    // Tạo context text cho AI
    if (this.products.length > 0) {
      const productLines = this.products.map(p => {
        const price = new Intl.NumberFormat('vi-VN').format(p.price);
        const category = p.categoryName || 'Khác';
        const stock = p.stock > 0 ? `Còn hàng` : 'Hết hàng';
        return `• ${p.name} | Hãng: ${p.brand || 'N/A'} | Giá: ${price}đ | Danh mục: ${category} | ${stock}`;
      }).join('\n');

      const categoryList = this.categories.map(c => `- ${c.name}`).join('\n');
      this.productContext = `Tổng: ${this.products.length} sản phẩm\n\nDANH MỤC:\n${categoryList}\n\nCHI TIẾT:\n${productLines}`;
    }
    
    // Reset chat khi context thay đổi
    this.chat = null;
  }

  async startChat() {
    if (!this.model) {
      throw new Error('Gemini AI not initialized');
    }

    const systemContext = `Bạn là trợ lý bán hàng AI của cửa hàng điện tử CellPhones. Bạn PHẢI trả lời dựa trên dữ liệu sản phẩm thực tế được cung cấp bên dưới.

=== QUY TẮC ===
1. Khi khách hỏi sản phẩm, TÌM trong danh sách và trả lời chính xác tên + giá.
2. Nếu không có → nói "Hiện shop chưa có sản phẩm này".
3. Khi khách nói giá → lọc sản phẩm theo khoảng giá và gợi ý.
4. Trả lời tiếng Việt, ngắn gọn (2-4 câu), có emoji.
5. Nếu khách muốn mua → hướng dẫn thêm vào giỏ hàng trên website.

=== THÔNG TIN SHOP ===
- Giao hàng: Toàn quốc 1-3 ngày, miễn phí ship đơn từ 500k
- Thanh toán: COD, chuyển khoản, Momo, ZaloPay, thẻ tín dụng
- Bảo hành: 12 tháng chính hãng
- Đổi trả: 7 ngày nếu lỗi

=== SẢN PHẨM ===
${this.productContext || 'Chưa có dữ liệu.'}
=== HẾT ===`;

    this.chat = this.model.startChat({
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 400,
      },
      history: [
        { role: "user", parts: [{ text: systemContext }] },
        { role: "model", parts: [{ text: "Đã hiểu! Tôi sẵn sàng tư vấn dựa trên sản phẩm thực tế của shop. 😊" }] },
      ],
    });
  }

  async sendMessage(userMessage) {
    // Nếu đã biết quota hết → dùng fallback luôn
    if (this.isQuotaExceeded) {
      return this.getSmartFallback(userMessage);
    }

    try {
      if (!this.chat) {
        await this.startChat();
      }

      const result = await this.chat.sendMessage(userMessage);
      const text = result.response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response');
      }

      this.retryCount = 0; // Reset retry on success
      return text;

    } catch (error) {
      console.error('Gemini AI Error:', error.message);

      // Nếu bị rate limit (429)
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        this.isQuotaExceeded = true;
        console.warn('⚠️ Gemini quota exceeded, switching to smart fallback mode');
        return this.getSmartFallback(userMessage);
      }

      // Nếu bị safety block
      if (error.message?.includes('blocked') || error.message?.includes('SAFETY')) {
        return 'Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể hỏi về sản phẩm của shop không? 😊';
      }

      // Lỗi khác → fallback
      this.chat = null;
      return this.getSmartFallback(userMessage);
    }
  }

  // Fallback thông minh - tìm kiếm trong dữ liệu sản phẩm thực tế
  getSmartFallback(message) {
    const msg = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const msgOriginal = message.toLowerCase();

    // 1. Tìm sản phẩm theo tên/keyword
    const matchedProducts = this.findProducts(msgOriginal);
    
    // 2. Tìm theo khoảng giá
    const priceRange = this.extractPrice(msgOriginal);
    
    // 3. Tìm theo danh mục
    const matchedCategory = this.findCategory(msgOriginal);

    // --- Xử lý intent ---

    // Greeting
    if (msg.match(/xin chao|hello|hi |hey|chao ban/)) {
      return 'Xin chào! 👋 Tôi là trợ lý của CellPhones. Bạn cần tìm sản phẩm gì hôm nay?';
    }

    // Cảm ơn
    if (msg.match(/cam on|thanks|thank/)) {
      return 'Rất vui được hỗ trợ bạn! Nếu cần thêm gì, cứ hỏi nhé! 😊';
    }

    // Giao hàng
    if (msg.match(/giao hang|ship|van chuyen|delivery/)) {
      return '🚚 Giao hàng toàn quốc 1-3 ngày!\n- Nội thành: 1-2 ngày\n- Miễn phí ship đơn từ 500k\n- Hỗ trợ COD (thanh toán khi nhận)';
    }

    // Thanh toán
    if (msg.match(/thanh toan|tra tien|payment/)) {
      return '💳 Hình thức thanh toán:\n- COD (nhận hàng trả tiền)\n- Chuyển khoản ngân hàng\n- Ví Momo, ZaloPay\n- Thẻ tín dụng/ghi nợ';
    }

    // Bảo hành
    if (msg.match(/bao hanh|doi tra|warranty/)) {
      return '🛡️ Chính sách bảo hành:\n- 12 tháng chính hãng\n- Đổi trả 7 ngày nếu lỗi từ NSX\n- Hỗ trợ kỹ thuật miễn phí';
    }

    // Khuyến mãi
    if (msg.match(/khuyen mai|giam gia|sale|promotion/)) {
      return '🎁 Bạn có thể xem khuyến mãi mới nhất trên trang Shop! Nhiều sản phẩm đang được giảm giá hấp dẫn.';
    }

    // Nếu tìm được sản phẩm cụ thể
    if (matchedProducts.length > 0) {
      if (matchedProducts.length === 1) {
        const p = matchedProducts[0];
        const price = new Intl.NumberFormat('vi-VN').format(p.price);
        const stock = p.stock > 0 ? '✅ Còn hàng' : '❌ Hết hàng';
        return `📱 **${p.name}**\n- Giá: ${price}đ\n- Hãng: ${p.brand}\n- ${stock}\n\nBạn có thể thêm vào giỏ hàng trên trang Shop!`;
      } else {
        const list = matchedProducts.slice(0, 5).map(p => {
          const price = new Intl.NumberFormat('vi-VN').format(p.price);
          return `• ${p.name} - ${price}đ`;
        }).join('\n');
        return `Tôi tìm thấy ${matchedProducts.length} sản phẩm phù hợp:\n${list}\n\nBạn quan tâm sản phẩm nào?`;
      }
    }

    // Nếu có khoảng giá
    if (priceRange) {
      const filtered = this.products.filter(p => {
        if (priceRange.max && priceRange.min) {
          return p.price >= priceRange.min && p.price <= priceRange.max;
        }
        if (priceRange.max) return p.price <= priceRange.max;
        if (priceRange.min) return p.price >= priceRange.min;
        return false;
      });

      if (filtered.length > 0) {
        const list = filtered.slice(0, 5).map(p => {
          const price = new Intl.NumberFormat('vi-VN').format(p.price);
          return `• ${p.name} - ${price}đ`;
        }).join('\n');
        const rangeText = priceRange.max 
          ? `dưới ${new Intl.NumberFormat('vi-VN').format(priceRange.max)}đ`
          : `từ ${new Intl.NumberFormat('vi-VN').format(priceRange.min)}đ`;
        return `💰 Sản phẩm ${rangeText}:\n${list}\n\nBạn muốn xem chi tiết sản phẩm nào?`;
      } else {
        return `Hiện không có sản phẩm nào trong khoảng giá này. Bạn có thể xem tất cả sản phẩm trên trang Shop! 🛒`;
      }
    }

    // Nếu match danh mục
    if (matchedCategory) {
      const catProducts = this.products.filter(p => 
        (p.categoryName || '').toLowerCase() === matchedCategory.name.toLowerCase()
      );
      if (catProducts.length > 0) {
        const list = catProducts.slice(0, 5).map(p => {
          const price = new Intl.NumberFormat('vi-VN').format(p.price);
          return `• ${p.name} - ${price}đ`;
        }).join('\n');
        return `📂 Danh mục "${matchedCategory.name}" (${catProducts.length} sản phẩm):\n${list}\n\nBạn quan tâm sản phẩm nào?`;
      }
    }

    // Muốn mua
    if (msg.match(/mua|dat hang|order|them gio/)) {
      return '🛒 Bạn có thể mua hàng trực tiếp trên trang Shop! Chọn sản phẩm → Thêm vào giỏ → Thanh toán. Bạn cần tư vấn sản phẩm nào không?';
    }

    // Default - liệt kê sản phẩm có sẵn
    if (this.products.length > 0) {
      const sample = this.products.slice(0, 4).map(p => p.name).join(', ');
      return `Tôi có thể giúp bạn tìm sản phẩm! 🔍\n\nShop hiện có ${this.products.length} sản phẩm như: ${sample}...\n\nBạn muốn tìm sản phẩm gì? (VD: "iPhone", "laptop dưới 20 triệu", "tai nghe")`;
    }

    return 'Tôi có thể giúp bạn:\n- Tìm sản phẩm (iPhone, laptop, tai nghe...)\n- Xem giá và so sánh\n- Thông tin giao hàng, bảo hành\n\nBạn cần hỗ trợ gì? 💬';
  }

  // Tìm sản phẩm theo keyword
  findProducts(message) {
    if (this.products.length === 0) return [];
    
    const msg = message.toLowerCase();
    
    return this.products.filter(p => {
      const name = (p.name || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      
      // Exact match tên sản phẩm
      if (name.includes(msg) || msg.includes(name)) return true;
      
      // Match từng từ quan trọng
      const keywords = msg.split(/\s+/).filter(w => w.length > 2);
      const matchCount = keywords.filter(kw => 
        name.includes(kw) || brand.includes(kw)
      ).length;
      
      // Nếu match >= 50% keywords → coi như match
      return keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.5);
    });
  }

  // Trích xuất giá từ message
  extractPrice(message) {
    const msg = message.toLowerCase();
    
    // "dưới X triệu" / "duoi X trieu"
    let match = msg.match(/(?:duoi|dưới|under|<)\s*(\d+)\s*(?:trieu|triệu|tr)/i);
    if (match) return { max: parseInt(match[1]) * 1000000 };

    // "trên X triệu" / "tren X trieu"  
    match = msg.match(/(?:tren|trên|trở lên|over|>)\s*(\d+)\s*(?:trieu|triệu|tr)/i);
    if (match) return { min: parseInt(match[1]) * 1000000 };

    // "từ X đến Y triệu"
    match = msg.match(/(?:tu|từ)\s*(\d+)\s*(?:den|đến|toi|tới|-)\s*(\d+)\s*(?:trieu|triệu|tr)/i);
    if (match) return { min: parseInt(match[1]) * 1000000, max: parseInt(match[2]) * 1000000 };

    // "X triệu" hoặc "gia X trieu" → khoảng ±20%
    match = msg.match(/(?:gia|giá|khoang|khoảng|tam|tầm)?\s*(\d+)\s*(?:trieu|triệu|tr)/i);
    if (match) {
      const price = parseInt(match[1]) * 1000000;
      return { min: price * 0.8, max: price * 1.2 };
    }

    return null;
  }

  // Tìm danh mục
  findCategory(message) {
    if (this.categories.length === 0) return null;
    const msg = message.toLowerCase();
    return this.categories.find(c => 
      msg.includes(c.name.toLowerCase())
    );
  }

  clearHistory() {
    this.chat = null;
    this.retryCount = 0;
  }

  isInitialized() {
    return this.model !== null;
  }

  // Reset quota flag (có thể gọi sau 1 phút)
  resetQuota() {
    this.isQuotaExceeded = false;
    this.chat = null;
  }
}

export default new GeminiService();

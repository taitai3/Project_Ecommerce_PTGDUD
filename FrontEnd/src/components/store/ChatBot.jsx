import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import geminiService from '../../services/geminiService';
import productService from '../../services/productService';

const ChatBot = () => {
  const [useAI, setUseAI] = useState(true); // Toggle AI mode
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo của CellPhones. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined responses
  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Greeting
    if (msg.includes('xin chào') || msg.includes('hello') || msg.includes('hi')) {
      return 'Xin chào! Rất vui được hỗ trợ bạn. Bạn cần tìm sản phẩm gì hôm nay?';
    }

    // Product inquiry
    if (msg.includes('iphone') || msg.includes('điện thoại')) {
      return 'Chúng tôi có nhiều dòng điện thoại như iPhone, Samsung, Xiaomi... Bạn quan tâm đến dòng máy nào và mức giá bao nhiêu?';
    }

    if (msg.includes('laptop')) {
      return 'Chúng tôi có laptop từ nhiều thương hiệu: Dell, HP, Asus, Lenovo, Macbook... Bạn cần laptop cho công việc gì? Gaming, văn phòng hay đồ họa?';
    }

    if (msg.includes('tai nghe') || msg.includes('airpod')) {
      return 'Chúng tôi có tai nghe từ Apple AirPods, Sony, JBL, Samsung... Bạn thích tai nghe có dây hay không dây?';
    }

    // Price inquiry
    if (msg.includes('giá') || msg.includes('bao nhiêu')) {
      return 'Giá sản phẩm của chúng tôi rất cạnh tranh! Bạn có thể xem giá chi tiết trên từng sản phẩm. Bạn đang quan tâm sản phẩm nào?';
    }

    // Shipping
    if (msg.includes('giao hàng') || msg.includes('ship') || msg.includes('vận chuyển')) {
      return 'Chúng tôi có dịch vụ giao hàng toàn quốc:\n- Nội thành: 1-2 ngày\n- Ngoại thành: 2-3 ngày\n- Miễn phí ship cho đơn từ 500k';
    }

    // Payment
    if (msg.includes('thanh toán') || msg.includes('trả tiền')) {
      return 'Chúng tôi hỗ trợ nhiều hình thức thanh toán:\n- COD (Thanh toán khi nhận hàng)\n- Chuyển khoản ngân hàng\n- Ví điện tử (Momo, ZaloPay)\n- Thẻ tín dụng/ghi nợ';
    }

    // Warranty
    if (msg.includes('bảo hành') || msg.includes('đổi trả')) {
      return 'Chính sách bảo hành:\n- Bảo hành chính hãng 12 tháng\n- Đổi trả trong 7 ngày nếu có lỗi\n- Hỗ trợ kỹ thuật miễn phí';
    }

    // Contact
    if (msg.includes('liên hệ') || msg.includes('hotline') || msg.includes('số điện thoại')) {
      return 'Thông tin liên hệ:\n📞 Hotline: 1800-xxxx\n📧 Email: support@cellphones.com\n🕐 Làm việc: 8h-22h hàng ngày';
    }

    // Store location
    if (msg.includes('cửa hàng') || msg.includes('địa chỉ') || msg.includes('showroom')) {
      return 'Chúng tôi có hơn 100 cửa hàng trên toàn quốc. Bạn ở khu vực nào để tôi tìm cửa hàng gần nhất?';
    }

    // Promotion
    if (msg.includes('khuyến mãi') || msg.includes('giảm giá') || msg.includes('sale')) {
      return 'Hiện tại chúng tôi đang có nhiều chương trình khuyến mãi hấp dẫn! Bạn có thể xem tại trang chủ hoặc đăng ký nhận thông báo để không bỏ lỡ.';
    }

    // Help
    if (msg.includes('giúp') || msg.includes('help') || msg.includes('hỗ trợ')) {
      return 'Tôi có thể giúp bạn:\n- Tìm kiếm sản phẩm\n- Tư vấn mua hàng\n- Thông tin giao hàng\n- Chính sách bảo hành\n- Khuyến mãi hiện tại\nBạn cần hỗ trợ gì?';
    }

    // Thank you
    if (msg.includes('cảm ơn') || msg.includes('thanks') || msg.includes('cám ơn')) {
      return 'Rất vui được hỗ trợ bạn! Nếu cần thêm thông tin, đừng ngại hỏi nhé! 😊';
    }

    // Goodbye
    if (msg.includes('tạm biệt') || msg.includes('bye') || msg.includes('chào')) {
      return 'Tạm biệt! Chúc bạn mua sắm vui vẻ! Hẹn gặp lại! 👋';
    }

    // Default response
    return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi tôi về:\n- Sản phẩm (iPhone, laptop, tai nghe...)\n- Giá cả và khuyến mãi\n- Giao hàng và thanh toán\n- Bảo hành và đổi trả\n- Địa chỉ cửa hàng';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = inputMessage;
    setInputMessage('');

    // Show typing indicator
    setIsTyping(true);

    try {
      let botResponse;

      if (useAI) {
        // Get product context for AI
        const products = await productService.getAllProducts(0, 20);
        const productContext = products.content?.slice(0, 10).map(p => 
          `- ${p.name} (${p.brand}): ${new Intl.NumberFormat('vi-VN').format(p.price)}đ - ${p.categoryName}`
        ).join('\n') || '';

        // Get AI response
        botResponse = await geminiService.sendMessage(currentMessage, productContext);
      } else {
        // Use predefined responses
        botResponse = getResponse(currentMessage);
      }

      const botMsg = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau! 😔',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick reply buttons
  const quickReplies = [
    'Tìm iPhone',
    'Tìm laptop',
    'Chính sách giao hàng',
    'Khuyến mãi'
  ];

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Cần hỗ trợ?
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {useAI ? <Sparkles className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Trợ lý ảo
                  {useAI && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>}
                </h3>
                <p className="text-xs text-white/80">
                  {useAI ? 'Powered by Gemini AI' : 'Luôn sẵn sàng hỗ trợ'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUseAI(!useAI);
                  geminiService.clearHistory();
                }}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                title={useAI ? 'Tắt AI' : 'Bật AI'}
              >
                {useAI ? '🤖' : '💬'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-red-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-red-100' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-red-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Gợi ý câu hỏi:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-xs rounded-full transition-colors border border-gray-200 hover:border-red-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-red-400 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

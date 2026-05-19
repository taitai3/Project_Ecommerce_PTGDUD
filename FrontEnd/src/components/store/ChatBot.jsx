import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import geminiService from '../../services/geminiService';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! 👋 Tôi là trợ lý bán hàng của CellPhones. Tôi biết tất cả sản phẩm trong shop và có thể giúp bạn:\n- Tìm sản phẩm theo tên hoặc giá\n- Tư vấn mua hàng\n- Thông tin giao hàng, bảo hành\n\nHãy hỏi tôi bất cứ điều gì!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load products khi mở chatbot
  const loadProductContext = useCallback(async () => {
    if (productsLoaded) return;

    try {
      const [productsData, categories] = await Promise.all([
        productService.getAllProducts(0, 100, '', '', 'name', 'asc'),
        categoryService.getAllCategories()
      ]);

      const products = productsData.content || productsData || [];
      const cats = Array.isArray(categories) ? categories : [];

      if (products.length > 0) {
        geminiService.setProductData(products, cats);
        setProductCount(products.length);
        setProductsLoaded(true);
        console.log(`✅ Loaded ${products.length} products for chatbot`);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }, [productsLoaded]);

  useEffect(() => {
    if (isOpen && !productsLoaded) {
      loadProductContext();
    }
  }, [isOpen, productsLoaded, loadProductContext]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await geminiService.sendMessage(currentMessage);

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
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại! 😔',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    geminiService.clearHistory();
    geminiService.resetQuota(); // Thử lại AI
    setMessages([
      {
        id: Date.now(),
        text: 'Đã làm mới chat! 🔄 Tôi sẵn sàng hỗ trợ bạn. Hãy hỏi về sản phẩm nhé!',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const quickReplies = [
    'iPhone giá dưới 20 triệu?',
    'Laptop cho sinh viên',
    'Sản phẩm nào rẻ nhất?',
    'Chính sách bảo hành'
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
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat tư vấn sản phẩm
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
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  Trợ lý AI
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Smart</span>
                </h3>
                <p className="text-xs text-white/80">
                  {productsLoaded ? `${productCount} sản phẩm sẵn sàng` : 'Đang tải dữ liệu...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                title="Làm mới chat"
              >
                <RefreshCw className="w-4 h-4" />
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
              <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
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
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về sản phẩm, giá cả..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-red-400 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';

const StoreFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">CellPhones</div>
                <div className="text-gray-400 text-xs">Điện thoại chính hãng</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Hệ thống bán lẻ điện thoại, máy tính bảng, laptop và phụ kiện chính hãng hàng đầu Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <Youtube size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Về CellPhones</h3>
            <ul className="space-y-2 text-sm">
              {['Giới thiệu', 'Tuyển dụng', 'Tin tức', 'Hệ thống cửa hàng', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-red-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-white font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              {['Chính sách bảo hành', 'Chính sách đổi trả', 'Chính sách bảo mật', 'Điều khoản sử dụng', 'Hướng dẫn mua hàng'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-red-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">1800.2097</div>
                  <div className="text-gray-400 text-xs">Miễn phí • 8:00 - 21:30</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span>support@cellphones.com.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
                <span>200+ cửa hàng toàn quốc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2025 CellPhones. Tất cả quyền được bảo lưu.</span>
          <span>Được xây dựng với ❤️ bởi nhóm phát triển</span>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;

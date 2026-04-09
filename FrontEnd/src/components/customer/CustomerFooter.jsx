import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const CustomerFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">TechStore</h3>
                <p className="text-xs text-gray-400">Công nghệ cho mọi nhà</p>
              </div>
            </div>
            <p className="text-sm mb-4">
              Cung cấp các sản phẩm công nghệ chất lượng cao với giá cả hợp lý. 
              Cam kết mang đến trải nghiệm mua sắm tốt nhất.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-400">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary-400">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-primary-400">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary-400">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-primary-400">
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-primary-400">
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-primary-400">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-primary-400">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="hover:text-primary-400">
                  Chính sách bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>1900-xxxx (8:00 - 22:00)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>support@techstore.com</span>
              </li>
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-2">Đăng ký nhận tin</h5>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 text-sm"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p className="text-gray-400">
              © 2024 TechStore. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-400 hover:text-primary-400">
                Điều khoản sử dụng
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400">
                Chính sách bảo mật
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-primary-400">
                Sơ đồ trang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;

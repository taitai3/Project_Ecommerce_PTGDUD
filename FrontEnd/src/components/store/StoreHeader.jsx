import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, Phone, MapPin, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const StoreHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-600 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={11} /> Hotline: 1800.2097</span>
            <span className="flex items-center gap-1"><MapPin size={11} /> Hệ thống cửa hàng</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Tra cứu đơn hàng</span>
            <span>Tin tức công nghệ</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-red-600 font-bold text-lg leading-none">CellPhones</div>
                <div className="text-gray-500 text-xs">Điện thoại chính hãng</div>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bạn tìm kiếm sản phẩm gì?"
                className="w-full pl-4 pr-12 py-2.5 border-2 border-red-500 rounded-full text-sm focus:outline-none focus:border-red-600 bg-gray-50"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 hidden sm:block">Giỏ hàng</span>
            </Link>

            {/* User */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-red-600" />
                  </div>
                  <span className="text-xs text-gray-600 hidden sm:block max-w-[80px] truncate">{user.username}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package size={16} /> Đơn hàng của tôi
                    </Link>
                    <Link
                      to="/account/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings size={16} /> Tài khoản
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        <Settings size={16} /> Quản trị
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/store-login"
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User size={22} className="text-gray-700" />
                <span className="text-xs text-gray-600 hidden sm:block">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            {[
              { label: 'Điện thoại', path: '/shop?category=dien-thoai' },
              { label: 'Laptop', path: '/shop?category=laptop' },
              { label: 'Tablet', path: '/shop?category=tablet' },
              { label: 'Tai nghe', path: '/shop?category=tai-nghe' },
              { label: 'Đồng hồ thông minh', path: '/shop?category=dong-ho' },
              { label: 'Phụ kiện', path: '/shop?category=phu-kien' },
              { label: 'Tất cả sản phẩm', path: '/shop' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {[
              { label: 'Trang chủ', path: '/' },
              { label: 'Tất cả sản phẩm', path: '/shop' },
              { label: 'Giỏ hàng', path: '/cart' },
              { label: 'Đơn hàng của tôi', path: '/account/orders' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default StoreHeader;

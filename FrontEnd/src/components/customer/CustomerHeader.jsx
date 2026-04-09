import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../../utils/auth';
import categoryService from '../../services/categoryService';

const CustomerHeader = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadCategories();
    checkLoginStatus();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data.slice(0, 6)); // Top 6 categories
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const checkLoginStatus = () => {
    const token = getToken();
    setIsLoggedIn(!!token);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span>📞 Hotline: 1900-xxxx</span>
              <span>📧 support@techstore.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/track-order" className="hover:text-primary-200">
                Tra cứu đơn hàng
              </Link>
              <span>|</span>
              <Link to="/help" className="hover:text-primary-200">
                Trợ giúp
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TechStore</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Công nghệ cho mọi nhà</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Heart className="w-6 h-6" />
              <span className="text-sm">Yêu thích</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden md:inline text-sm">Giỏ hàng</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden md:inline text-sm">Tài khoản</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/my-account"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline text-sm">Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Categories Navigation */}
      <div className="hidden md:block bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3">
            <Link
              to="/shop"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Tất cả sản phẩm
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/deals"
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              🔥 Khuyến mãi
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/shop"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Tất cả sản phẩm
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Yêu thích
            </Link>
            <Link
              to="/deals"
              className="block py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              onClick={() => setIsMenuOpen(false)}
            >
              🔥 Khuyến mãi
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;

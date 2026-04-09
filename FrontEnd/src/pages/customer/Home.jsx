import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, TrendingUp, Zap, Shield, Truck } from 'lucide-react';
import CustomerHeader from '../../components/customer/CustomerHeader';
import CustomerFooter from '../../components/customer/CustomerFooter';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Banner slides
  const slides = [
    {
      id: 1,
      title: 'Khuyến mãi lớn cuối năm',
      subtitle: 'Giảm giá lên đến 50% cho tất cả sản phẩm',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      cta: 'Mua ngay',
      link: '/shop'
    },
    {
      id: 2,
      title: 'Laptop Gaming mới nhất',
      subtitle: 'Hiệu năng vượt trội, giá cả hợp lý',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200',
      cta: 'Khám phá',
      link: '/shop?category=laptop'
    },
    {
      id: 3,
      title: 'Phụ kiện công nghệ',
      subtitle: 'Đa dạng, chất lượng, giá tốt',
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=1200',
      cta: 'Xem thêm',
      link: '/shop?category=accessories'
    }
  ];

  useEffect(() => {
    loadData();
    
    // Auto slide
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(0, 8),
        categoryService.getAllCategories()
      ]);

      if (productsRes.content) {
        setFeaturedProducts(productsRes.content);
      }
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CustomerHeader cartItemCount={0} />

      {/* Hero Banner Slider */}
      <section className="relative h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl text-white">
                <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl mb-8">{slide.subtitle}</p>
                <Link
                  to={slide.link}
                  className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-50 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Truck className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Miễn phí vận chuyển</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Đơn hàng từ 500k</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Bảo hành chính hãng</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">12-24 tháng</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Giao hàng nhanh</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trong 24h</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Giá tốt nhất</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cam kết hoàn tiền</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Danh mục sản phẩm</h2>
            <Link to="/shop" className="text-primary-600 dark:text-primary-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sản phẩm nổi bật</h2>
            <Link to="/shop" className="text-primary-600 dark:text-primary-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-600">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.stockQuantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Hết hàng</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(0)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(product.price)}
                      </span>
                      <button className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Đăng ký nhận ưu đãi đặc biệt</h2>
            <p className="text-xl mb-8">Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên</p>
            <form className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-6 py-3 rounded-l-lg focus:outline-none text-gray-900"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-r-lg hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </section>

      <CustomerFooter />
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Shield, Truck, RotateCcw, ChevronLeft } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import ProductCard from '../../components/store/ProductCard';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const BANNERS = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. Mạnh mẽ hơn bao giờ hết.',
    cta: 'Mua ngay',
    bg: 'from-gray-900 to-gray-700',
    accent: 'text-blue-400',
    img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24',
    subtitle: 'AI Phone. Trải nghiệm thông minh mới.',
    cta: 'Khám phá',
    bg: 'from-blue-900 to-blue-700',
    accent: 'text-yellow-400',
    img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
  },
  {
    id: 3,
    title: 'MacBook Pro M3',
    subtitle: 'Hiệu năng đỉnh cao. Thiết kế hoàn hảo.',
    cta: 'Tìm hiểu thêm',
    bg: 'from-slate-800 to-slate-600',
    accent: 'text-green-400',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  },
];

const CATEGORY_ICONS = [
  { name: 'Điện thoại', icon: '📱', path: '/shop?search=điện thoại', color: 'bg-blue-50 text-blue-600' },
  { name: 'Laptop', icon: '💻', path: '/shop?search=laptop', color: 'bg-purple-50 text-purple-600' },
  { name: 'Tablet', icon: '📟', path: '/shop?search=tablet', color: 'bg-green-50 text-green-600' },
  { name: 'Tai nghe', icon: '🎧', path: '/shop?search=tai nghe', color: 'bg-orange-50 text-orange-600' },
  { name: 'Đồng hồ', icon: '⌚', path: '/shop?search=đồng hồ', color: 'bg-red-50 text-red-600' },
  { name: 'Phụ kiện', icon: '🔌', path: '/shop?search=phụ kiện', color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Loa', icon: '🔊', path: '/shop?search=loa', color: 'bg-pink-50 text-pink-600' },
  { name: 'Tất cả', icon: '🛍️', path: '/shop', color: 'bg-gray-50 text-gray-600' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getFeaturedProducts(12),
          categoryService.getAllCategories(),
        ]);
        setProducts(prodRes.content || prodRes || []);
        setCategories(catRes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <StoreLayout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className={`bg-gradient-to-r ${banner.bg} transition-all duration-700`}>
          <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1 text-white">
                <div className={`text-sm font-medium mb-2 ${banner.accent}`}>✦ Sản phẩm nổi bật</div>
                <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">{banner.title}</h1>
                <p className="text-gray-300 text-lg mb-6">{banner.subtitle}</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                >
                  {banner.cta} <ChevronRight size={18} />
                </Link>
              </div>
              <div className="hidden md:block flex-shrink-0 w-72 h-56 rounded-2xl overflow-hidden">
                <img src={banner.img} alt={banner.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Banner dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === bannerIdx ? 'bg-white w-6' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Prev/Next */}
        <button
          onClick={() => setBannerIdx((i) => (i - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setBannerIdx((i) => (i + 1) % BANNERS.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </section>

      {/* Benefits bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={20} className="text-red-600" />, title: 'Giao hàng nhanh', desc: 'Toàn quốc 2-4h' },
              { icon: <Shield size={20} className="text-red-600" />, title: 'Hàng chính hãng', desc: '100% authentic' },
              { icon: <RotateCcw size={20} className="text-red-600" />, title: 'Đổi trả 30 ngày', desc: 'Miễn phí đổi trả' },
              { icon: <Zap size={20} className="text-red-600" />, title: 'Hỗ trợ 24/7', desc: 'Hotline 1800.2097' },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{b.title}</div>
                  <div className="text-xs text-gray-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Category shortcuts */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-800">Danh mục sản phẩm</h2>
            <Link to="/shop" className="text-red-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Xem tất cả <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORY_ICONS.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-xs text-gray-600 font-medium text-center">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Flash sale */}
        <section>
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-yellow-300 fill-yellow-300" />
                <div>
                  <h2 className="text-white font-bold text-xl">Flash Sale</h2>
                  <p className="text-red-100 text-sm">Giảm giá sốc mỗi ngày</p>
                </div>
              </div>
              <Link to="/shop" className="bg-white text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-50 transition-colors">
                Xem tất cả
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.slice(0, 6).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Featured products */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
              <p className="text-gray-500 text-sm">Được yêu thích nhất tháng này</p>
            </div>
            <Link to="/shop" className="text-red-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Xem tất cả <ChevronRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Promo banners */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Trả góp 0%', desc: '12 tháng không lãi suất', bg: 'from-blue-600 to-blue-800', icon: '💳' },
            { title: 'Thu cũ đổi mới', desc: 'Giá thu hấp dẫn nhất', bg: 'from-green-600 to-green-800', icon: '♻️' },
            { title: 'Bảo hành mở rộng', desc: 'Lên đến 24 tháng', bg: 'from-purple-600 to-purple-800', icon: '🛡️' },
          ].map((promo) => (
            <div key={promo.title} className={`bg-gradient-to-br ${promo.bg} rounded-2xl p-5 text-white flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity`}>
              <span className="text-4xl">{promo.icon}</span>
              <div>
                <div className="font-bold text-lg">{promo.title}</div>
                <div className="text-white/80 text-sm">{promo.desc}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </StoreLayout>
  );
};

export default Home;

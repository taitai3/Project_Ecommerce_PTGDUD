import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import ProductCard from '../../components/store/ProductCard';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const p = await productService.getProductById(id);
        setProduct(p);
        const rel = await productService.getAllProducts(0, 6, '', p.categoryId || '');
        setRelated((rel.content || rel || []).filter((r) => r.id !== p.id).slice(0, 4));
      } catch {
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo({ top: 0 });
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/store-login'); return; }
    setAdding(true);
    const ok = await addToCart(product.id, quantity);
    setAdding(false);
    if (ok) { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate('/store-login'); return; }
    await addToCart(product.id, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-red-600">Trang chủ</Link>
          <ChevronRight size={13} />
          <Link to="/shop" className="hover:text-red-600">Sản phẩm</Link>
          {product.categoryName && (
            <><ChevronRight size={13} /><span className="hover:text-red-600 cursor-pointer">{product.categoryName}</span></>
          )}
          <ChevronRight size={13} />
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 aspect-square flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-gray-200 text-8xl">📦</div>
              )}
              {discount && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              <button
                onClick={() => setWished(!wished)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart size={18} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-red-600 font-medium mb-1">{product.categoryName || 'Sản phẩm'}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.8 (256 đánh giá)</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-green-600 font-medium">
                {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* Price */}
            <div className="bg-red-50 rounded-2xl p-4 mb-5">
              <div className="text-3xl font-bold text-red-600 mb-1">{formatPrice(product.price)}</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Tiết kiệm {formatPrice(product.originalPrice - product.price)}</span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stockQuantity === 0}
                className={`flex-1 border-2 py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2
                  ${added ? 'border-green-500 text-green-600 bg-green-50' : 'border-red-600 text-red-600 hover:bg-red-50'}
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {adding ? (
                  <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : added ? (
                  <><Check size={18} /> Đã thêm</>
                ) : (
                  <><ShoppingCart size={18} /> Thêm vào giỏ</>
                )}
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Shield size={16} className="text-blue-600" />, text: 'Hàng chính hãng' },
                { icon: <Truck size={16} className="text-green-600" />, text: 'Giao hàng nhanh' },
                { icon: <RotateCcw size={16} className="text-orange-600" />, text: 'Đổi trả 30 ngày' },
              ].map((b) => (
                <div key={b.text} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-xl text-center">
                  {b.icon}
                  <span className="text-xs text-gray-600">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex border-b border-gray-100">
            {[
              { key: 'desc', label: 'Mô tả sản phẩm' },
              { key: 'specs', label: 'Thông số kỹ thuật' },
              { key: 'reviews', label: 'Đánh giá (256)' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'desc' && (
              <div className="prose prose-sm max-w-none text-gray-700">
                {product.description ? (
                  <p className="leading-relaxed">{product.description}</p>
                ) : (
                  <p className="text-gray-400 italic">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Tên sản phẩm', value: product.name },
                  { label: 'Danh mục', value: product.categoryName || 'N/A' },
                  { label: 'Giá bán', value: formatPrice(product.price) },
                  { label: 'Tồn kho', value: `${product.stockQuantity || 0} sản phẩm` },
                ].map((spec) => (
                  <div key={spec.label} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-8 text-gray-400">
                <Star size={40} className="mx-auto mb-3 text-gray-200" />
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-5">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;

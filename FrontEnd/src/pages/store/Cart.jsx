import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Cart = () => {
  const { cart, loading, updateCartItem, removeCartItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingCart size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">Đăng nhập để xem giỏ hàng của bạn</p>
          <Link to="/store-login" className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
            Đăng nhập ngay
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart size={24} className="text-red-600" />
          Giỏ hàng của bạn
          {items.length > 0 && <span className="text-base font-normal text-gray-500">({items.length} sản phẩm)</span>}
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h3>
            <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const price = item.price || item.product?.price || 0;
                const name = item.productName || item.product?.name || 'Sản phẩm';
                const image = item.productImage || item.product?.imageUrl;
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                    <Link to={`/product/${item.productId || item.product?.id}`} className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden">
                        {image ? (
                          <img src={image} alt={name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.productId || item.product?.id}`}>
                        <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-red-600 transition-colors mb-1">
                          {name}
                        </h3>
                      </Link>
                      <div className="text-red-600 font-bold mb-2">{formatPrice(price)}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => item.quantity > 1 ? updateCartItem(item.id, item.quantity - 1) : removeCartItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-800">{formatPrice(price * item.quantity)}</span>
                          <button
                            onClick={() => removeCartItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Tóm tắt đơn hàng</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính ({items.length} sản phẩm)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển</p>
                  )}
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Tổng cộng</span>
                    <span className="text-red-600 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  Tiến hành đặt hàng <ArrowRight size={18} />
                </button>

                <Link
                  to="/shop"
                  className="block text-center text-sm text-gray-500 hover:text-red-600 mt-3 transition-colors"
                >
                  ← Tiếp tục mua sắm
                </Link>

                {/* Trust badges */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  {['🔒 Bảo mật', '✅ Chính hãng', '🚚 Nhanh chóng'].map((b) => (
                    <div key={b} className="text-xs text-gray-500">{b}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default Cart;

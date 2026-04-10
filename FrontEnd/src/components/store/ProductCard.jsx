import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/store-login';
      return;
    }
    setAdding(true);
    await addToCart(product.id, 1);
    setAdding(false);
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart size={48} />
            </div>
          )}
          {discount && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart size={15} className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <p className="text-xs text-gray-400 mb-1">{product.categoryName || 'Sản phẩm'}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-1 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11} className={s <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
            ))}
            <span className="text-xs text-gray-400 ml-1">(128)</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="text-red-600 font-bold text-base">{formatPrice(product.price)}</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            className={`w-full py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
              ${product.stockQuantity === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
              }`}
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={15} />
            )}
            {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

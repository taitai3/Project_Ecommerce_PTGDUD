import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import ProductCard from '../../components/store/ProductCard';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'name-asc', label: 'Tên A-Z' },
];

const PRICE_RANGES = [
  { label: 'Tất cả', min: 0, max: 0 },
  { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
  { label: '2 - 5 triệu', min: 2000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: 'Trên 20 triệu', min: 20000000, max: 0 },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const priceMin = searchParams.get('priceMin') || '';
  const priceMax = searchParams.get('priceMax') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const sort = searchParams.get('sort') || 'createdAt-desc';
  const [sortBy, sortDir] = sort.split('-');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAllProducts(page, 12, search, categoryId, sortBy, sortDir);
      let productList = res.content || res || [];
      
      // Filter by price range on client side
      if (priceMin || priceMax) {
        productList = productList.filter(p => {
          const price = p.price;
          const min = priceMin ? parseFloat(priceMin) : 0;
          const max = priceMax ? parseFloat(priceMax) : Infinity;
          return price >= min && (max === 0 ? true : price <= max);
        });
      }
      
      setProducts(productList);
      setTotalPages(res.totalPages || 1);
      setTotalElements(productList.length);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, sortBy, sortDir, priceMin, priceMax]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const setPriceRange = (min, max) => {
    const p = new URLSearchParams(searchParams);
    if (min > 0) p.set('priceMin', min); else p.delete('priceMin');
    if (max > 0) p.set('priceMax', max); else p.delete('priceMax');
    p.delete('page');
    setSearchParams(p);
  };

  const setPage = (pg) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', pg);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <span className="hover:text-red-600 cursor-pointer">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Tất cả sản phẩm</span>
          {search && <><span className="mx-2">/</span><span className="text-red-600">"{search}"</span></>}
        </div>

        <div className="flex gap-6">
          {/* Sidebar filter - desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> Bộ lọc
              </h3>

              {/* Categories */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Danh mục</h4>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => updateParam('categoryId', '')}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!categoryId ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Tất cả
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => updateParam('categoryId', cat.id)}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${categoryId === String(cat.id) ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Khoảng giá</h4>
                <ul className="space-y-1">
                  {PRICE_RANGES.map((r) => {
                    const isActive = (priceMin === String(r.min) || (!priceMin && r.min === 0)) && 
                                    (priceMax === String(r.max) || (!priceMax && r.max === 0));
                    return (
                      <li key={r.label}>
                        <button 
                          onClick={() => setPriceRange(r.min, r.max)}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {r.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-red-400 transition-colors"
                >
                  <SlidersHorizontal size={15} /> Bộ lọc
                </button>
                <span className="text-sm text-gray-500">
                  {loading ? '...' : `${totalElements} sản phẩm`}
                </span>
                {search && (
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                    "{search}"
                    <button onClick={() => updateParam('search', '')}><X size={12} /></button>
                  </span>
                )}
                {(priceMin || priceMax) && (
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                    {PRICE_RANGES.find(r => String(r.min) === priceMin && String(r.max) === priceMax)?.label || 'Giá tùy chỉnh'}
                    <button onClick={() => setPriceRange(0, 0)}><X size={12} /></button>
                  </span>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-400 bg-white cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Mobile filter */}
            {showFilter && (
              <div className="lg:hidden bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Danh mục</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => { updateParam('categoryId', ''); setShowFilter(false); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!categoryId ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateParam('categoryId', cat.id); setShowFilter(false); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryId === String(cat.id) ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Khoảng giá</h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((r) => {
                    const isActive = (priceMin === String(r.min) || (!priceMin && r.min === 0)) && 
                                    (priceMax === String(r.max) || (!priceMax && r.max === 0));
                    return (
                      <button
                        key={r.label}
                        onClick={() => { setPriceRange(r.min, r.max); setShowFilter(false); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isActive ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
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
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const pg = totalPages <= 7 ? i : (page < 4 ? i : page - 3 + i);
                  if (pg >= totalPages) return null;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${pg === page ? 'bg-red-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600'}`}
                    >
                      {pg + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-red-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Shop;

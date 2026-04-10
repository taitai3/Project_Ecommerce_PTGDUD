import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck, RotateCcw } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={14} /> },
  PROCESSING: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-700', icon: <RotateCcw size={14} /> },
  SHIPPING: { label: 'Đang giao hàng', color: 'bg-orange-100 text-orange-700', icon: <Truck size={14} /> },
  DELIVERED: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> },
};

const TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'DELIVERED', label: 'Đã giao' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/store-login'); return; }
    fetchOrders();
  }, [isAuthenticated, activeTab, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get mock orders from localStorage
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      
      // Filter by status if needed
      let filteredOrders = mockOrders;
      if (activeTab) {
        filteredOrders = mockOrders.filter(order => order.status === activeTab);
      }
      
      // Pagination
      const startIndex = page * 10;
      const endIndex = startIndex + 10;
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      setOrders(paginatedOrders);
      setTotalPages(Math.ceil(filteredOrders.length / 10));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      // Update order status in localStorage
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const updatedOrders = mockOrders.map(order => 
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      );
      localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
      fetchOrders();
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Không thể hủy đơn hàng này.');
    }
  };

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package size={24} className="text-red-600" /> Đơn hàng của tôi
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(0); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.key ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-400 mb-6">Hãy mua sắm và đặt hàng ngay!</p>
            <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Order header */}
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">#{order.orderNumber || order.id}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                  </div>

                  {/* Order items */}
                  <div className="px-5 py-4">
                    {(order.items || order.orderItems || []).slice(0, 2).map((item) => (
                      <div key={item.id} className="flex gap-3 mb-3 last:mb-0">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                          {item.productImage ? (
                            <img src={item.productImage} alt="" className="w-full h-full object-contain p-1" />
                          ) : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    {(order.items || order.orderItems || []).length > 2 && (
                      <p className="text-xs text-gray-400 mt-1">+{(order.items || order.orderItems).length - 2} sản phẩm khác</p>
                    )}
                  </div>

                  {/* Order footer */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-500">Tổng tiền: </span>
                      <span className="text-base font-bold text-red-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-xl hover:bg-red-50 transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition-colors"
                      >
                        Chi tiết <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40">Trước</button>
            <span className="px-4 py-2 text-sm text-gray-600">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40">Sau</button>
          </div>
        )}
      </div>
    </StoreLayout>
  );
};

export default MyOrders;

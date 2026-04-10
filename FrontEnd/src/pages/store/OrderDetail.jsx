import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Truck, RotateCcw } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const STATUS_CONFIG = {
  PENDING: { 
    label: 'Chờ xác nhận', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
    icon: <Clock size={20} />,
    desc: 'Đơn hàng đang chờ được xác nhận'
  },
  CONFIRMED: { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-100 text-blue-700 border-blue-200', 
    icon: <CheckCircle size={20} />,
    desc: 'Đơn hàng đã được xác nhận và đang chuẩn bị'
  },
  PROCESSING: { 
    label: 'Đang xử lý', 
    color: 'bg-purple-100 text-purple-700 border-purple-200', 
    icon: <RotateCcw size={20} />,
    desc: 'Đơn hàng đang được xử lý và đóng gói'
  },
  SHIPPING: { 
    label: 'Đang giao hàng', 
    color: 'bg-orange-100 text-orange-700 border-orange-200', 
    icon: <Truck size={20} />,
    desc: 'Đơn hàng đang trên đường giao đến bạn'
  },
  DELIVERED: { 
    label: 'Đã giao hàng', 
    color: 'bg-green-100 text-green-700 border-green-200', 
    icon: <CheckCircle size={20} />,
    desc: 'Đơn hàng đã được giao thành công'
  },
  CANCELLED: { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-700 border-red-200', 
    icon: <XCircle size={20} />,
    desc: 'Đơn hàng đã bị hủy'
  },
};

const PAYMENT_METHODS = {
  COD: { label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  BANK_TRANSFER: { label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  MOMO: { label: 'Ví MoMo', icon: '💜' },
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/store-login');
      return;
    }
    fetchOrderDetail();
  }, [orderId, isAuthenticated]);

  const fetchOrderDetail = () => {
    setLoading(true);
    try {
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const foundOrder = mockOrders.find(o => o.id === parseInt(orderId));
      setOrder(foundOrder || null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      const updatedOrders = mockOrders.map(o => 
        o.id === order.id ? { ...o, status: 'CANCELLED' } : o
      );
      localStorage.setItem('mockOrders', JSON.stringify(updatedOrders));
      fetchOrderDetail();
    } catch (err) {
      alert('Không thể hủy đơn hàng này.');
    }
  };

  if (loading) {
    return (
      <StoreLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded" />
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!order) {
    return (
      <StoreLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Package size={64} className="text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy đơn hàng</h3>
          <Link to="/account/orders" className="text-red-600 hover:underline">
            ← Quay lại danh sách đơn hàng
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const paymentMethod = PAYMENT_METHODS[order.paymentMethod] || PAYMENT_METHODS.COD;
  const canCancel = order.status === 'PENDING';

  return (
    <StoreLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          to="/account/orders" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Quay lại danh sách đơn hàng
        </Link>

        {/* Order header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Đơn hàng #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-500">
                Đặt ngày {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${status.color}`}>
              {status.icon}
              <span className="font-semibold">{status.label}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{status.desc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={18} className="text-red-600" /> Sản phẩm ({order.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <img src={item.productImage} alt="" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-800 mb-1">{item.productName}</h3>
                      <p className="text-sm text-gray-500">Số lượng: x{item.quantity}</p>
                      <p className="text-sm font-semibold text-red-600 mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-red-600" /> Thông tin giao hàng
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-gray-500 w-32">Người nhận:</span>
                  <span className="text-gray-800 font-medium">{order.recipientName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Số điện thoại:</span>
                  <span className="text-gray-800 font-medium">{order.phoneNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Địa chỉ:</span>
                  <span className="text-gray-800 font-medium">{order.shippingAddress}</span>
                </div>
                {order.notes && (
                  <div className="flex">
                    <span className="text-gray-500 w-32">Ghi chú:</span>
                    <span className="text-gray-800">{order.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-red-600" /> Phương thức thanh toán
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{paymentMethod.icon}</span>
                <span className="text-sm text-gray-800">{paymentMethod.label}</span>
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(order.totalAmount - (order.totalAmount > 500000 ? 0 : 30000))}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className={order.totalAmount > 500000 ? 'text-green-600 font-medium' : ''}>
                    {order.totalAmount > 500000 ? 'Miễn phí' : formatPrice(30000)}
                  </span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-gray-800">Tổng cộng</span>
                  <span className="text-red-600 text-lg">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full border-2 border-red-200 text-red-600 py-3 rounded-2xl font-semibold hover:bg-red-50 transition-colors"
                >
                  Hủy đơn hàng
                </button>
              )}

              {order.status === 'DELIVERED' && (
                <button className="w-full bg-red-600 text-white py-3 rounded-2xl font-semibold hover:bg-red-700 transition-colors">
                  Đánh giá sản phẩm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default OrderDetail;

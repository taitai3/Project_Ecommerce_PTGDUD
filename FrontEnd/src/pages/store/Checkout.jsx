import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Truck, ChevronRight, Check } from 'lucide-react';
import StoreLayout from '../../components/store/StoreLayout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const formatPrice = (price) => {
  if (!price) return '0₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Định nghĩa Field NGOÀI component để tránh re-mount mỗi lần render
const Field = ({ label, name, type = 'text', placeholder, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    note: '',
    paymentMethod: 'COD',
  });
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    navigate('/store-login');
    return null;
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ';
    if (!form.city.trim()) e.city = 'Vui lòng chọn tỉnh/thành';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Generate fake order
      const fakeOrderId = 'ORD' + Date.now().toString().slice(-8);
      const orderDate = new Date().toISOString();
      
      const newOrder = {
        id: Date.now(),
        orderNumber: fakeOrderId,
        status: 'PENDING',
        createdAt: orderDate,
        totalAmount: total,
        shippingAddress: `${form.address}, ${form.city}`,
        phoneNumber: form.phone,
        recipientName: form.fullName,
        notes: form.note,
        paymentMethod: form.paymentMethod,
        items: items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName || item.product?.name,
          productImage: item.productImage || item.product?.imageUrl,
          quantity: item.quantity,
          price: item.price || 0,
        })),
        username: user?.username || 'user',
        userEmail: user?.email || 'user@example.com',
      };
      
      // Save to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      existingOrders.unshift(newOrder); // Add to beginning
      localStorage.setItem('mockOrders', JSON.stringify(existingOrders));
      
      setOrderId(fakeOrderId);
      setSuccess(true);
      setLoading(false);
      // Clear cart after successful order
      clearCart();
    }, 1500); // 1.5 second delay to simulate processing
  };

  if (success) {
    return (
      <StoreLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-500 mb-2">Cảm ơn bạn đã mua hàng tại CellPhones</p>
          {orderId && <p className="text-sm text-gray-400 mb-6">Mã đơn hàng: <span className="font-semibold text-gray-700">#{orderId}</span></p>}
          <div className="flex gap-3 justify-center">
            <Link to="/account/orders" className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
              Xem đơn hàng
            </Link>
            <Link to="/" className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-red-400 hover:text-red-600 transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8 text-sm">
          {[
            { label: 'Giỏ hàng', done: true },
            { label: 'Thanh toán', active: true },
            { label: 'Xác nhận', done: false },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className={`flex items-center gap-2 ${step.active ? 'text-red-600 font-semibold' : step.done ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step.active ? 'bg-red-600 text-white' : step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {step.done ? <Check size={14} /> : i + 1}
                </div>
                {step.label}
              </div>
              {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Shipping info */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-red-600" /> Thông tin giao hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field 
                    label="Họ và tên" 
                    name="fullName" 
                    placeholder="Nguyễn Văn A" 
                    required 
                    value={form.fullName}
                    onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
                    error={errors.fullName}
                  />
                  <Field 
                    label="Số điện thoại" 
                    name="phone" 
                    placeholder="0901234567" 
                    required 
                    value={form.phone}
                    onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                    error={errors.phone}
                  />
                  <div className="sm:col-span-2">
                    <Field 
                      label="Địa chỉ" 
                      name="address" 
                      placeholder="Số nhà, tên đường, phường/xã" 
                      required 
                      value={form.address}
                      onChange={(e) => { setForm({ ...form, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
                      error={errors.address}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                    <select
                      value={form.city}
                      onChange={(e) => { setForm({ ...form, city: e.target.value }); setErrors({ ...errors, city: '' }); }}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    >
                      <option value="">Chọn tỉnh/thành</option>
                      {['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Bình Dương', 'Đồng Nai', 'Khác'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <input
                      type="text"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-red-600" /> Phương thức thanh toán
                </h3>
                <div className="space-y-3">
                  {[
                    { value: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵', desc: 'Trả tiền mặt khi nhận hàng' },
                    { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng', icon: '🏦', desc: 'Chuyển khoản trước khi giao hàng' },
                    { value: 'MOMO', label: 'Ví MoMo', icon: '💜', desc: 'Thanh toán qua ví điện tử MoMo' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-colors ${form.paymentMethod === method.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                        className="accent-red-600"
                      />
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{method.label}</div>
                        <div className="text-xs text-gray-500">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-red-600" /> Đơn hàng ({items.length})
                </h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productImage || item.product?.imageUrl ? (
                          <img src={item.productImage || item.product?.imageUrl} alt="" className="w-full h-full object-contain p-1" />
                        ) : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-2">{item.productName || item.product?.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-gray-800 flex-shrink-0">
                        {formatPrice((item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-100 mb-3" />
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Vận chuyển</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-gray-800 text-base">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Check size={18} /> Đặt hàng ngay</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </StoreLayout>
  );
};

export default Checkout;

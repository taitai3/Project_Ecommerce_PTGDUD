import React, { useState, useEffect } from 'react';
import { X, Package, User, MapPin, Phone, Calendar, CreditCard, Truck } from 'lucide-react';
import orderService from '../services/orderService';
import OrderStatusBadge from './OrderStatusBadge';
import Toast from './Toast';

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetails();
    }
  }, [isOpen, orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      setToast({ message: 'Lỗi khi tải chi tiết đơn hàng', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrder(response.data);
        setToast({ message: 'Cập nhật trạng thái thành công', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setToast({ message: 'Lỗi khi cập nhật trạng thái', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      setUpdating(true);
      const response = await orderService.cancelOrder(orderId);
      if (response.success) {
        setOrder(response.data);
        setToast({ message: 'Hủy đơn hàng thành công', type: 'success' });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setToast({ message: 'Lỗi khi hủy đơn hàng', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'PENDING': 'CONFIRMED',
      'CONFIRMED': 'PROCESSING',
      'PROCESSING': 'SHIPPED',
      'SHIPPED': 'DELIVERED'
    };
    return statusFlow[currentStatus];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PENDING': 'Xác nhận đơn hàng',
      'CONFIRMED': 'Bắt đầu xử lý',
      'PROCESSING': 'Giao cho vận chuyển',
      'SHIPPED': 'Đánh dấu đã giao',
      'DELIVERED': 'Hoàn thành'
    };
    return labels[status] || status;
  };

  const canCancel = order && ['PENDING', 'CONFIRMED'].includes(order.status);
  const canUpdateStatus = order && !['DELIVERED', 'CANCELLED'].includes(order.status);
  const nextStatus = order ? getNextStatus(order.status) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết đơn hàng
            </h2>
            {order && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {order.orderNumber}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : order ? (
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Tên:</span> {order.username}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {order.userEmail}
                    </p>
                    <p className="text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-medium">SĐT:</span> {order.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="font-medium">Ngày tạo:</span> {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Trạng thái:</span>
                      <span className="ml-2">
                        <OrderStatusBadge status={order.status} />
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Tổng tiền:</span>
                      <span className="ml-2 text-lg font-bold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Địa chỉ giao hàng
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.shippingAddress}
                </p>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Ghi chú
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Sản phẩm đã đặt ({order.orderItems?.length || 0} sản phẩm)
                </h3>
                
                {order.orderItems && order.orderItems.length > 0 ? (
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          {item.productImageUrl && (
                            <img
                              src={item.productImageUrl}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {item.productName}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatCurrency(item.unitPrice)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Không có sản phẩm nào
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {canUpdateStatus && nextStatus && (
                  <button
                    onClick={() => handleUpdateStatus(nextStatus)}
                    disabled={updating}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {updating ? 'Đang cập nhật...' : getStatusLabel(nextStatus)}
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={updating}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {updating ? 'Đang hủy...' : 'Hủy đơn hàng'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 dark:text-gray-400">Không tìm thấy đơn hàng</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default OrderDetailModal;
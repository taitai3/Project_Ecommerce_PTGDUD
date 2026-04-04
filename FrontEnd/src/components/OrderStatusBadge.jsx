import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Chờ xác nhận',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        };
      case 'CONFIRMED':
        return {
          label: 'Đã xác nhận',
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
        };
      case 'PROCESSING':
        return {
          label: 'Đang xử lý',
          className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
        };
      case 'SHIPPED':
        return {
          label: 'Đã giao vận',
          className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300'
        };
      case 'DELIVERED':
        return {
          label: 'Đã giao hàng',
          className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
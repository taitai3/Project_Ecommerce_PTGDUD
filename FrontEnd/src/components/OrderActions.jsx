import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Truck, CheckCircle, XCircle } from 'lucide-react';

const OrderActions = ({ order, onViewDetails, onUpdateStatus, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const canUpdateStatus = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

  const statusActions = [
    { status: 'CONFIRMED', label: 'Xác nhận', icon: CheckCircle, color: 'text-blue-600' },
    { status: 'PROCESSING', label: 'Đang xử lý', icon: Edit, color: 'text-purple-600' },
    { status: 'SHIPPED', label: 'Giao vận', icon: Truck, color: 'text-indigo-600' },
    { status: 'DELIVERED', label: 'Đã giao', icon: CheckCircle, color: 'text-green-600' },
  ];

  const handleAction = (action, status = null) => {
    setIsOpen(false);
    
    switch (action) {
      case 'view':
        onViewDetails(order.id);
        break;
      case 'updateStatus':
        onUpdateStatus(order.id, status);
        break;
      case 'cancel':
        onCancel(order.id);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="py-1">
              {/* View Details */}
              <button
                onClick={() => handleAction('view')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-3" />
                Xem chi tiết
              </button>

              {/* Status Updates */}
              {canUpdateStatus && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cập nhật trạng thái
                  </div>
                  
                  {statusActions.map(({ status, label, icon: Icon, color }) => {
                    // Only show next possible statuses
                    const canUpdate = (
                      (order.status === 'PENDING' && status === 'CONFIRMED') ||
                      (order.status === 'CONFIRMED' && status === 'PROCESSING') ||
                      (order.status === 'PROCESSING' && status === 'SHIPPED') ||
                      (order.status === 'SHIPPED' && status === 'DELIVERED')
                    );

                    if (!canUpdate) return null;

                    return (
                      <button
                        key={status}
                        onClick={() => handleAction('updateStatus', status)}
                        className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${color}`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {label}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Cancel Order */}
              {canCancel && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => handleAction('cancel')}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4 mr-3" />
                    Hủy đơn hàng
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderActions;
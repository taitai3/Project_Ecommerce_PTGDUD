import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const EditableOrderStatus = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statusConfig = {
    PENDING: {
      label: 'Chờ xác nhận',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      dotColor: 'bg-yellow-500'
    },
    CONFIRMED: {
      label: 'Đã xác nhận',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      dotColor: 'bg-blue-500'
    },
    PROCESSING: {
      label: 'Đang xử lý',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
      dotColor: 'bg-purple-500'
    },
    SHIPPED: {
      label: 'Đã giao vận',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-700 dark:text-cyan-400',
      borderColor: 'border-cyan-200 dark:border-cyan-800',
      dotColor: 'bg-cyan-500'
    },
    DELIVERED: {
      label: 'Đã giao hàng',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      dotColor: 'bg-green-500'
    },
    CANCELLED: {
      label: 'Đã hủy',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      dotColor: 'bg-red-500'
    }
  };

  const currentStatus = statusConfig[status] || statusConfig.PENDING;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (newStatus) => {
    onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Status Badge Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
          border transition-all duration-200
          ${currentStatus.bgColor} ${currentStatus.textColor} ${currentStatus.borderColor}
          hover:shadow-md hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        `}
      >
        <span className={`w-2 h-2 rounded-full mr-2 ${currentStatus.dotColor}`}></span>
        {currentStatus.label}
        <ChevronDown className={`w-3 h-3 ml-1.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1">
          {Object.entries(statusConfig).map(([statusKey, config]) => (
            <button
              key={statusKey}
              onClick={() => handleStatusChange(statusKey)}
              className={`
                w-full px-4 py-2.5 text-left text-sm flex items-center justify-between
                hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors
                ${status === statusKey ? 'bg-slate-50 dark:bg-slate-700' : ''}
              `}
            >
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-3 ${config.dotColor}`}></span>
                <span className={`font-medium ${config.textColor}`}>
                  {config.label}
                </span>
              </div>
              {status === statusKey && (
                <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditableOrderStatus;

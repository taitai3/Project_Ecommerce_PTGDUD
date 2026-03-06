import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Trash2,
  Loader2,
} from 'lucide-react';
import customerService from '../services/customerService';
import CustomerDetailModal from '../components/CustomerDetailModal';
import ExportMenu from '../components/ExportMenu';
import Toast from '../components/Toast';
import { exportCustomersToCSV, exportCustomersToExcel } from '../utils/exportUtils';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    fetchCustomers();
    fetchTotalCount();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAllCustomers(currentPage, pageSize);
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCount = async () => {
    try {
      const count = await customerService.getTotalCustomers();
      setTotalCustomers(count);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        fetchCustomers();
        fetchTotalCount();
        setToast({ message: 'Customer deleted successfully!', type: 'success' });
      } catch (error) {
        console.error('Error deleting customer:', error);
        setToast({ message: 'Failed to delete customer', type: 'error' });
      }
    }
  };

  const handleToggleActive = async (customer) => {
    try {
      await customerService.updateCustomer(customer.id, {
        active: !customer.active
      });
      fetchCustomers();
      setToast({ 
        message: `Customer ${!customer.active ? 'activated' : 'deactivated'} successfully!`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      setToast({ message: 'Failed to update customer', type: 'error' });
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (id, data) => {
    try {
      if (id) {
        // Update existing customer
        await customerService.updateCustomer(id, data);
        setToast({ message: 'Customer updated successfully!', type: 'success' });
      } else {
        // Create new customer via register API
        await customerService.createCustomer(data);
        setToast({ message: 'Customer created successfully!', type: 'success' });
      }
      setIsModalOpen(false);
      fetchCustomers();
      fetchTotalCount();
    } catch (error) {
      console.error('Error saving customer:', error);
      setToast({ 
        message: error.response?.data?.message || 'Failed to save customer', 
        type: 'error' 
      });
    }
  };

  const fakeCustomers = [
    {
      id: 1,
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2023-12-15',
      totalOrders: 12,
      totalSpent: '$1,234.56',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      joinDate: '2023-11-20',
      totalOrders: 8,
      totalSpent: '$892.34',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      joinDate: '2023-10-05',
      totalOrders: 15,
      totalSpent: '$2,156.78',
      status: 'VIP',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'William Kim',
      email: 'will@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      joinDate: '2024-01-10',
      totalOrders: 3,
      totalSpent: '$234.90',
      status: 'New',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 5,
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      joinDate: '2023-09-18',
      totalOrders: 0,
      totalSpent: '$0.00',
      status: 'Inactive',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const getStatusColor = (active) => {
    return active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (active) => {
    return active ? 'Active' : 'Inactive';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'Active' && customer.active) ||
      (statusFilter === 'Inactive' && !customer.active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your customer relationships</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <ExportMenu
            onExportCSV={() => exportCustomersToCSV(filteredCustomers)}
            onExportExcel={() => exportCustomersToExcel(filteredCustomers)}
          />
          <button 
            onClick={() => {
              setSelectedCustomer(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {customers.filter(c => c.active).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <User className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Inactive</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {customers.filter(c => !c.active).length}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <User className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Admins</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {customers.filter(c => c.role === 'ADMIN').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Join Date
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Location / Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  onClick={() => handleViewDetails(customer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{customer.fullName}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">@{customer.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-slate-900 dark:text-white">
                        <Mail className="w-3 h-3 mr-2 text-slate-400 dark:text-slate-500" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                          <Phone className="w-3 h-3 mr-2 text-slate-400 dark:text-slate-500" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.address ? (
                      <div className="flex items-center text-sm text-slate-900 dark:text-white">
                        <MapPin className="w-3 h-3 mr-2 text-slate-400 dark:text-slate-500" />
                        {customer.address}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 dark:text-slate-500">N/A</span>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {customer.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.active)}`}>
                      {getStatusText(customer.active)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(customer);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleActive(customer);
                        }}
                        className="p-1 text-slate-400 hover:text-green-600"
                        title={customer.active ? 'Deactivate' : 'Activate'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-700 dark:text-slate-300">
          Showing <span className="font-medium">{currentPage * pageSize + 1}</span> to{' '}
          <span className="font-medium">{Math.min((currentPage + 1) * pageSize, totalCustomers)}</span> of{' '}
          <span className="font-medium">{totalCustomers}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-3 py-2 text-sm rounded-lg ${
                currentPage === index
                  ? 'bg-primary-600 text-white'
                  : 'border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      {/* Toast Notification */}
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

export default Customers;
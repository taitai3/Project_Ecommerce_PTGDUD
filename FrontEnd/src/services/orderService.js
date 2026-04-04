import api from './api';

const orderService = {
  // Get all orders (Admin)
  getAllOrders: async (page = 0, size = 10, status = '', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const response = await api.get(`/orders?${params}`);
    return response.data;
  },

  // Get current user's orders
  getMyOrders: async (page = 0, size = 10, status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (status) params.append('status', status);
    
    const response = await api.get(`/orders/my?${params}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Update order status (Admin only)
  updateOrderStatus: async (orderId, status, notes = '') => {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get order statistics (Admin only)
  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },

  // Create order from cart
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get orders by user ID (Admin only)
  getOrdersByUserId: async (userId, page = 0, size = 10, status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (status) params.append('status', status);
    
    const response = await api.get(`/orders/user/${userId}?${params}`);
    return response.data;
  }
};

export default orderService;
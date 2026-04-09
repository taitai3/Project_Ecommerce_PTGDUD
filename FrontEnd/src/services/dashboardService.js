import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const [orderStats, productStats, userStats] = await Promise.all([
        api.get('/orders/stats'),
        api.get('/products/stats'),
        api.get('/users/count')
      ]);

      return {
        success: true,
        data: {
          orders: orderStats.data.data,
          products: productStats.data.data,
          users: userStats.data.data
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  },

  // Get recent orders for dashboard
  getRecentOrders: async (limit = 5) => {
    const response = await api.get(`/orders?page=0&size=${limit}`);
    return response.data;
  },

  // Get top selling products
  getTopProducts: async (limit = 5) => {
    const response = await api.get(`/products/top-selling?limit=${limit}`);
    return response.data;
  }
};

export default dashboardService;

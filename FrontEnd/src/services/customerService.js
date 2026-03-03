import api from './api';

const customerService = {
  // Get all customers with pagination
  getAllCustomers: async (page = 0, size = 10, sortBy = 'id', sortDir = 'DESC') => {
    const response = await api.get('/users', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    await api.delete(`/users/${id}`);
  },

  // Get total customers count
  getTotalCustomers: async () => {
    const response = await api.get('/users/count');
    return response.data;
  }
};

export default customerService;

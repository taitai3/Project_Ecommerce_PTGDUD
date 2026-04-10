import api from './api';

const productService = {
  getAllProducts: async (page = 0, size = 20, search = '', categoryId = '', sortBy = 'createdAt', sortDir = 'desc') => {
    const params = new URLSearchParams({ page, size, sortBy, sortDir });
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);
    const res = await api.get(`/products/page?${params}`);
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  getFeaturedProducts: async (size = 8) => {
    const res = await api.get(`/products?page=0&size=${size}&sortBy=createdAt&sortDir=desc`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await api.post('/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  getAllBrands: async () => {
    try {
      const res = await api.get('/products/brands');
      return res.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },
};

export default productService;

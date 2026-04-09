import api from "./api";

const productService = {
  // Get all products with pagination
  getAllProducts: async (page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") => {
    const response = await api.get("/products/page", {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get all products (no pagination)
  getAllProductsList: async () => {
    const response = await api.get("/products");
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (keyword, page = 0, size = 10) => {
    const response = await api.get("/products/search", {
      params: { keyword, page, size }
    });
    return response.data;
  },

  // Get all brands
  getAllBrands: async () => {
    const response = await api.get("/products/brands");
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (data) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get product count (Admin only)
  getProductCount: async () => {
    const response = await api.get("/products/stats");
    return response.data;
  },
};

export default productService;

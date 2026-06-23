import api from './api.js';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const storeService = {
  getStores: () => api.get('/stores'),
  getStore: (id) => api.get(`/stores/${id}`),
  createStore: (data) => api.post('/stores', data),
  updateStore: (id, data) => api.put(`/stores/${id}`, data),
  deleteStore: (id) => api.delete(`/stores/${id}`),
  getVendorStore: () => api.get('/stores/vendor/my-store'),
};

export const productService = {
  getProducts: (storeId, query) => api.get(`/stores/${storeId}/products`, { params: query }),
  getProduct: (id) => api.get(`/stores/products/${id}`),
  createProduct: (storeId, data) => api.post(`/stores/${storeId}/products`, data),
  updateProduct: (id, data) => api.put(`/stores/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/stores/products/${id}`),
  searchProducts: (q) => api.get('/stores/:storeId/products/search', { params: { q } }),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  clearCart: () => api.delete('/cart'),
};

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getOrderStats: () => api.get('/orders/stats'),
};

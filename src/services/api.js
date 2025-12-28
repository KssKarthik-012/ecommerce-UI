import axios from 'axios';
import API_BASE_URL from './apiConfig';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getLowStock: () => api.get('/products/low-stock'),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, productData) => api.put(`/products/${id}`, productData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  updateStock: (id, stockData) => api.patch(`/products/${id}/stock`, stockData),
  toggleVisibility: (id, visible) => api.patch(`/products/${id}/visibility`, { visible }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/admin/categories', categoryData),
  update: (id, categoryData) => api.put(`/admin/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getStats: (params) => api.get('/orders/stats', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  createOnline: (orderData) => api.post('/orders/online', orderData),
  createPhysical: (orderData) => api.post('/orders/physical', orderData),
  createOffline: (orderData) => api.post('/orders/offline', orderData),
  getOfflineOrders: () => api.get('/orders/offline'),
  updateStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
  updatePayment: (id, paymentData) => api.patch(`/orders/${id}/payment`, paymentData),
  delete: (id) => api.delete(`/orders/${id}`),
  downloadBill: (id) => api.get(`/orders/${id}/bill`, { responseType: 'blob' }),
  getCustomerOrders: () => api.get('/orders/my'),
  setDeliveryLink: (id, data) => api.patch(`/orders/${id}/delivery-link`, data),
  downloadOrdersReport: (params) => api.get('/orders/reports/download', { 
    params, 
    responseType: 'blob' 
  }),
};

// Customers API
export const customersAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getStats: () => api.get('/customers/stats'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customerData) => api.post('/customers', customerData),
  update: (id, customerData) => api.put(`/customers/${id}`, customerData),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getLowStock: () => api.get('/dashboard/low-stock'),
  getTopProducts: (params) => api.get('/dashboard/top-products', { params }),
  getRecentOrders: (params) => api.get('/dashboard/recent-orders', { params }),
  getSalesAnalytics: (params) => api.get('/dashboard/sales-analytics', { params }),
  getInventoryAnalytics: () => api.get('/dashboard/inventory-analytics'),
  exportSalesReport: (params) => api.get('/dashboard/sales-report/export', { 
    params, 
    responseType: 'blob' 
  }),
  exportInventoryReport: (params) => api.get('/dashboard/inventory-report/export', { 
    params, 
    responseType: 'blob' 
  }),
};

// Purchase Orders API
export const purchaseOrdersAPI = {
  getAll: (params) => api.get('/purchase-orders', { params }),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (poData) => api.post('/purchase-orders', poData),
  update: (id, poData) => api.put(`/purchase-orders/${id}`, poData),
  delete: (id) => api.delete(`/purchase-orders/${id}`),
  updateStatus: (id, status) => api.patch(`/purchase-orders/${id}/status`, { status }),
};

// Static Pages API (for public pages)
export const staticPagesAPI = {
  getHomePage: () => api.get('/static-pages/home'),
  getProducts: (params) => api.get('/static-pages/products', { params }),
  getProductById: (id) => api.get(`/static-pages/products/${id}`),
  getCategories: () => api.get('/static-pages/categories'),
  submitOrder: (orderData) => api.post('/static-pages/orders', orderData),
  trackOrder: (orderNumber) => api.get(`/static-pages/orders/${orderNumber}`),
};

export default api; 
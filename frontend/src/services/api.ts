import axios from 'axios';
import {
  User,
  Product,
  PaginatedResponse,
  Category,
  Cart,
  Order,
  CouponResult,
  Banner,
  AnnouncementBar,
  StoreBenefit,
  DashboardStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper for Session ID for guest cart
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('mb_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('mb_session_id', sessionId);
  }
  return sessionId;
};

// 1. Auth API
export const authApi = {
  register: async (data: any) => (await api.post('/auth/register', data)).data,
  login: async (data: any) => (await api.post('/auth/login', data)).data,
  getProfile: async () => (await api.get('/auth/me')).data,
  updateProfile: async (data: any) => (await api.put('/auth/profile', data)).data,
};

// 2. Product API
export const productApi = {
  getProducts: async (params?: any): Promise<PaginatedResponse<Product>> => 
    (await api.get('/products', { params })).data,
  getProductById: async (id: number): Promise<Product> => 
    (await api.get(`/products/${id}`)).data,
  getProductBySlug: async (slug: string): Promise<Product> => 
    (await api.get(`/products/slug/${slug}`)).data,
  getRelatedProducts: async (id: number): Promise<Product[]> => 
    (await api.get(`/products/${id}/related`)).data,
};

// 3. Category API
export const categoryApi = {
  getCategories: async (): Promise<Category[]> => 
    (await api.get('/categories')).data,
};

// 4. Cart API
export const cartApi = {
  getCart: async (): Promise<Cart> => 
    (await api.get('/cart', { params: { sessionId: getSessionId() } })).data,
  addToCart: async (productId: number, productVariantId?: number, quantity: number = 1): Promise<Cart> => 
    (await api.post('/cart/items', { productId, productVariantId, quantity, sessionId: getSessionId() })).data,
  updateQuantity: async (itemId: number, quantity: number) => 
    (await api.put(`/cart/items/${itemId}`, quantity)).data,
  removeItem: async (itemId: number) => 
    (await api.delete(`/cart/items/${itemId}`)).data,
  syncGuestCart: async (): Promise<Cart> => 
    (await api.post('/cart/sync', { sessionId: getSessionId() })).data,
};

// 5. Wishlist API
export const wishlistApi = {
  getWishlist: async (): Promise<Product[]> => (await api.get('/wishlist')).data,
  toggleWishlist: async (productId: number) => (await api.post(`/wishlist/toggle/${productId}`)).data,
};

// 6. Order API
export const orderApi = {
  createOrder: async (data: any) => 
    (await api.post('/orders', { ...data, sessionId: getSessionId() })).data,
  getMyOrders: async (): Promise<Order[]> => (await api.get('/orders/my-orders')).data,
  getOrderById: async (id: number): Promise<Order> => (await api.get(`/orders/${id}`)).data,
};

// 7. Payment API
export const paymentApi = {
  createRazorpayOrder: async (orderId: number) => 
    (await api.post('/payments/create-razorpay-order', { orderId })).data,
  verifyPayment: async (data: any) => 
    (await api.post('/payments/verify', data)).data,
};

// 8. Coupon API
export const couponApi = {
  validateCoupon: async (code: string, subtotal: number): Promise<CouponResult> => 
    (await api.post('/coupons/validate', { code, orderSubtotal: subtotal })).data,
};

// 9. Review API
export const reviewApi = {
  getReviews: async (productId: number) => (await api.get(`/reviews/product/${productId}`)).data,
  getFeaturedReviews: async () => (await api.get('/reviews/featured')).data,
  submitReview: async (data: any) => (await api.post('/reviews', data)).data,
};

// 10. CMS API
export const cmsApi = {
  getHeroBanners: async (): Promise<Banner[]> => (await api.get('/banners/hero')).data,
  getAnnouncements: async (): Promise<AnnouncementBar[]> => (await api.get('/banners/announcements')).data,
  getStoreBenefits: async (): Promise<StoreBenefit[]> => (await api.get('/banners/benefits')).data,
  subscribeNewsletter: async (email: string) => (await api.post('/banners/subscribe', JSON.stringify(email), { headers: { 'Content-Type': 'application/json' } })).data,
};

// 11. Admin API
export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => (await api.get('/admin/dashboard')).data,
  getProducts: async () => (await api.get('/admin/products')).data,
  createProduct: async (product: any) => (await api.post('/admin/products', product)).data,
  updateProduct: async (id: number, product: any) => (await api.put(`/admin/products/${id}`, product)).data,
  deleteProduct: async (id: number) => (await api.delete(`/admin/products/${id}`)).data,
  uploadImage: async (formData: FormData) => (await api.post('/admin/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  getOrders: async (): Promise<Order[]> => (await api.get('/admin/orders')).data,
  updateOrderStatus: async (id: number, data: any) => (await api.put(`/admin/orders/${id}/status`, data)).data,
  saveBanner: async (banner: any) => (await api.post('/admin/banners', banner)).data,
  saveAnnouncement: async (announcement: any) => (await api.post('/admin/announcements', announcement)).data,
  getCoupons: async () => (await api.get('/admin/coupons')).data,
  createCoupon: async (coupon: any) => (await api.post('/admin/coupons', coupon)).data,
  getCustomers: async () => (await api.get('/admin/customers')).data,
};

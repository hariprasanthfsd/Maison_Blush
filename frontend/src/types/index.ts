export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Admin';
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  parentCategoryId?: number;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  subcategories?: Category[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: number;
  size: string;
  colorName: string;
  colorHex: string;
  stockQuantity: number;
  sku: string;
  additionalPrice: number;
}

export interface Review {
  id: number;
  productId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription: string;
  basePrice: number;
  salePrice?: number;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  sku?: string;
  material?: string;
  careInstructions?: string;
  badge: string;
  primaryImageUrl: string;
  isNewArrival: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  totalStock: number;
  isInStock?: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImageUrl: string;
  productVariantId?: number;
  size: string;
  colorName: string;
  colorHex: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  availableStock: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  totalQuantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  productImageUrl: string;
  variantDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  couponCode: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  razorpayOrderId?: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface CouponResult {
  isValid: boolean;
  message: string;
  code: string;
  discountType: string;
  discountValue: number;
  calculatedDiscount: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  targetUrl: string;
  slideOrder: number;
  isActive: boolean;
}

export interface AnnouncementBar {
  id: number;
  message: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface StoreBenefit {
  id: number;
  title: string;
  iconName: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  lowStockProductsCount: number;
  recentOrders: Order[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

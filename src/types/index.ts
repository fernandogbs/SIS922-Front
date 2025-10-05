// Types matching the API
export interface User {
  _id: string;
  name: string;
  cellphone: string;
  type: 'default' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  userId: string;
  userName: string;
  userCellphone: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface LoginRequest {
  name: string;
  cellphone: string;
}

export interface LoginResponse {
  user: User;
  success: boolean;
  message: string;
}

export interface AddToCartRequest {
  userId: string;
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  notes?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  search?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  availableProducts: number;
  totalRevenue: number;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentOrders: Order[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

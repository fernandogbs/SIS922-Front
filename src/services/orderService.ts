import api from './api';
import { CreateOrderRequest, DashboardResponse } from '../types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest) => {
    const response = await api.post('/api/orders/create', data);
    return response.data;
  },

  getUserOrders: async (userId: string) => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  },

  // Admin only
  getAllOrders: async (adminUserId: string, status?: string) => {
    const response = await api.get(`/api/admin/${adminUserId}/orders`, {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  getOrderById: async (adminUserId: string, orderId: string) => {
    const response = await api.get(`/api/admin/${adminUserId}/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (adminUserId: string, orderId: string, status: 'accepted' | 'declined' | 'completed') => {
    const response = await api.patch(`/api/admin/${adminUserId}/orders/${orderId}/status`, { status });
    return response.data;
  },

  getDashboard: async (adminUserId: string): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>(`/api/admin/${adminUserId}/dashboard`);
    return response.data;
  },
};

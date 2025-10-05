import api from './api';
import { LoginRequest, LoginResponse } from '../types';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await api.get(`/api/auth/profile/${userId}`);
    return response.data;
  },

  createAdmin: async (name: string, cellphone: string, adminSecret: string) => {
    const response = await api.post('/api/auth/create-admin', {
      name,
      cellphone,
      adminSecret,
    });
    return response.data;
  },
};

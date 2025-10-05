import api from './api'
import { AddToCartRequest } from '../types'

export const cartService = {
  getCart: async (userId: string) => {
    const response = await api.get(`/api/cart/${userId}`)
    return response.data
  },

  addToCart: async (data: AddToCartRequest) => {
    const response = await api.post('/api/cart/add', data)
    return response.data
  },

  removeFromCart: async (userId: string, productId: string) => {
    const response = await api.delete(`/api/cart/remove/${userId}/${productId}`)
    return response.data
  },

  clearCart: async (userId: string) => {
    const response = await api.delete(`/api/cart/clear/${userId}`)
    return response.data
  },
}

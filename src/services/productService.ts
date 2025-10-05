import api from './api'
import { Product, ProductFilters } from '../types'

export const productService = {
  getProducts: async (filters?: ProductFilters) => {
    const response = await api.get('/api/products', { params: filters })
    return response.data
  },

  getProductById: async (productId: string) => {
    const response = await api.get(`/api/products/${productId}`)
    return response.data
  },

  // Admin only
  createProduct: async (adminUserId: string, product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post(`/api/admin/${adminUserId}/products`, product)
    return response.data
  },

  updateProduct: async (adminUserId: string, productId: string, updates: Partial<Product>) => {
    const response = await api.put(`/api/admin/${adminUserId}/products/${productId}`, updates)
    return response.data
  },

  deleteProduct: async (adminUserId: string, productId: string) => {
    const response = await api.delete(`/api/admin/${adminUserId}/products/${productId}`)
    return response.data
  },
}

import useSWR from 'swr'
import { orderService } from '../services/orderService'

export const useUserOrders = (userId: string | null) => {
  const { data, error, mutate } = useSWR(
    userId ? `/api/orders/user/${userId}` : null,
    () => userId ? orderService.getUserOrders(userId) : null,
    {
      refreshInterval: 10000, // Refresh every 10 seconds
    }
  )

  return {
    orders: data?.orders || [],
    isLoading: !error && !data && userId !== null,
    isError: error,
    mutate,
  }
}

export const useAdminOrders = (adminUserId: string | null, status?: string) => {
  const { data, error, mutate } = useSWR(
    adminUserId ? [`/api/admin/${adminUserId}/orders`, status] : null,
    () => adminUserId ? orderService.getAllOrders(adminUserId, status) : null,
    {
      refreshInterval: 5000, // Refresh every 5 seconds for admin
    }
  )

  return {
    orders: data?.orders || [],
    isLoading: !error && !data && adminUserId !== null,
    isError: error,
    mutate,
  }
}

export const useDashboard = (adminUserId: string | null) => {
  const { data, error, mutate } = useSWR(
    adminUserId ? `/api/admin/${adminUserId}/dashboard` : null,
    () => adminUserId ? orderService.getDashboard(adminUserId) : null,
    {
      refreshInterval: 15000, // Refresh every 15 seconds
    }
  )

  return {
    stats: data?.stats,
    recentOrders: data?.recentOrders || [],
    isLoading: !error && !data && adminUserId !== null,
    isError: error,
    mutate,
  }
}

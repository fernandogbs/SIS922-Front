import useSWR from 'swr';
import { cartService } from '../services/cartService';

export const useCart = (userId: string | null) => {
  const { data, error, mutate } = useSWR(
    userId ? `/api/cart/${userId}` : null,
    () => userId ? cartService.getCart(userId) : null,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    cart: data?.cart,
    isLoading: !error && !data && userId !== null,
    isError: error,
    mutate,
  };
};

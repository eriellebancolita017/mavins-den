import type { Shop, ShopPaginator, TopShopQueryOptions } from '@/types';
import type { UseInfiniteQueryOptions } from 'react-query';
import { useInfiniteQuery, useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';

export function useTopShops(
  options?: Partial<TopShopQueryOptions>,
  config?: UseInfiniteQueryOptions<ShopPaginator, Error>
) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.TOP_SHOPS, options],
    ({ queryKey, pageParam }) =>
      client.shops.top(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    shops: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}
export function useShop(slug: string) {
  const { data, isLoading, error } = useQuery<Shop, Error>(
    [API_ENDPOINTS.SHOPS, slug],
    () => client.shops.get(slug)
  );
  return {
    product: data,
    isLoading,
    error,
  };
}

import type {
  Order,
  OrderedFilePaginator,
  OrderPaginator,
  OrderQueryOptions,
} from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';

export function useOrders(options?: OrderQueryOptions) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderPaginator, Error>(
    [API_ENDPOINTS.ORDERS, options],
    ({ queryKey, pageParam }) =>
      client.orders.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    orders: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}
export function useDownloadableProductOrders(options?: OrderQueryOptions) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OrderedFilePaginator, Error>(
    [API_ENDPOINTS.ORDERS_DOWNLOADS, options],
    ({ queryKey, pageParam }) =>
      client.orders.downloadable(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    downloadableFiles: data?.pages.flatMap((page) => page.data) ?? [],
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}

export function useOrder(tracking_number: string) {
  const { data, isLoading, error } = useQuery<Order, Error>(
    [API_ENDPOINTS.ORDERS, tracking_number],
    () => client.orders.get(tracking_number)
  );
  return {
    order: data,
    isLoading,
    error,
  };
}

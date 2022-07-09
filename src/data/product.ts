import type {
  PopularProductsQueryOptions,
  Product,
  ProductPaginator,
  ProductQueryOptions,
} from '@/types';
import type { UseInfiniteQueryOptions } from 'react-query';
import { useInfiniteQuery, useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';

export function useProducts(
  options?: Partial<ProductQueryOptions>,
  config?: UseInfiniteQueryOptions<ProductPaginator, Error>
) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, options],
    ({ queryKey, pageParam }) =>
      client.products.all(Object.assign({}, queryKey[1], pageParam)),
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
    products: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    isLoading,
    error,
    hasNextPage,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
}

export function useProduct(slug: string) {
  const { data, isLoading, error } = useQuery<Product, Error>(
    [API_ENDPOINTS.PRODUCTS, slug],
    () => client.products.get(slug)
  );
  return {
    product: data,
    isLoading,
    error,
  };
}

export function usePopularProducts(
  options?: Partial<PopularProductsQueryOptions>
) {
  const { data, isLoading, error } = useQuery<Product[], Error>(
    [API_ENDPOINTS.PRODUCTS_POPULAR, options],
    ({ queryKey }) => client.products.popular(Object.assign({}, queryKey[1]))
  );
  return {
    popularProducts: data ?? [],
    isLoading,
    error,
  };
}

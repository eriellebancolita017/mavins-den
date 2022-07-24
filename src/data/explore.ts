import type {
  BundleQueryOptions,
  Bundles,
  ShopPaginator,
  TopShopQueryOptions,
} from '@/types';
import type { UseInfiniteQueryOptions } from 'react-query';
import { useInfiniteQuery, useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';

export function useBundles(slug: BundleQueryOptions) {
  const { data, isLoading, error } = useQuery<{ payload: Bundles[] }, Error>(
    [API_ENDPOINTS.EXPLORE_MEAL_BUNDLES, slug],
    () => client.bundles.get(slug)
  );
  return {
    bundles: data?.payload,
    isLoading,
    error,
  };
}

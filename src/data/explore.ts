import type {
  Bundle,
  BundleQueryOptions,
  Bundles,
  Prepper,
  Preppers,
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

export function usePreppers(slug: BundleQueryOptions) {
  const { data, isLoading, error } = useQuery<{ payload: Preppers[] }, Error>(
    [API_ENDPOINTS.EXPLORE_MEAL_PREPPERS, slug],
    () => client.preppers.get(slug)
  );
  return {
    preppers: data?.payload,
    isLoading,
    error,
  };
}

export function usePrepperDetails(slug: BundleQueryOptions) {
  const { data, isLoading, error } = useQuery<{ payload: Prepper }, Error>(
    [API_ENDPOINTS.PREPPER_DETAILS, slug],
    () => client.preppers.getDetails(slug)
  );
  return {
    prepper: data?.payload,
    isLoading,
    error,
  };
}

export function useBundleDetails(slug: BundleQueryOptions) {
  const { data, isLoading, error } = useQuery<{ payload: Bundle }, Error>(
    [API_ENDPOINTS.ITEM_DETAILS, slug],
    () => client.bundles.getDetails(slug)
  );
  return {
    bundle: data?.payload,
    isLoading,
    error,
  };
}

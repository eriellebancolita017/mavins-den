import type {
  CategoryQueryOptions,
  NextPageWithLayout,
  ProductQueryOptions,
} from '@/types';
import type { GetStaticProps } from 'next';
import Layout from '@/layouts/_layout';
import { useProducts } from '@/data/product';
import Grid from '@/components/product/grid';
import { useRouter } from 'next/router';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import client from '@/data/client';
import { dehydrate, QueryClient } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import CategoryFilter from '@/components/product/category-filter';
import PromoCarousel from '@/components/product/promo-carousel';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  try {
    await Promise.all([
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, {}],
        ({ queryKey }) =>
          client.products.all(queryKey[1] as ProductQueryOptions)
      ),
      queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.CATEGORIES, { limit: 100 }],
        ({ queryKey }) =>
          client.categories.all(queryKey[1] as CategoryQueryOptions)
      ),
    ]);
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function Products() {
  const { query } = useRouter();
  const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
    useProducts({
      ...(query.category && { categories: query.category }),
    });
  return (
    <Grid
      products={products}
      onLoadMore={loadMore}
      hasNextPage={hasNextPage}
      isLoadingMore={isLoadingMore}
      isLoading={isLoading}
    />
  );
}

const Explore: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="UI Design Resources, UI Kits, Wireframes, Icons and More"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.home}
      />
      <PromoCarousel />
      <CategoryFilter defaultActivePath={routes.explore} />
      <Products />
    </>
  );
};

Explore.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Explore;

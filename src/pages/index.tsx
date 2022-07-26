import type {
  Bundles,
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
import { useBundles } from '@/data/explore';
import { useState } from 'react';

// export const getStaticProps: GetStaticProps = async () => {
//   const queryClient = new QueryClient();
//   try {
//     await Promise.all([
//       queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS], client.settings.all),
//       queryClient.prefetchInfiniteQuery(
//         [API_ENDPOINTS.PRODUCTS, {}],
//         ({ queryKey }) =>
//           client.products.all(queryKey[1] as ProductQueryOptions)
//       ),
//       queryClient.prefetchInfiniteQuery(
//         [API_ENDPOINTS.CATEGORIES, { limit: 100 }],
//         ({ queryKey }) =>
//           client.categories.all(queryKey[1] as CategoryQueryOptions)
//       ),
//     ]);
//     return {
//       props: {
//         dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//       },
//       revalidate: 60, // In seconds
//     };
//   } catch (error) {
//     //* if we get here, the product doesn't exist or something else went wrong
//     return {
//       notFound: true,
//     };
//   }
// };

function Products({
  index,
  bundles,
  isLoading,
}: {
  index: number | string;
  bundles: Bundles[];
  isLoading: boolean;
}) {
  // const { query } = useRouter();
  // const { products, loadMore, hasNextPage, isLoadingMore, isLoading } =
  //   useProducts({
  //     ...(query.category && { categories: query.category }),
  //     ...(query.price && { price: query.price }),
  //   });
  return (
    // <div></div>
    <>
      {!!bundles ? (
        index === 'all' ? (
          <Grid
            bundles={(bundles as Bundles[]).map((b) => b.data).flat()}
            isLoading={isLoading}
          />
        ) : (
          <Grid
            bundles={(bundles as Bundles[])[index as number].data}
            isLoading={isLoading}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
}

const Home: NextPageWithLayout = () => {
  const [index, setIndex] = useState<number | string>('all');
  const { bundles, isLoading } = useBundles({
    latitude: 52.2880064,
    longitude: 0.0522195,
    code: 'EN',
    searchKeyword: 'bundle',
    store_type: 'restaurant',
  });
  return (
    <>
      <Seo
        title="Meal Bundles"
        description="We partnered up with the best meal prep providers and meal delivery companies in the UK."
        url={routes.home}
      />
      {!!bundles && (
        <>
          <CategoryFilter
            bundles={bundles as Bundles[]}
            index={index}
            setIndex={setIndex}
          />
          <Products
            index={index}
            bundles={bundles as Bundles[]}
            isLoading={isLoading}
          />
        </>
      )}
    </>
  );
};

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Home;

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
import { useUserContext } from '@/components/preppers/context';
import { SearchIcon } from '@/components/icons/search-icon';
import _ from 'lodash';

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
            bundles={(bundles as Bundles[])[index as number]?.data || []}
            isLoading={isLoading}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
}

const Explore: NextPageWithLayout = () => {
  const [index, setIndex] = useState<number | string>('all');
  const [search, setSearch] = useState('');
  const { location } = useUserContext();
  const { bundles, isLoading } = useBundles({
    latitude: location.latitude || 51.52562,
    longitude: location.longitude || -0.0836,
    code: 'EN',
    searchKeyword: search || 'all',
    store_type: 'restaurant',
  });

  const printValue = _.debounce((value) => setSearch(value), 1000);

  const handleChangeWithDebounce = ({ target }: any) =>
    printValue(target.value);

  return (
    <>
      <Seo
        title="Bundles & Plans"
        description="We partnered up with the best meal prep providers and meal delivery companies in the UK."
        url={routes.explore}
      />

      <div className="flex flex-col items-end bg-light-100 dark:bg-dark-100 md:flex-row">
        {!!bundles && !isLoading ? (
          <CategoryFilter
            bundles={bundles || ([] as Bundles[])}
            index={index}
            setIndex={setIndex}
          />
        ) : (
          <div className="h-[70px] flex-1"></div>
        )}
        <div className="relative mt-3 w-full max-w-xs border-b border-light-400 pl-6 pb-2 pr-4 dark:border-dark-300 sm:mt-0 md:pb-3">
          <SearchIcon className="absolute left-6 top-6 -mt-2 h-4 w-4" />
          <input
            type="search"
            placeholder="Search by name..."
            defaultValue={search}
            onChange={handleChangeWithDebounce}
            className="border-dark-30 h-11 w-full border-0 border-b border-b-light-600 bg-transparent pl-8 text-13px outline-none focus:border-b-light-800 focus:ring-0 dark:border-b-dark-400 dark:focus:border-b-dark-500"
          />
        </div>
      </div>
      <Products
        index={index}
        bundles={bundles || ([] as Bundles[])}
        isLoading={isLoading}
      />
    </>
  );
};

Explore.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Explore;

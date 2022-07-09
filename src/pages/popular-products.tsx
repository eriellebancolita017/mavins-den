import type { NextPageWithLayout } from '@/types';
import { useState } from 'react';
import Layout from '@/layouts/_layout';
import { usePopularProducts } from '@/data/product';
import Grid from '@/components/product/grid';
import Seo from '@/layouts/_seo';
import routes from '@/config/routes';
import ButtonGroup from '@/components/ui/button-group';

const MAP_RANGE_FILTER = [
  {
    label: 'Weekly',
    range: 7,
  },
  {
    label: 'Monthly',
    range: 30,
  },
  {
    label: 'Yearly',
    range: 365,
  },
];

function Products() {
  let [selected, setRange] = useState(MAP_RANGE_FILTER[2]);
  const { popularProducts, isLoading } = usePopularProducts({
    range: selected.range,
  });
  return (
    <>
      <div className="flex flex-col-reverse flex-wrap items-center justify-between px-4 pt-5 pb-4 xs:flex-row xs:space-x-4 md:px-6 md:pt-6 lg:px-7 3xl:px-8">
        <div className="pt-3 xs:pt-0">
          Total {popularProducts.length} products found
        </div>
        <ButtonGroup
          items={MAP_RANGE_FILTER}
          selectedValue={selected}
          onChange={setRange}
        />
      </div>
      <Grid
        products={popularProducts}
        hasNextPage={false}
        isLoadingMore={false}
        isLoading={isLoading}
      />
    </>
  );
}

const PopularProductsPage: NextPageWithLayout = () => {
  return (
    <>
      <Seo
        title="Top Products"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.popularProducts}
      />
      <Products />
    </>
  );
};

PopularProductsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PopularProductsPage;

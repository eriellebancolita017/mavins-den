import { usePreppers } from '@/data/explore';
import type { NextPageWithLayout, Preppers } from '@/types';
import { useState } from 'react';
import Seo from '@/layouts/_seo';
import Layout from '@/layouts/_layout';
import routes from '@/config/routes';
import CategoryFilter from '@/components/preppers/category-filter';
import Grid from '@/components/preppers/grid';

function Preppers({
  index,
  preppers,
  isLoading,
}: {
  index: number | string;
  preppers: Preppers[];
  isLoading: boolean;
}) {
  return (
    <>
      {!!preppers ? (
        index === 'all' ? (
          <Grid
            preppers={preppers.map((b) => b.data).flat()}
            isLoading={isLoading}
          />
        ) : (
          <Grid
            preppers={preppers[index as number].data}
            isLoading={isLoading}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
}

const PreppersPage: NextPageWithLayout = () => {
  const [index, setIndex] = useState<number | string>('all');
  const { preppers, isLoading } = usePreppers({
    latitude: 52.2880064,
    longitude: 0.0522195,
    code: 'EN',
  });

  return (
    <>
      <Seo
        title="Meal Preppers"
        description="We partnered up with the best meal prep providers and meal delivery companies in the UK."
        url={routes.preppers}
      />
      {!!preppers && (
        <>
          <CategoryFilter
            preppers={preppers}
            index={index}
            setIndex={setIndex}
          />
          <Preppers preppers={preppers} index={index} isLoading={isLoading} />
        </>
      )}
    </>
  );
};

PreppersPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default PreppersPage;

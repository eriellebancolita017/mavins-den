import { usePreppers } from '@/data/explore';
import type { NextPageWithLayout, Preppers, Prepper } from '@/types';
import { useState } from 'react';
import Seo from '@/layouts/_seo';
import Layout from '@/layouts/_layout';
import routes from '@/config/routes';
import CategoryFilter from '@/components/preppers/category-filter';
import Grid from '@/components/preppers/grid';
import { useUserContext } from '@/components/preppers/context';

function Preppers({
  index,
  preppers,
  isLoading,
}: {
  index: number | string;
  preppers: Preppers[];
  isLoading: boolean;
}) {
  const uniquePreppers = (): Prepper[] => {
    let unique: Prepper[] = [];
    preppers
      .map((b) => b.data)
      .flat()
      .forEach((c) => {
        if (!unique.find((i) => i.restaurant_id === c.restaurant_id)) {
          unique.push(c);
        }
      });

    return unique.sort((a, b) =>
      (a.avg_rating_by_consumer + a.restaurant_id).localeCompare(
        a.avg_rating_by_consumer + b.restaurant_id
      )
    );
  };

  return (
    <>
      {!!preppers ? (
        index === 'all' ? (
          <Grid preppers={uniquePreppers()} isLoading={isLoading} />
        ) : (
          <Grid
            preppers={preppers[index as number].data.sort((a, b) =>
              (a.avg_rating_by_consumer + a.restaurant_id).localeCompare(
                a.avg_rating_by_consumer + b.restaurant_id
              )
            )}
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
  const { location } = useUserContext();
  const { preppers, isLoading } = usePreppers({
    latitude: location.latitude,
    longitude: location.longitude,

    // latitude: 52.2880064,
    // longitude: 0.0522195,

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

import type { Bundle, Product } from '@/types';
import { motion } from 'framer-motion';
import cn from 'classnames';
import Button from '@/components/ui/button';
import Card from '@/components/product/card';
import ProductCardLoader from '@/components/product/product-loader';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import ItemNotFound from '@/components/ui/item-not-found';
import rangeMap from '@/lib/range-map';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';

interface GridProps {
  bundles?: Bundle[];
  isLoading?: boolean;
}

export default function Grid({ bundles, isLoading }: GridProps) {
  const { isGridCompact } = useGridSwitcher();
  if (!isLoading && !bundles?.length) {
    return (
      <ItemNotFound
        title="No bundles found!"
        message="Sorry, we don’t found any bundles"
        className="px-4 pt-5 pb-10 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
      />
    );
  }
  return (
    <div className="px-4 pt-5 pb-9 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8">
      <motion.div
        variants={staggerTransition(0.025)}
        className={cn(
          'grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-6 3xl:gap-7',
          {
            '2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]':
              isGridCompact,
            '2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]':
              !isGridCompact,
          }
        )}
      >
        {isLoading && !bundles?.length
          ? rangeMap(10, (i) => (
              <ProductCardLoader key={i} uniqueKey={`product-${i}`} />
            ))
          : bundles?.map((bundle) => (
              <Card key={bundle.item_id} bundle={bundle} />
            ))}
      </motion.div>
    </div>
  );
}

import type { Bundle, Product } from '@/types';
import Router from 'next/router';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import { PreviewIcon } from '@/components/icons/preview-icon';
import { DetailsIcon } from '@/components/icons/details-icon';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom';
import { isFree } from '@/lib/is-free';
import { CartIcon } from '../icons/cart-icon';

export default function Card({ bundle }: { bundle: Bundle }) {
  const {
    title,
    description,
    cover_photo,
    price,
    item_id,
    image,
    restaurant_name,
  } = bundle ?? {};
  const { openModal } = useModalAction();
  const { isGridCompact } = useGridSwitcher();

  const addToBasket = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Router.push(routes.productUrl(slug));
    console.log('item clicked to add basket:', item_id);
  };
  return (
    // <div>{bundle.restaurant_name}</div>
    <motion.div variants={fadeInBottomWithScaleX()} title={title}>
      <div className="group relative flex aspect-[3/2] w-full justify-center overflow-hidden">
        <Image
          alt={title}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={cover_photo ?? placeholder}
          className="bg-light-500 dark:bg-dark-400"
        />
        <div
          onClick={() => openModal('PRODUCT_DETAILS', { item_id })}
          className="absolute top-0 left-0 z-10 flex h-full w-full cursor-pointer items-center justify-center gap-9 bg-dark/60 p-4 opacity-0 backdrop-blur-sm transition-all group-hover:gap-5 group-hover:opacity-100 dark:bg-dark/70"
        >
          <button
            onClick={addToBasket}
            className={cn(
              'flex flex-col items-center text-center font-medium text-light',
              isGridCompact ? 'text-xs' : 'text-13px'
            )}
          >
            <div
              className={cn(
                'mb-2 flex items-center justify-center rounded-full bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
                isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
              )}
            >
              <CartIcon className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')} />
            </div>
            Add to basket
          </button>
          <button
            className={cn(
              'relative z-[11] text-center font-medium text-light',
              isGridCompact ? 'text-xs' : 'text-13px'
            )}
          >
            <div
              className={cn(
                'mb-2 flex items-center justify-center rounded-full bg-dark-800 text-light backdrop-blur-sm transition-all hover:bg-brand',
                isGridCompact ? 'h-11 w-11' : 'h-[50px] w-[50px]'
              )}
            >
              <DetailsIcon
                className={cn(isGridCompact ? 'h-4 w-4' : 'h-5 w-5')}
              />
            </div>
            Details
          </button>
        </div>
      </div>
      <div className="flex items-start justify-between pt-3.5">
        <div className="relative flex h-10 w-10 flex-shrink-0 4xl:h-9 4xl:w-9">
          <Image
            alt={title}
            layout="fill"
            quality={100}
            objectFit="contain"
            src={cover_photo || placeholder}
            className="rounded-full bg-light-500 dark:bg-dark-400"
          />
        </div>
        <div className="-mt-[1px] mr-auto flex flex-col truncate pl-2.5">
          <h3
            title={title}
            className="mb-0.5 whitespace-pre-wrap font-medium text-dark-100 dark:text-light"
          >
            <AnchorLink href={routes.productUrl(item_id)}>{title}</AnchorLink>
          </h3>
          <AnchorLink
            href={routes.shopUrl(item_id)}
            className="font-medium text-light-base hover:text-brand dark:text-dark-800 dark:hover:text-brand"
          >
            {/* <p dangerouslySetInnerHTML={{ __html: description }} className="truncate"></p> */}
            {restaurant_name}
          </AnchorLink>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end pl-2.5">
          <span className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:bg-dark-300 dark:text-brand-dark">
            £ {price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

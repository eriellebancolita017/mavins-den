import usePrice from '@/lib/hooks/use-price';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import type { Item } from '@/components/cart/lib/cart.utils';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useModalAction } from '@/components/modal-views/context';

export default function CartItem({
  name,
  item,
  notAvailable,
  closeDrawer,
}: {
  item: Item;
  notAvailable?: boolean;
  closeDrawer: () => void;
  name?: string;
}) {
  const {
    item_name,
    item_cover_photo,
    item_id,
    price,
    qty,
    restaurant_id,
    restaurant_name,
    total_price,
  } = item;
  const { price: itemPrice } = usePrice({
    amount: total_price! / qty!,
  });
  const { openModal } = useModalAction();
  return (
    <div className="flex w-full items-start gap-4 py-3">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 bg-light-300 dark:border-0 dark:bg-dark-500 xs:w-32">
        <Image
          alt={item_name}
          layout="fill"
          src={item_cover_photo ?? placeholder}
          objectFit="cover"
        />
      </div>
      <div className="w-[calc(100%-125px)] text-13px font-medium xs:w-[calc(100%-145px)] sm:w-[calc(100%-150px)]">
        {notAvailable && (
          <span className="mb-1 inline-block rounded-2xl text-xs font-semibold text-red-500">
            Not Available
          </span>
        )}
        <h3 className="truncate text-dark dark:text-light">
          <span
            onClick={() => {
              () => closeDrawer();
              openModal('PRODUCT_DETAILS', {
                item_id: item_id,
              });
            }}
            className="cursor-pointer transition-colors hover:text-brand-dark"
          >
            {item_name}
          </span>
        </h3>
        <p className="mt-1 mb-2.5 truncate">
          <AnchorLink
            href={routes.prepperUrl(restaurant_id!)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {name || restaurant_id}
          </AnchorLink>
        </p>
        <p className="flex items-center gap-1">
          <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
            {itemPrice}
          </span>
          <span className="text-light-base dark:text-dark-base">X {qty}</span>
        </p>
      </div>
    </div>
  );
}

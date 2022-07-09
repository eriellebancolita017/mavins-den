import usePrice from '@/lib/hooks/use-price';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import type { Item } from '@/components/cart/lib/cart.utils';
import placeholder from '@/assets/images/placeholders/product.svg';

export default function CartItem({
  item,
  notAvailable,
}: {
  item: Item;
  notAvailable?: boolean;
}) {
  const { name, image, slug, price, shop, quantity } = item;
  const { price: itemPrice } = usePrice({
    amount: price,
  });
  return (
    <div className="flex w-full items-start gap-4 py-3">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 bg-light-300 dark:border-0 dark:bg-dark-500 xs:w-32">
        <Image
          alt={name}
          layout="fill"
          src={image ?? placeholder}
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
          <AnchorLink
            href={routes.productUrl(slug)}
            className="transition-colors hover:text-brand-dark"
          >
            {name}
          </AnchorLink>
        </h3>
        <p className="mt-1 mb-2.5">
          <AnchorLink
            href={routes.shopUrl(shop.slug)}
            className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
          >
            {shop.name}
          </AnchorLink>
        </p>
        <p className="flex items-center gap-1">
          <span className="rounded-2xl bg-light-300 p-1.5 font-semibold uppercase leading-none text-brand-dark dark:bg-dark-500">
            {itemPrice}
          </span>
          <span className="text-light-base dark:text-dark-base">
            X {quantity}
          </span>
        </p>
      </div>
    </div>
  );
}

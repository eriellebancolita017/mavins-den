import cn from 'classnames';
import toast from 'react-hot-toast';
import { useCart } from '@/components/cart/lib/cart.context';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/cart-item';
import AnchorLink from '@/components/ui/links/anchor-link';

import routes from '@/config/routes';
export default function CartItemList({
  name,
  deliveryCharge,
  className,
  closeDrawer,
}: {
  name?: string;
  deliveryCharge?: number;
  className?: string;
  closeDrawer: () => void;
}) {
  const { items, order_pickup_date, clearItemFromCart } = useCart();
  function handleClearItemFromCart(id: number | string) {
    clearItemFromCart(id as string);
    // toast.success(<b>Successfully remove from the cart!</b>);
  }
  console.log('order date', order_pickup_date);
  return (
    <ul role="list" className={cn('-my-6 w-full', className)}>
      <div>
        {name && (
          <h2 className="mb-2 text-lg font-semibold">
            <AnchorLink
              href={routes.prepperUrl(items[0].restaurant_id!)}
              className="text-light-base transition-colors hover:text-brand-dark dark:text-dark-base"
            >
              {name}
            </AnchorLink>
          </h2>
        )}
        <p className="mb-1 truncate text-sm text-dark dark:text-light">
          Estimated delivery date: {order_pickup_date}
        </p>
        <p className="!mb-0.5 truncate text-sm text-dark dark:text-light">
          Delivery Charge: £{deliveryCharge?.toFixed(2)}
        </p>
      </div>
      <hr className="mb-4" />
      {items.map((item) => {
        return (
          <li
            key={item.item_id}
            className="relative ml-4 flex border-b border-light-300 last-of-type:border-b-0 dark:border-dark-500 xs:ml-6"
          >
            <button
              type="button"
              className="absolute -left-8 top-1/2 -mt-3.5 flex-shrink-0 p-2 font-medium text-dark-900 hover:text-dark dark:text-dark-800 dark:hover:text-light-900 xs:-left-10"
              onClick={() => handleClearItemFromCart(item.item_id as string)}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
            <CartItem
              item={item}
              notAvailable={false}
              closeDrawer={closeDrawer}
              name={name}
            />
          </li>
        );
      })}
    </ul>
  );
}

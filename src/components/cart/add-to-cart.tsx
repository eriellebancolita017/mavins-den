import { useState } from 'react';
import cn from 'classnames';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button';
import { useCart } from '@/components/cart/lib/cart.context';
import usePrice from '@/lib/hooks/use-price';
import type { Bundle, Product } from '@/types';
import { generateCartItem } from './lib/generate-cart-item';
import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
interface Props {
  item: Bundle;
  className?: string;
  toastClassName?: string;
}

export default function AddToCart({ item, className, toastClassName }: Props) {
  const { price, currency, item_options } = item;
  const { addItemToCart } = useCart();
  const [addToCartLoader, setAddToCartLoader] = useState(false);
  const [cartingSuccess, setCartingSuccess] = useState(false);
  const { closeModal } = useModalAction();
  const { view } = useModalState();

  function handleAddToCart() {
    addSuccessfully();
  }
  function addSuccessfully() {
    addItemToCart(generateCartItem(item), 1);
    if (view === 'OPTION_VIEW') closeModal();
  }

  function getAddonPrice() {
    let addonPrice = 0;
    if (item_options?.length! > 0) {
      item_options?.map((options) => {
        options.item_option_list.map((option: any) => {
          addonPrice += option.price || 0;
        });
      });
    }
    return addonPrice;
  }
  return (
    <Button
      onClick={() => handleAddToCart()}
      // isLoading={addToCartLoader}
      className={cn(
        'relative',
        cartingSuccess
          ? 'is-carting pointer-events-none cursor-not-allowed'
          : 'pointer-events-auto cursor-pointer',
        className
      )}
    >
      Add to Basket ( {currency} {(price + getAddonPrice()).toFixed(2)} )
      <svg
        viewBox="0 0 37 37"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-auto bottom-auto right-3 h-auto w-5 xs:right-4 xs:w-6"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.3"
          d="M30.5 6.5h0c6.6 6.6 6.6 17.4 0 24h0c-6.6 6.6-17.4 6.6-24 0h0c-6.6-6.6-6.6-17.4 0-24h0c6.6-6.7 17.4-6.7 24 0z"
          className="circle path"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.3"
          d="M11.6 20L15.9 24.2 26.4 13.8"
          className="tick path"
        />
      </svg>
    </Button>
  );
}

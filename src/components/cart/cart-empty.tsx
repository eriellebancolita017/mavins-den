import cn from 'classnames';
import { EmptyCartIcon } from '@/components/icons/empty-cart-icon';

interface Props {
  title?: string;
  description?: string;
  className?: string;
}

export default function CartEmpty({
  title = 'Your cart is empty',
  description = 'Please add product to your cart list',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center',
        className
      )}
    >
      <EmptyCartIcon className="h-[100px] w-[100px] flex-shrink-0 text-light-800 dark:text-dark-600" />
      <h4 className="mt-8 text-sm font-medium text-dark dark:text-light 3xl:mt-9">
        {title}
      </h4>
      <p className="mt-2 text-13px text-light-base dark:text-dark-800 md:mt-3">
        {description}
      </p>
    </div>
  );
}

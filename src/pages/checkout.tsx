import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import routes from '@/config/routes';
import GeneralLayout from '@/layouts/_general-layout';
import CartItemList from '@/components/cart/cart-item-list';
import CartEmpty from '@/components/cart/cart-empty';
import Button from '@/components/ui/button';
import PhoneInput from '@/components/ui/forms/phone-input';
import { useCart } from '@/components/cart/lib/cart.context';
import usePrice from '@/lib/hooks/use-price';
import Seo from '@/layouts/_seo';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import client from '@/data/client';
import { useMutation } from 'react-query';
import CartCheckout from '@/components/cart/cart-checkout';
import { useMe } from '@/data/user';

const CheckoutPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { me } = useMe();
  const {
    items,
    total,
    totalItems,
    isEmpty,
    setVerifiedResponse,
    verifiedResponse,
  } = useCart();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  const { mutate, isLoading } = useMutation(client.orders.verify, {
    onSuccess: (res) => {
      setVerifiedResponse(res);
    },
  });
  function verify() {
    mutate({
      amount: total,
      products: items.map((item) => ({
        product_id: item.id,
        order_quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      })),
    });
  }
  return (
    <>
      <Seo
        title="Checkout"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes?.checkout}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-sm flex-col p-4 pt-6 sm:p-5 sm:pt-8 md:pt-10 3xl:pt-12">
        {!isEmpty && Boolean(verifiedResponse) ? (
          <div className="mb-4 bg-light shadow-card dark:bg-dark-250 dark:shadow-none md:mb-5 3xl:mb-6">
            <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:py-5 sm:px-7 md:text-base">
              Contact Number
            </h2>
            <div className="px-5 py-4 sm:py-6 sm:px-7">
              <PhoneInput defaultValue={me?.profile?.contact} />
            </div>
          </div>
        ) : null}

        <div className="bg-light shadow-card dark:bg-dark-250 dark:shadow-none">
          <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:py-5 sm:px-7 md:text-base">
            Your Order
            <span className="font-normal text-dark-700">({totalItems})</span>
          </h2>
          <div className="px-5 pt-9 sm:px-7 sm:pt-11">
            {!isEmpty ? (
              <CartItemList className="pl-3" />
            ) : (
              <>
                <CartEmpty />
                <div className="sticky bottom-11 z-[5] mt-10 border-t border-light-400 bg-light pt-6 pb-7 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pt-8 sm:pb-9">
                  <Button
                    onClick={() => router.push(routes.home)}
                    className="w-full md:h-[50px] md:text-sm"
                  >
                    <LongArrowIcon className="h-4 w-4" />
                    Back To Home
                  </Button>
                </div>
              </>
            )}

            {!isEmpty && !Boolean(verifiedResponse) && (
              <div className="sticky bottom-11 z-[5] mt-10 border-t border-light-400 bg-light pt-6 pb-7 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pt-8 sm:pb-9">
                <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
                  <div className="flex justify-between">
                    <p>Sub Total</p>
                    <strong className="font-semibold">{totalPrice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax</p>
                    <strong className="font-semibold">
                      Calculated at checkout
                    </strong>
                  </div>
                </div>
                <Button
                  className="w-full md:h-[50px] md:text-sm"
                  onClick={verify}
                  isLoading={isLoading}
                >
                  Check Availability
                </Button>
              </div>
            )}
            {!isEmpty && Boolean(verifiedResponse) && <CartCheckout />}
          </div>
        </div>
      </div>
    </>
  );
};

CheckoutPage.authorization = true;
CheckoutPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export default CheckoutPage;

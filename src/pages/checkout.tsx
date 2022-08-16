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
import { useMutation, useQuery } from 'react-query';
import CartCheckout from '@/components/cart/cart-checkout';
import { useMe } from '@/data/user';
import { useUserContext } from '@/components/preppers/context';
import { useEffect, useState } from 'react';
import { VerifiedResponse } from '@/components/cart/lib/cart.utils';
import Input from '@/components/ui/forms/input';
import toast from 'react-hot-toast';
import cn from 'classnames';

const CheckoutPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { me } = useMe();
  const { userInfo } = useUserContext();
  const [couponValue, setCouponValue] = useState(0);
  const [couponInfo, setCouponInfo] = useState({});
  const [couponText, setCouponText] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);
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

  const { isLoading: loading, data: prepper } = useQuery(
    [items],
    () =>
      client.preppers.getDetails({
        restaurant_id: items[0].restaurant_id,
        consumer_id: '',
        latitude: 52.2880069,
        longitude: 0.0522349,
        code: 'EN',
        searchKey: '',
      }),
    {
      enabled: !isEmpty,
    }
  );

  const deliveryCharge = prepper?.payload.delivery_charge || 0;

  const { mutate, isLoading } = useMutation(client.orders.verify, {
    onSuccess: (res) => {
      setVerifiedResponse(res.payload);
    },
  });

  const { mutate: verifyCoupon, isLoading: verifying } = useMutation(
    client.orders.verifyCoupon,
    {
      onSuccess: (res: any) => {
        console.log('res', res);
        setCouponInfo(res.payload);
        setCouponValue(
          res.payload.discount_type === 'amount'
            ? res.payload.value
            : res.payload.discount_type === 'percentage'
            ? Math.min(
                res.payload.discount as number,
                res.payload.maximum_discount_value as number
              )
            : 0
        );
        setVerifySuccess(true);
        setTimeout(() => {
          setVerifySuccess(false);
        }, 2000);
        toast.success(<b>Successfully verified.</b>, {
          className: '-mt-10 xs:mt-0',
        });
      },
      onError: (error: any) => {
        toast.error(
          <b>
            {error.response?.data?.error?.message || 'Something went wrong'}
          </b>,
          {
            className: '-mt-10 xs:mt-0',
          }
        );
      },
    }
  );

  function verify() {
    if (total - me?.credit - couponValue + deliveryCharge < 0.3) {
      toast.error(
        <b>
          You need to order more than your credit amount. Your credit amount is:
          £{me.credit}
        </b>,
        {
          className: '-mt-10 xs:mt-0',
        }
      );
      return;
    }
    mutate({
      amount: +(
        (total - me?.credit - couponValue + deliveryCharge) *
        100
      ).toFixed(),
      consumer_id: userInfo.consumer_id,
      restaurant_id: items[0].restaurant_id!,
    });
  }

  const verifyCouponClick = () => {
    if (couponText)
      verifyCoupon({
        user_id: userInfo.consumer_id,
        coupon_code: couponText,
        amount: total,
        code: 'EN',
      });
  };
  useEffect(() => {
    return () => {
      setVerifiedResponse(null as unknown as VerifiedResponse);
    };
  }, []);
  return (
    <>
      <Seo
        title="Checkout"
        description="We partnered up with the best meal prep providers and meal delivery companies in the UK."
        url={routes?.checkout}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-sm flex-col p-4 pt-6 sm:p-5 sm:pt-8 md:pt-10 3xl:pt-12">
        {!isEmpty && Boolean(verifiedResponse) ? (
          <div className="mb-4 bg-light shadow-card dark:bg-dark-250 dark:shadow-none md:mb-5 3xl:mb-6">
            <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:py-5 sm:px-7 md:text-base">
              Contact Number
            </h2>
            <div className="px-5 py-4 sm:py-6 sm:px-7">
              <PhoneInput defaultValue={me?.mobile_country_code + me?.mobile} />
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
              <CartItemList
                closeDrawer={() => {}}
                deliveryCharge={deliveryCharge}
                name={prepper?.payload.name}
                className="pl-3"
              />
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
                <div className="flex items-end">
                  <Input
                    label="Enter coupon code below"
                    type="text"
                    className="mr-4 flex-1"
                    value={couponText}
                    onChange={(e) => setCouponText(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    onClick={verifyCouponClick}
                    isLoading={verifying}
                    disabled={!couponText}
                    className={cn(
                      'relative',
                      verifySuccess
                        ? 'is-carting pointer-events-none cursor-not-allowed'
                        : 'pointer-events-auto cursor-pointer',
                      'min-w-[140px]'
                    )}
                  >
                    Add
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
                </div>
                <hr className="my-6" />
                <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
                  <div className="flex justify-between">
                    <p>Sub Total</p>
                    <strong className="font-semibold">{totalPrice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <p>Delivery Charge</p>
                    <strong className="font-semibold">
                      £{deliveryCharge.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <p>Credit Amount</p>
                    <strong className="font-semibold">
                      £{me?.credit?.toFixed(2)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <p>Coupon Discount Amount</p>
                    <strong className="font-semibold">
                      £{couponValue.toFixed(2)}
                    </strong>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <p>Total</p>
                    <strong className="font-semibold">
                      £
                      {(
                        total -
                        (me?.credit || 0) -
                        couponValue +
                        deliveryCharge
                      ).toFixed(2)}
                    </strong>
                  </div>
                  {/* <div className="flex justify-between">
                    <p>Tax</p>
                    <strong className="font-semibold">
                      Calculated at checkout
                    </strong>
                  </div> */}
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
            {!isEmpty && Boolean(verifiedResponse) && (
              <CartCheckout
                priceInfo={{
                  total,
                  couponValue,
                  deliveryCharge,
                  credit: me?.credit,
                  couponInfo,
                }}
              />
            )}
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

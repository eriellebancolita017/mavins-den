/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import client from '@/data/client';
import usePrice from '@/lib/hooks/use-price';
import Button from '@/components/ui/button';
import { useCart } from '@/components/cart/lib/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/components/cart/lib/cart.utils';
import CartWallet from '@/components/cart/cart-wallet';
import { usePhoneInput } from '@/components/ui/forms/phone-input';
import {
  payableAmountAtom,
  useWalletPointsAtom,
  verifiedTokenAtom,
} from '@/components/cart/lib/checkout';
import StripePayment from '@/components/cart/payment/stripe';
import routes from '@/config/routes';
import { useUserContext } from '@/components/preppers/context';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { capitalizeFirstLetter } from '@/lib/utils';
import { HomeIcon } from '../icons/home-icon';
import { PurchaseIcon } from '../icons/purchase-icon';
import { LocationIcon } from '../icons/contact/location-icon';
import AddressAuto from '../auth/address-auto';
import Input from '../ui/forms/input';
import RadioButton from '../ui/forms/radio-button';
import * as fbq from '../../lib/fpixel';
import * as branchio from '../../lib/branchio';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import React, { useCallback } from 'react';

interface LastOrderProviderState {
  transactionTotal: number;
  transactionID: String;
  couponInfo: any;
}

export let lastOrder: LastOrderProviderState | undefined;

export const useCheckout = () => {
  return lastOrder;
};
export const clearLastOrder = () => {
  lastOrder = undefined;
};

export default function CartCheckout({ priceInfo }: { priceInfo: any }) {
  const router = useRouter();
  const { userInfo, location } = useUserContext();
  const [savedAddress, setSavedAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>({});
  const [showAll, setShowAll] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const {
    total,
    couponValue,
    credit,
    couponInfo,
    deliveryCharge,
    freeCheckout,
  } = priceInfo;

  const { mutate, isLoading } = useMutation(client.orders.create, {
    onSuccess: (res) => {
      //FB ANALYTICS
      fbq.event('Purchase', {
        currency: 'GBP',
        value: Math.max(total + deliveryCharge, 0),
      });

      // Branch IO
      branchio.logPurchaseEvent({
        transaction_id: res.payload.order_id,
        coupon: couponInfo.coupon_code,
        amount: Math.max(total + deliveryCharge, 0),
        // content_items: items,
      });

      // google analytics
      logEvent(analytics, 'purchase', {
        currency: 'GBP',
        value: Math.max(total + deliveryCharge, 0),
        transaction_id: res.payload.order_id,
      });
      if (couponInfo.coupon_code == undefined) {
        couponInfo.coupon_code = 'No Discount';
      }
      const lastOrderValue = {
        transactionTotal: Math.max(total + deliveryCharge, 0),
        transactionID: res.payload.order_id,
        couponInfo: couponInfo.coupon_code,
      };
      lastOrder = lastOrderValue;
      router.push(routes.orderUrl(res.payload.order_id));
    },
    onError: (err: any) => {
      toast.error(<b>Something went wrong! Contact support please.</b>);
      console.log(err.response.data.message);
    },
  });

  const { mutate: getAddressList } = useMutation(client.address.manageAddress, {
    onSuccess: (res) => {
      setSavedAddress(res.payload || []);
    },
  });

  const { mutate: updateAddress } = useMutation(client.address.manageAddress, {
    onSuccess: (res) => {
      toast.success(<b>Address Updated!</b>, {
        className: '-mt-10 xs:mt-0',
      });
      setSelectedAddress(res.payload[0]);
      getAddressList({
        consumer_id: userInfo.consumer_id,
        request_type: 'list',
        type: 'other',
        code: 'EN',
      });
    },
    onError: () => {
      toast.error(<b>Address Update Failed!</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
  });

  useEffect(() => {
    console.log('run address fetch');
    getAddressList({
      consumer_id: userInfo?.consumer_id,
      request_type: 'list',
      type: 'other',
      code: 'EN',
    });
  }, [userInfo?.consumer_id, getAddressList]);
  // const [use_wallet] = useAtom(useWalletPointsAtom);
  // const [payableAmount] = useAtom(payableAmountAtom);
  const [token] = useAtom(verifiedTokenAtom);
  const { items, verifiedResponse } = useCart();

  const available_items = items;

  function placeFreeOrder() {
    setPaymentSuccess(true);
  }

  useEffect(() => {
    function createOrder() {
      // if (
      //   (use_wallet && Boolean(payableAmount) && !token) ||
      //   (!use_wallet && !token)
      // ) {
      //   toast.error(<b>Please verify payment card</b>, {
      //     className: '-mt-10 xs:mt-0',
      //   });
      //   return;
      // }
      if (!phoneNumber) {
        toast.error(<b>Please enter your contact number</b>);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }

      mutate({
        code: 'EN',
        place_order_json: JSON.stringify({
          consumer_id: userInfo.consumer_id,
          coupon_id: couponInfo.coupon_id || '',
          coupon_discount: couponValue,
          coupon_type: couponInfo.discount_type || '',
          coupon_value: couponValue,
          credit_deduct_amount: credit,
          deliver_to: selectedAddress.address,
          deliver_to_latitude: selectedAddress.latitude,
          deliver_to_longitude: selectedAddress.longitude,
          delivery_fee: deliveryCharge,
          discount_type: 'percentage',
          discount_value: 0.0,
          floor: selectedAddress.floor || 0,
          food_allergies_note: '',
          gross_amount: Math.max(total + deliveryCharge, 0.0).toString(),
          code: 'EN',
          address_title: '',
          address_type: selectedAddress.type || 'other',
          landmark: ' ',
          net_amount: Math.max(
            +(total - credit - couponValue + deliveryCharge),
            0.0
          ).toFixed(2),
          restaurant_discount: 0.0,
          restaurant_id: items[0].restaurant_id,
          special_instruction: deliveryInstructions,
          tax_details: [],
          total_tax_amount: 0.0,
        }),
      });
    }

    if (paymentSuccess) createOrder();
  }, [paymentSuccess]);

  // const { price: tax } = usePrice(
  //   verifiedResponse && {
  //     amount: verifiedResponse.total_tax ?? 0,
  //   }
  // );

  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: base_amount,
    }
  );

  const { phoneNumber } = usePhoneInput();

  const cancelAddress = () => {
    setSelectedAddress({});
    setAddNew(false);
  };

  const addressUpdate = () => {
    updateAddress({
      consumer_id: userInfo.consumer_id,
      request_type: 'update',
      type: selectedAddress.type,
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      address: selectedAddress.address,
      floor: selectedAddress.floor,
      landmark: '',
      title: '',
      address_id: selectedAddress.address_id,
      code: 'EN',
    });
  };

  const addNewAddress = () => {
    updateAddress({
      consumer_id: userInfo.consumer_id,
      request_type: 'add',
      type: selectedAddress.type || 'other',
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
      address: selectedAddress.address,
      floor: selectedAddress.floor || 0,
      landmark: '',
      title: '',
      code: 'EN',
    });
  };
  return (
    <div className="mt-10 border-t border-light-400 bg-light pt-6 pb-7 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pt-8 sm:pb-9">
      <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
        <div className="flex justify-between">
          <p>Sub Total</p>
          <strong className="font-semibold">£{total.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <p>Delivery Charge</p>
          <strong className="font-semibold">
            £{deliveryCharge.toFixed(2)}
          </strong>
        </div>
        <div className="flex justify-between">
          <p>Credit Amount</p>
          <strong className="font-semibold">£{credit.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <p>Coupon Discount Amount</p>
          <strong className="font-semibold">£{couponValue.toFixed(2)}</strong>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Total</p>
          <strong className="font-semibold">
            £
            {Math.max(
              total - credit - couponValue + deliveryCharge,
              0.0
            ).toFixed(2)}
          </strong>
        </div>
      </div>

      <p className="!mb-4 text-base font-medium text-dark dark:text-light">
        Select delivery address
      </p>
      {!!savedAddress.length ? (
        <div className="mb-3 space-y-2">
          {savedAddress.map((address: any, index) => (
            <div
              key={address.address_id}
              className={classNames(
                'flex cursor-pointer items-center justify-between rounded-md border p-3 hover:border-brand-dark',
                selectedAddress.address_id === address.address_id
                  ? 'border-brand'
                  : 'border-gray-300',
                index > 1 &&
                  !showAll &&
                  selectedAddress.address_id !== address.address_id &&
                  'hidden'
              )}
              onClick={() => setSelectedAddress(address)}
            >
              <div>
                <div
                  className={classNames(
                    'text-sm font-medium transition-colors',
                    selectedAddress.address_id === address.address_id
                      ? 'text-brand'
                      : 'text-dark dark:text-light'
                  )}
                >
                  {address.address}
                </div>
                {/* <div className="my-1 text-[11px]">
                  latitude: {address.latitude}, longitude: {address.longitude}
                </div>
                <div className="text-xs font-bold">
                  floor: {address.floor || '--'}
                </div> */}
              </div>
              <p
                className={classNames(
                  'flex items-center transition-colors',
                  selectedAddress.address_id === address.address_id
                    ? 'text-brand'
                    : 'text-dark dark:text-light'
                )}
              >
                <div className="mr-2 h-5 w-5">
                  {address.type === 'home' ? (
                    <HomeIcon />
                  ) : address.type === 'work' ? (
                    <PurchaseIcon />
                  ) : (
                    <LocationIcon />
                  )}
                </div>
                {capitalizeFirstLetter(address.type)}
              </p>
            </div>
          ))}
          {savedAddress.length > 2 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="float-right !mb-3 inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      ) : (
        <div>
          <hr className="my-4" />
          No saved addresses
          <hr className="my-4" />
        </div>
      )}

      {!addNew ? (
        <Button
          variant="outline"
          className="mb-6 w-full"
          onClick={() => setAddNew(!addNew)}
        >
          Add or Update Address
        </Button>
      ) : (
        <div className="my-6 w-full">
          <p className="!mb-2 text-base font-medium text-dark dark:text-light">
            Add your address
          </p>
          <AddressAuto onSelect={(val) => setSelectedAddress(val)} />
          <hr className="my-4" />
          <Input
            label="Address"
            inputClassName="bg-light dark:bg-dark-300"
            type="text"
            value={selectedAddress.address}
            onChange={(e) =>
              setSelectedAddress({
                ...selectedAddress,
                address: e.target.value,
              })
            }
            disabled={!selectedAddress.longitude}
          />
          {/* <div className="my-4 flex flex-col gap-5 sm:flex-row">
            <Input
              label="Latitude"
              inputClassName="bg-light-100 dark:bg-dark-100"
              className="flex-1"
              type="text"
              value={selectedAddress.latitude}
              onChange={(e) =>
                setSelectedAddress({
                  ...selectedAddress,
                  latitude: e.target.value,
                })
              }
              disabled={true}
            />
            <Input
              label="Longitude"
              inputClassName="bg-light-100 dark:bg-dark-100"
              className="flex-1"
              type="text"
              value={selectedAddress.longitude}
              onChange={(e) =>
                setSelectedAddress({
                  ...selectedAddress,
                  longitude: e.target.value,
                })
              }
              disabled={true}
            />
          </div> */}
          <div className="mt-4 flex flex-col gap-5 sm:flex-row">
            {/* <Input
              label="Floor"
              inputClassName="bg-light dark:bg-dark-300"
              className="flex-1"
              type="number"
              value={selectedAddress.floor}
              onChange={(e) =>
                setSelectedAddress({
                  ...selectedAddress,
                  floor: e.target.value,
                })
              }
            /> */}
            <div className="flex-1"></div>
            <div className="flex flex-1 flex-col items-start gap-y-2">
              <RadioButton
                name="home"
                label="Home"
                onChange={() =>
                  setSelectedAddress({ ...selectedAddress, type: 'home' })
                }
                checked={selectedAddress.type === 'home'}
              />
              <RadioButton
                name="work"
                label="Work"
                onChange={() =>
                  setSelectedAddress({ ...selectedAddress, type: 'work' })
                }
                checked={selectedAddress.type === 'work'}
              />
              <RadioButton
                name="other"
                label="Other"
                onChange={() =>
                  setSelectedAddress({ ...selectedAddress, type: 'other' })
                }
                checked={selectedAddress.type === 'other'}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" onClick={cancelAddress}>
              Cancel
            </Button>
            <div className="sm:ml-auto">
              {selectedAddress.address_id ? (
                <Button
                  variant="outline"
                  onClick={addressUpdate}
                  className="w-full sm:w-auto"
                >
                  Update Address
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled={!selectedAddress.latitude}
                  onClick={addNewAddress}
                  className="w-full sm:w-auto"
                >
                  Add as New Address
                </Button>
              )}
            </div>
          </div>
          <hr className="mt-6" />
        </div>
      )}
      <Input
        label="Do you have any special requests or want to provide any delivery instructions?"
        type="text"
        className="my-2 mr-4 flex-1"
        value={deliveryInstructions}
        onChange={(e) => setDeliveryInstructions(e.target.value)}
      />
      {Object.keys(selectedAddress).length !== 0 && !freeCheckout && (
        <StripePayment setPaymentSuccess={setPaymentSuccess} />
      )}
      {Object.keys(selectedAddress).length !== 0 && freeCheckout && (
        <Button
          className="w-full md:h-[50px] md:text-sm"
          disabled={!selectedAddress.latitude}
          onClick={placeFreeOrder}
        >
          Place Order (No payment required)
        </Button>
      )}

      {/* <Button
        disabled={!token || !selectedAddress}
        isLoading={isLoading}
        onClick={createOrder}
        className="w-full md:h-[50px] md:text-sm"
      >
        Place Order
      </Button> */}
    </div>
  );
}

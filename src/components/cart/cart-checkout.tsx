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

export default function CartCheckout() {
  const router = useRouter();
  const { mutate, isLoading } = useMutation(client.orders.create, {
    onSuccess: (res) => {
      router.push(routes.orderUrl(res.payload.order_id));
    },
    onError: (err: any) => {
      toast.error(<b>Something went wrong!</b>);
      console.log(err.response.data.message);
    },
  });
  const { userInfo, location } = useUserContext();
  // const [use_wallet] = useAtom(useWalletPointsAtom);
  // const [payableAmount] = useAtom(payableAmountAtom);
  const [token] = useAtom(verifiedTokenAtom);
  const { items, verifiedResponse } = useCart();

  const available_items = items;

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
  const totalPrice = verifiedResponse ? base_amount : 0;
  const { price: total } = usePrice(
    verifiedResponse && {
      amount: +totalPrice,
    }
  );
  const { phoneNumber } = usePhoneInput();
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
        coupon_id: '',
        coupon_discount: 0,
        coupon_type: '',
        coupon_value: 0,
        credit_deduct_amount: 0.0,
        deliver_to: location.address,
        deliver_to_latitude: location.latitude,
        deliver_to_longitude: location.longitude,
        // "deliver_to": '86 Paul Stret London',
        // "deliver_to_latitude": 51.9304799,
        // "deliver_to_longitude": -0.5894157,
        delivery_fee: 0.0,
        discount_type: 'percentage',
        discount_value: 0.0,
        floor: '',
        food_allergies_note: '',
        gross_amount: base_amount.toString(),
        code: 'EN',
        address_title: '',
        address_type: 'home',
        landmark: ' ',
        net_amount: base_amount,
        restaurant_discount: 0.0,
        restaurant_id: items[0].restaurant_id,
        // "restaurant_id": "RES1655826172HZA99933",
        special_instruction: '',
        tax_details: [],
        total_tax_amount: 0.0,
      }),
    });
  }
  return (
    <div className="mt-10 border-t border-light-400 bg-light pt-6 pb-7 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pt-8 sm:pb-9">
      <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
        <div className="flex justify-between">
          <p>Total</p>
          <strong className="font-semibold">{sub_total}</strong>
        </div>
        {/* <div className="flex justify-between">
          <p>Tax</p>
          <strong className="font-semibold">{tax}</strong>
        </div> */}
        {/* <div className="mt-4 flex justify-between border-t border-light-400 pt-5 dark:border-dark-400">
          <p>Total</p>
          <strong className="font-semibold">{total}</strong>
        </div> */}
      </div>

      {/* {verifiedResponse && (
        <CartWallet
          totalPrice={totalPrice}
          walletAmount={verifiedResponse.wallet_amount}
          walletCurrency={verifiedResponse.wallet_currency}
        />
      )} */}

      <StripePayment />

      <Button
        disabled={isLoading || !token}
        isLoading={isLoading}
        onClick={createOrder}
        className="w-full md:h-[50px] md:text-sm"
      >
        Place Order
      </Button>
    </div>
  );
}

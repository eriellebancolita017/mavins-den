import { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import getStripe from '@/lib/get-stripejs';
import Button from '@/components/ui/button';
import { verifiedTokenAtom } from '@/components/cart/lib/checkout';
import { useCart } from '@/components/cart/lib/cart.context';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

const StripeForm = ({ setPaymentSuccess }: any) => {
  const stripe = useStripe();
  const [loadingStripe, setLoadingStripe] = useState(false);
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [_, setVerifiedToken] = useAtom(verifiedTokenAtom);
  const { verifiedResponse } = useCart();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    // Block native form submission.
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);
    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)!;
    // Use your card Element with other Stripe.js APIs
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://shop.marvinsden.com/purchases',
      },
      redirect: 'if_required',
    });

    if (error) {
      setLoading(false);
      toast.error(<b>{error.message}</b>, {
        className: '-mt-10 xs:mt-0',
      });
      return;
    } else {
      toast.success(<b>Confirmation Done!</b>, {
        className: '-mt-10 xs:mt-0',
      });
      setPaymentSuccess(true);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mb-5 flex flex-col rounded-lg border-light-500 dark:border-dark-500 xs:mb-7 xs:border xs:p-5"
    >
      <PaymentElement className="h-[280px] min-h-[260px] overflow-auto object-contain" />

      <Button
        type="submit"
        isLoading={loading}
        disabled={!stripe}
        className="StripePay ms-auto mt-2 bg-indigo-600 transition-colors hover:bg-indigo-700 focus:bg-indigo-700 xs:mt-3"
      >
        Place Order
      </Button>
    </form>
  );
};

const currency = 'GBP';
const style = { layout: 'horizontal', tagline: 'false' };

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({
  currency,
  showSpinner,
  setPaymentSuccess,
  amount,
}) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component

  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function () {
            setPaymentSuccess(true);
          });
        }}
      />
    </>
  );
};

const PaypalForm = ({ setPaymentSuccess, amount }: any) => {
  {
    return (
      <div style={{ maxWidth: '750px' }}>
        <PayPalScriptProvider
          options={{
            'client-id': process.env.NEXT_PUBLIC_PAYPAL_KEY,
            components: 'buttons',
            currency: 'GBP',
          }}
        >
          <ButtonWrapper
            currency={currency}
            showSpinner={false}
            setPaymentSuccess={setPaymentSuccess}
            amount={amount}
          />
        </PayPalScriptProvider>
      </div>
    );
  }
};

export default function StripePayment({
  setPaymentSuccess,
  verifiedResponse,
  amount,
}: any) {
  return (
    <div>
      <PaypalForm setPaymentSuccess={setPaymentSuccess} amount={amount} />
      <Elements
        stripe={getStripe()}
        options={{ clientSecret: verifiedResponse!.clientSecret }}
      >
        <StripeForm setPaymentSuccess={setPaymentSuccess} />
      </Elements>
    </div>
  );
}

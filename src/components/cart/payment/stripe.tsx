import { useState } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAtom } from 'jotai';
import toast from 'react-hot-toast';
import getStripe from '@/lib/get-stripejs';
import Button from '@/components/ui/button';
import { verifiedTokenAtom } from '@/components/cart/lib/checkout';
import { useCart } from '@/components/cart/lib/cart.context';

const StripeForm: React.FC = () => {
  const stripe = useStripe();
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
    const payload = await stripe.confirmCardPayment(
      verifiedResponse!.clientSecret,
      // "pi_3LRLNbFf8reu2sN81WWRVDgT_secret_DVVYGpepKml0JsBCSmwgeg83D",
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (payload.error) {
      setLoading(false);
      toast.error(<b>{payload.error.message}</b>, {
        className: '-mt-10 xs:mt-0',
      });
      return;
    } else {
      setVerifiedToken(payload.paymentIntent.receipt_email);
      toast.success(<b>Confirmation Done!</b>, {
        className: '-mt-10 xs:mt-0',
      });
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mb-5 flex flex-col rounded-lg border-light-500 dark:border-dark-500 xs:mb-7 xs:border xs:p-5"
    >
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '13px',
            },
          },
        }}
      />
      <Button
        type="submit"
        isLoading={loading}
        disabled={!stripe}
        className="StripePay ms-auto mt-2 bg-indigo-600 transition-colors hover:bg-indigo-700 focus:bg-indigo-700 xs:mt-3"
      >
        Confirm
      </Button>
    </form>
  );
};

export default function StripePayment() {
  return (
    <Elements stripe={getStripe()}>
      <StripeForm />
    </Elements>
  );
}

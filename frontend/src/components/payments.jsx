import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { HashLoader } from 'react-spinners';
export const StripePaymentPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const redirectToCheckout = async () => {
      const stripe = await loadStripe('pk_test_51NGYDuCZYEjq9G2uxPaav5ZKYWVuVhhzrPPQDKBlUfJT8EhSfsCdq3GsVxPz012amQ904zC0lLuFrpktDrFGsJ7f006j7FHyhK');
      try {
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
        if (error) {
          console.error('Error redirecting to Stripe Checkout:', error);
        }
      } catch (error) {
        console.error('Error redirecting to Stripe Checkout:', error);
      }
    };
    if (sessionId) {
      redirectToCheckout();
    }
  }, [sessionId]);

  return <div> 
<HashLoader color="#0E100F" />  <p className='font-bold '>Redirecting to Stripe Checkout...</p></div>;
};

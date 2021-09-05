/* eslint-disable no-console */
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import nProgress from 'nprogress';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import StyledSickButton from './styles/SickButton';
import { useCart } from '../lib/useCart';
import { GET_USER_QUERY } from './User';

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const StyledCheckout = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;

  p {
    font-size: 12px;
  }
`;

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: GET_USER_QUERY }],
  });

  useLayoutEffect(() => {
    if (loading) {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Create the payment method via stripe (Token comes back here if successful)
    const { stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    // Handle any errors from stripe
    if (stripeError || !paymentMethod) {
      setError(stripeError || { message: 'There was an error processing your payment' });
      setLoading(false);
      return; // stops the checkout from happening
    }

    console.log(paymentMethod);

    // Send the token from step 3 to our keystone server, via a custom mutation!
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    }).catch(console.error);

    if (!order) {
      setLoading(false);
      return;
    }

    console.log(`Finished with the order!!`, { order });
    // Change the page to view the order
    router.push({
      pathname: `/order/[id]`,
      query: {
        id: order.data.checkout.id,
      },
    });
    closeCart();
    setLoading(false);
  }

  return (
    <StyledCheckout onSubmit={handleSubmit}>
      {error ? <p>{error.message}</p> : null}
      {graphQLError ? <p>{graphQLError.message}</p> : null}
      <CardElement />
      <StyledSickButton disabled={loading}>Check Out Now</StyledSickButton>
    </StyledCheckout>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

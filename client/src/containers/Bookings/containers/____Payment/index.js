// import React, { useEffect, useState } from 'react';
// import IdealBankForm from './IdealBankForm';
// import { getPaymentIntent } from '../../redux/payment/actions';
// import { useStripe, useElements, IdealBankElement } from '@stripe/react-stripe-js';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';

// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import ItemContent from '../../components/ItemContent';

// import { IdealBankElement } from '@stripe/react-stripe-js';
// import '../../style/IdealBankSectionStyles.css';

// const options = {
//   // Custom styling can be passed to options when creating an Element
//   style: {
//     base: {
//       padding: '10px 12px',
//       color: '#32325d',
//       fontSize: '16px',
//       '::placeholder': {
//         color: '#aab7c4',
//       },
//     },
//   },
// };

// function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
//   const dispatch = useDispatch();
//   const { data } = useSelector((state) => state.payment);
//   const [clientSecret, setClientSecret] = useState('');

//   useEffect(() => {
//     if (data) {
//       const { client_secret } = data || {};
//       setClientSecret(client_secret);
//     }
//   }, [data]);

//   useEffect(() => {
//     dispatch(getPaymentIntent(3));
//   }, [dispatch]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     const idealBank = elements.getElement(IdealBankElement);

//     const result = await stripe.confirmIdealPayment(clientSecret, {
//       payment_method: {
//         ideal: idealBank,
//         billing_details: {
//           name: 'Cat Owner Name',
//         },
//       },

//       return_url: 'https://localhost:3000/checkout/complete',
//     });

//     if (result.error) {
//       console.log({ error: result.error });
//     } else {
//       if (result.paymentIntent.status === 'succeeded') {
//         //https://stripe.com/docs/connect/enable-payment-acceptance-guide
//         alert('success');
//       }
//     }
//   };

//   return (
//     <div style={{ maxWidth: 900, margin: '50px auto', textAlign: 'left' }}>
//       <ItemContent />
//       <hr style={{ margin: '30px 0' }} />

//       <form onSubmit={handleSubmit}>
//         <label>
//           <h6 style={{ marginBottom: 15 }}>iDEAL Bank</h6>
//           <IdealBankElement className="IdealBankElement" options={options} />
//         </label>

//         <br />
//         <br />

//         <button type="submit" disabled={!stripe} className="IdealBankPayButton">
//           Pay
//         </button>
//       </form>
//     </div>
//   );
// }

// const stripePromise = (accountId) =>
//   loadStripe(process.env.REACT_APP_STRIPE_API_KEY, { stripeAccount: accountId });

// function Payment() {
//   const { stripeAccountId } = useLocation().state || {};

//   useEffect(() => {
//     console.log({ stripeAccountId });
//   }, [stripeAccountId]);

//   return (
//     <Elements stripe={stripePromise(stripeAccountId)}>
//       <CheckoutForm />
//     </Elements>
//   );
// }

// export default Payment;

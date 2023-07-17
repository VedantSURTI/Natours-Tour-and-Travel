import axios from 'axios';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51NSxGmSAjIvb0Dks3YBOCVdGDcMm1qBdJ13kT6sg5fxJ719LYbib1Hr7t07TOJnvBui0rwO69EHvQHJ6wzw4H1o400g56TsEnI'
  );
  try {
    // Get checkout session
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    alert(err);
  }
  // Create a checkout form + charge credit card
};

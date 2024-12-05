import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from "@stripe/stripe-js";

const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
);

export default stripePromise;

import { loadStripe } from "@stripe/stripe-js"; // yarn add @stripe/stripe-js

export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);// NEXT_PUBLIC é a forma de deicxar a chave acessivel no front

  return stripeJs;
}
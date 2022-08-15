import { useSession, signIn } from 'next-auth/react';
import { api } from "../../services/api";
import { useRouter } from 'next/router';
import { getStripeJs } from "../../services/stripe-js";// yarn add @stripe/stripe-js
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
    priceId: string;
  }
  
  export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();

   async  function handleSubscribe() {
      // se não houver sessão -> autenticar
      if (!session) {
        signIn('github')
        return;
      }
      if (session.activeSubscription) {
        router.push("/posts")
        return;
      }

  
       // criação da checkout session
    try {
      // subscribe = nome do arquivo
      const response = await api.post('/subscribe', {
        user: session.user
        })

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
    }
  
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
import { GetServerSideProps } from "next";
import Head from "next/head";// tudo que for feita aqui vai ser refletido no head do _document
import Image from "next/image";
import { Stripe } from "stripe"; // yarn add stripe
import avatarImg from "../../public/images/avatar.svg";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Início | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>        
        <Image src={avatarImg} alt="Girl coding" />
      </main>
    </>
  )
}

// executado na camada de node.js do next precisa sempre ser feito em um pagina e não em um componente
// ppassa do pagina paa o componete e não do componente para a pagina
export const getServerSideProps: GetServerSideProps = async () => {
  // retrieve -> busca apenas um
  const price = await stripe.prices.retrieve("price_1LSQ14KmogR6ERdPXCqIdGar");
  
console.log(price)
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100), // divide por 100 pq vem em centavos
  };

  return {
    props: {
      product,
    },
  };
};

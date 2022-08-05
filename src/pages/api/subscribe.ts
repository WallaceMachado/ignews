import { NextApiRequest, NextApiResponse } from "next";
import { query as q } from "faunadb";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

import { fauna } from "../../services/fauna";
import { query } from "faunadb";

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

// lugares seguros para gerar checkou session, como faz a partir do click do usuário melhor ser aqui
// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes

//https://dashboard.stripe.com/settings/account - caso erro abaixo, só entrar e colocar qualquer nome e salval
//error - Error: In order to use Checkout, you must set an account or business name at https://dashboard.stripe.com/account.

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // verifica se método da request é POST ("criando")
  if (req.method === "POST") {
    // backend consegue pegar sessão do usuário através de cookies (req), se tivesse salvo no localstorage não seria cessivel
    const session  = await req.body.user;

    const user = await fauna.query<User>(
        q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.email)))
      );
  
      let customerId = user.data.stripe_customer_id;
  
      // se não existir
      if (!customerId) {

    const stripeCustomer = await stripe.customers.create({
      email: session.email,
    });

    // salva customer no banco
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      // reatribui customer na variável
      customerId = stripeCustomer.id;
    }

    // informações para criação do checkout
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1LSQ14KmogR6ERdPXCqIdGar", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,

      // quando der sucesso ou falha, onde redirecionar
      success_url: process.env.STRIPE_SUCCESS_URL, //http://localhost:3000/posts
      cancel_url: process.env.STRIPE_CANCEL_URL, //http://localhost:3000
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
}
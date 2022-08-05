import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

// lugares seguros para gerar checkou session, como faz a partir do click do usuário melhor ser aqui
// getServerSideProps (SSR)
// getStaticProps (SSG)
// API routes

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // verifica se método da request é POST ("criando")
  if (req.method === "POST") {
    // backend consegue pegar sessão do usuário através de cookies (req), se tivesse salvo no localstorage não seria cessivel
    const session = await getSession({ req });

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email,
    });

    // informações para criação do checkout
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1Kgc7nGHxfJecL8MmyS7kfbV", quantity: 1 }],
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
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";// key  123456

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

//comando para iniciar webhooks - ./stripe listen --forward-to localhost:3000/api/webhooks

// webhooks é um desing parttner usado na web
//é quando estamos usando uma app terceiro, neste caso o stripe, acontece um erro 
// e o stripe avisa do erro, por exemplo erro no pagamento
// uma forma d efazer isso é disponibilizar uma rota hhtp para recebimento de erros
async function buffer(readable: Readable) {
  // pedaços da stream
  const chunks = [];

  // recebendo valor de requisição -> salvando em chunk
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  // faz merge de Buffer e chunks
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false, // desabilitar o entendimento padrõ do next do que está vindo na requisição
  },
};

// quais eventos enviados pelo stripe são relevantes para nossa app
// eventos a serem ouvidos
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async function webhooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      // construir objeto de evento
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      // bad request
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
           // entidade subscriptions
           case "customer.subscription.updated":
            case "customer.subscription.deleted":
              const subscription = event.data.object as Stripe.Subscription;
  
              await saveSubscription(
                subscription.id,
                subscription.customer.toString(),
                false
              );
  
              break;
  
            // entidade session
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );

            break;
          default:
            throw new Error("Unhandled event.");
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Webhook handler failed." });
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method now allowed");
  }
}
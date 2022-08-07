import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";// key  123456

import { stripe } from "../../services/stripe";

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
const relevantEvents = new Set(["checkout.session.completed"]);

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
      console.log("Evento recebido", event);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method now allowed");
  }
}
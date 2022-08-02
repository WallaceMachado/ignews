import Stripe from "stripe";// yarn add stripe
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  // versão da api
  apiVersion: '2022-08-01',

  // metadados da aplicação
  appInfo: {
    name: "Ignews",
    version: "0.1.0"
  },
});
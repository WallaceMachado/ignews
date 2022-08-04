import { Client } from "faunadb"; // yarn add faunadb

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  domain: "db.us.fauna.com",
});
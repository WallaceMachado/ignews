import { query as q } from "faunadb";
import  NextAuth, { Account, Profile, User }  from "next-auth";// yarn add next-auth // yarn add @types/next-auth -D
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";

// interface signInProps {
//   user: User;
//   account: Account;
//   profile: Profile;
//   email: {
//         verificationRequest?: boolean;
//     };
// }

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
   // funções executadas automaticamente quando acontece alguma ação
   callbacks: {
    // async signIn( { user, account, profile}: signInProps ) {
    async signIn({ user, account, profile }): Promise<boolean> {

      const { email } = user;

      try {
        await fauna.query(q.Create(q.Collection("users"), { data: { email } }));

        // true = login deu certo
        return true;

      } catch {

        // false = login deu errado
        return false;
      }
    },
  },
  });
// AppProps -> propriedades que o componente pode receber
import { AppProps } from "next/app";
import { SessionProvider as NextAuthProvider } from "next-auth/react"; // para que possa compartilhar dados doa sessao do usuario
import "../styles/global.scss";
import { Header } from '../components/Header';

// AppProps -> propriedades que o componente pode receber
// App é carregado completamente toda vez que usuário troca de tela
function MyApp({ Component, pageProps }: AppProps) {
  return (
   
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
   
  );

}

export default MyApp

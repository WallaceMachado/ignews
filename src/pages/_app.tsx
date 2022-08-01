// AppProps -> propriedades que o componente pode receber
import { AppProps } from "next/app";
import "../styles/global.scss";

// AppProps -> propriedades que o componente pode receber
// App é carregado completamente toda vez que usuário troca de tela
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp

import Document, { Head, Html, Main, NextScript } from "next/document";


// deve extender Document do next, ele só carrega uma vex na aplicação e toda vez que o usuário acessa 
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
         <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet"/>
          <link rel="shortcut icon" href="/favicon.png" type="image/png" />          
        </Head>
        <body>
          <Main />
          <NextScript/> 
        </body>
      </Html> 
    
    )
  }
}
import { Html, Head, Main, NextScript } from 'next/document';


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-sans antialiased">
        <ColorModeScript initialColorMode="light" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
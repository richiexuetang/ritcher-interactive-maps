import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link
          rel='preload'
          href='/fonts/inter-var-latin.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/fonts/tw3-Regular.ttf'
          as='font'
          type='font/ttf'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/fonts/HyliaSerifBeta-Regular.otf'
          as='font'
          type='font/otf'
          crossOrigin='anonymous'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

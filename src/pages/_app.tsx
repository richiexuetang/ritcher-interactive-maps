import { AppProps } from 'next/app';
import localFont from 'next/font/local';

import '@/styles/globals.css';
import '@/styles/colors.css';

import { AppProvider } from '@/lib/context/app-context';

const hylia = localFont({
  src: [
    {
      path: '../../public/fonts/HyliaSerifBeta-Regular.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-hylia',
});

const witcher = localFont({
  src: [
    {
      path: '../../public/fonts/tw3-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-witcher',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${hylia.variable} ${witcher.variable}`}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </div>
  );
}

export default MyApp;

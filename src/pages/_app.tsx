import { AppProps } from 'next/app';
import localFont from 'next/font/local';

import '@/styles/globals.css';
import '@/styles/colors.css';

import { ThemeContextProvider } from '@/context/themeContext';

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
      path: '../../public/fonts/Mason-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-witcher',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <div
        className={`font-primary ${witcher.variable} ${hylia.variable} font-witcher bg-primary-300 dark:bg-primary-500`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeContextProvider>
  );
}

export default MyApp;

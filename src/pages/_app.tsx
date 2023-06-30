import { AppProps } from 'next/app';

import '@/styles/globals.css';
import '@/styles/colors.css';

import { ThemeContextProvider } from '@/context/themeContext';

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}

export default App;

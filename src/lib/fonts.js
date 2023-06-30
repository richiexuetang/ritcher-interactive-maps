import localFont from 'next/font/local';

import logger from '@/lib/logger';

export const hyliaRegular = localFont({
  src: [
    {
      path: '../../public/fonts/HyliaSerifBeta-Regular.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-hyliaRegular',
});

export const masonRegular = localFont({
  src: [
    {
      path: '../../public/fonts/Mason-Regular.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-masonRegular',
});

export const getFontClassName = (font) => {
  switch (font) {
    case 'hyliaRegular':
      return hyliaRegular.className;
    case 'masonRegular':
      return masonRegular.className;
    default:
      logger(`${font} does not have a corresponding font`);
  }
};

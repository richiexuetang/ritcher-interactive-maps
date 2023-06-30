import Link from 'next/link';
import * as React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import IconButton from '@/components/buttons/IconButton';
import NextImage from '@/components/NextImage';

import ThemeContext from '@/context/themeContext';

export default function Header() {
  const themeCtx: { isDarkTheme?: boolean; toggleThemeHandler: () => void } =
    React.useContext(ThemeContext);

  const toggleThemeHandler = () => {
    themeCtx.toggleThemeHandler();
  };

  const [theme] = useLocalStorageState('isDarkTheme', { defaultValue: true });

  return (
    <header className='white-filter dark:dark-filter bg-primary-300 dark:bg-primary-400 border-b-primary-300 sticky top-0 z-50'>
      <div className='dark:bg-primary-600 flex w-full items-center justify-between bg-stone-200 px-2 py-4 backdrop-blur-sm md:px-20'>
        <div>
          <Link className='flex items-center' href='/'>
            <NextImage
              useSkeleton
              alt='logo'
              src='https://i.ibb.co/yn9gLk3/app-logo.png'
              width={250}
              height={50}
            />
          </Link>
        </div>
        <IconButton
          className='mr-2 rounded bg-zinc-800 px-2 py-1 text-white dark:bg-zinc-200 dark:text-black sm:px-5 sm:py-2.5'
          onClick={toggleThemeHandler}
          icon={theme ? FiSun : FiMoon}
        />
      </div>
    </header>
  );
}

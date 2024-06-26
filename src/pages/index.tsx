import { useRouter } from 'next/router';
import * as React from 'react';

import { gamesData } from '@/data/config/gameConfig';

import Footer from '@/components/layout/Footer';
import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    router.push('game/' + path);
  };

  return (
    <Layout>
      <Seo />

      <main>
        <section className='bg-primary-300 dark:bg-primary-500'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-between py-12 text-center'>
            <div className='mt-4 flex h-screen flex-wrap hover:cursor-pointer'>
              {gamesData.map((data) => {
                return (
                  <div
                    key={data.name}
                    className='font-primary mx-2 flex flex-col'
                    onClick={(e) => handleNavigation(e, data.path)}
                  >
                    <NextImage
                      useSkeleton
                      className='w-60 hover:cursor-pointer md:w-64 '
                      src={data.imagePath}
                      width='256'
                      height='256'
                      alt='Icon'
                    />
                    <p className='bg-primary-100'>{data.name}</p>
                  </div>
                );
              })}
            </div>
            <Footer />
          </div>
        </section>
      </main>
    </Layout>
  );
}

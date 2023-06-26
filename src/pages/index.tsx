import { useRouter } from 'next/router';
import * as React from 'react';

import { gamesData } from '@/data/config/gameConfig';

import Footer from '@/components/layout/Footer';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
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
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-primary-400'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-between py-12 text-center'>
            <h1 className='text-primary-200 mt-4'>Games</h1>
            <ButtonLink className='mt-6' href='/components' variant='light'>
              See all components
            </ButtonLink>
            <div className='mt-4 flex h-screen flex-wrap hover:cursor-pointer'>
              {gamesData.map((data) => {
                return (
                  <div
                    key={data.name}
                    className='mx-2 flex flex-col'
                    onClick={(e) => handleNavigation(e, data.path)}
                  >
                    <NextImage
                      useSkeleton
                      className='w-32 md:w-40'
                      src={data.imagePath}
                      width='180'
                      height='180'
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

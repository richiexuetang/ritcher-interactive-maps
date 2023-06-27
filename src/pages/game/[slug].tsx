import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';

import mapConfig from '@/data/config/mapConfig';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';

import { ConfigDataType, ImageDataType } from '@/types/config';

export const getStaticProps: GetStaticProps = async (context) => {
  const gameSlug = context?.params?.slug;

  const config: ConfigDataType | undefined = mapConfig.find(
    (o) => o.name === gameSlug
  );

  return {
    props: {
      config: config,
    },
  };
};

export async function getStaticPaths() {
  const paths: string[] = [];

  mapConfig.map((conf) => {
    paths.push(`/game/${conf.name}`);
  });

  return {
    paths,
    fallback: false,
  };
}

const GamePage = ({
  config,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    router.push('/map/' + path);
  };

  return (
    <Layout>
      <div
        className={`flex flex-col font-${config.font} bg-primary-300 h-screen items-center`}
      >
        <h1 className={`font-${config.font} pt-4`}>{config.title}</h1>
        <div className='mt-8 flex'>
          {config.mapOptions.map((option: ImageDataType) => {
            return (
              <div
                key={option.name}
                className='mx-2 flex flex-col'
                onClick={(e) => handleNavigation(e, option.path)}
              >
                <NextImage
                  useSkeleton
                  className='w-60 hover:cursor-pointer md:w-64 '
                  src={option.imagePath}
                  width='256'
                  height='256'
                  alt='Icon'
                />
                <p className='bg-primary-100 text-center hover:cursor-pointer'>
                  {option.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default GamePage;

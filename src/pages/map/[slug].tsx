import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { useLoading } from '@/lib/hooks/useLoading';

import areaConfig from '@/data/config/area';
import { categoryItemsConfig } from '@/data/config/categoryItems';
import { gamesData } from '@/data/config/gameConfig';
import mapConfig from '@/data/config/mapConfig';

import Loader from '@/components/loader/Loader';
import MapPage from '@/components/map/MapPage';
import Seo from '@/components/Seo';

import { LocalStorageContextProvider } from '@/context/localStorageContext';

import { AreaConfigType, CategoryItemsType } from '@/types/config';
import { LocationGroupType, LocationType } from '@/types/location';

interface ICategoryCountKeys {
  [categoryId: number]: number;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const areaId = context?.params?.slug;

  const config: AreaConfigType | undefined = areaConfig?.find(
    (o) => o.name === areaId
  );
  const mapConfigInfo = gamesData?.find(
    (item) => item.path === config?.gameSlug
  );

  const all = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/markers/area/${areaId}`
  );

  const locations: LocationType[] = await all.json();

  const textOverlay = locations.filter((item) => item.markerTypeId === 2);
  const pathMarkers = locations.filter((item) => item.markerTypeId === 4);

  const categoryCounts: ICategoryCountKeys = {};

  pathMarkers.map(({ categoryId }) => {
    categoryCounts[categoryId] = categoryCounts[categoryId] + 1 || 1;
  });

  const locationGroups: LocationGroupType[] = [];
  const categoryConfig: CategoryItemsType | undefined =
    categoryItemsConfig.find((item) =>
      item.mapSlugs.includes(areaId as string)
    );

  categoryConfig?.categoryGroups.map(({ name, members, groupType }) => {
    members.map((item) => {
      const positions = locations
        .map((el, i) => (el.categoryId === item ? i : undefined))
        .filter((x) => x);
      if (positions.length) {
        locationGroups?.push({
          group: name,
          ranks: [...positions] as number[],
          categoryId: item,
          markerTypeId: groupType,
        });
        categoryCounts[item] = positions.length;
      }
    });
  });

  return {
    props: {
      config,
      categoryCounts,
      textOverlay,
      pathMarkers,
      locations,
      locationGroups,
      mapConfigInfo,
    },
    revalidate: 10,
  };
};

export async function getStaticPaths() {
  const paths: string[] = [];

  mapConfig.map((conf) => {
    conf.mapOptions.map((option) => {
      paths.push(`/map/${option.path}`);
    });
  });

  return {
    paths,
    fallback: false,
  };
}

const RMMap = ({
  config,
  categoryCounts,
  textOverlay,
  pathMarkers,
  locations,
  locationGroups,
  mapConfigInfo,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [loading] = useLoading();

  return (
    <LocalStorageContextProvider>
      <Seo
        templateTitle={`Interactive Map | ${mapConfigInfo.name}`}
        faviconPath={config.gameSlug}
      />
      {loading ? (
        <Loader loading={loading as boolean} />
      ) : (
        <MapPage
          staticConfig={config}
          locationGroups={locationGroups}
          categoryCounts={categoryCounts}
          mapConfigInfo={mapConfigInfo}
          locations={locations}
          textOverlay={textOverlay}
          pathMarkers={pathMarkers}
        />
      )}

      {/* {loading ? (
        <Loader loading={loading as boolean} />
      ) : (
        
      )} */}
    </LocalStorageContextProvider>
  );
};

export default RMMap;

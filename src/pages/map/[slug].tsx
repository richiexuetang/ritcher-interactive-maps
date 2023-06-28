import { Map } from 'leaflet';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { useLoading } from '@/lib/hooks/useLoading';

import areaConfig from '@/data/config/area';
import { categoryItemsConfig } from '@/data/config/categoryItems';
import { gamesData } from '@/data/config/gameConfig';
import mapConfig from '@/data/config/mapConfig';

import SidebarControl from '@/components/control/SidebarControl';
import Seo from '@/components/Seo';

import { AreaConfigType, CategoryItemsType } from '@/types/config';
import { LocationGroupType, LocationType } from '@/types/location';

const AppMap = dynamic(() => import('@/components/map/AppMap'), {
  ssr: false,
});

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

const MapPage = ({
  config,
  categoryCounts,
  textOverlay,
  pathMarkers,
  locations,
  locationGroups,
  mapConfigInfo,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [loading] = useLoading();
  const [map, setMap] = useState<Map | null>(null);
  const [hide, setHide] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markerRefs] = useState<any>([]);

  return (
    <>
      <Seo
        templateTitle={`Interactive Map | ${mapConfigInfo.name}`}
        faviconPath={config.gameSlug}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {map && (
            <SidebarControl
              map={map}
              locationGroups={locationGroups}
              setHide={setHide}
              categoryCounts={categoryCounts}
              config={config}
              markerRefs={markerRefs}
              mapConfigInfo={mapConfigInfo}
            />
          )}
          <AppMap
            config={config}
            locations={locations}
            locationGroups={locationGroups}
            setMap={setMap}
            hide={hide}
            setHide={setHide}
            markerRefs={markerRefs}
            textOverlay={textOverlay}
            pathMarkers={pathMarkers}
          />
        </>
      )}
    </>
  );
};

export default MapPage;

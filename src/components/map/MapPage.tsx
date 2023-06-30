/* eslint-disable @typescript-eslint/no-explicit-any */
import { Map } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import SidebarControl from '@/components/control/SidebarControl';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { LocationGroupType, LocationType } from '@/types/location';

const AppMap = dynamic(() => import('@/components/map/AppMap'), {
  ssr: false,
});

interface MapPagePropsType {
  locationGroups: LocationGroupType[];
  categoryCounts: any;
  mapConfigInfo: any;
  locations: any;
  textOverlay: any;
  pathMarkers: any;
  staticConfig: any;
}

const MapPage: React.FC<MapPagePropsType> = ({
  locationGroups,
  categoryCounts,
  mapConfigInfo,
  locations,
  textOverlay,
  pathMarkers,
  staticConfig,
}) => {
  const { setAreaConfig } = useLocalStorageContext();
  const router = useRouter();

  const [map, setMap] = useState<Map | null>(null);
  const [hide, setHide] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<LocationType[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markerRefs] = useState<any>([]);

  useEffect(() => {
    setAreaConfig({ ...staticConfig, font: mapConfigInfo.font });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticConfig, router]);

  const [triggerPopupWithId, setTriggerPopupWithId] = useState<null | string>(
    null
  );

  return (
    <>
      {map && (
        <SidebarControl
          map={map}
          locationGroups={locationGroups}
          setHide={setHide}
          categoryCounts={categoryCounts}
          markerRefs={markerRefs}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          setTriggerPopupWithId={setTriggerPopupWithId}
        />
      )}
      <AppMap
        locations={locations}
        locationGroups={locationGroups}
        setMap={setMap}
        hide={hide}
        setHide={setHide}
        markerRefs={markerRefs}
        textOverlay={textOverlay}
        pathMarkers={pathMarkers}
        searchResults={searchResults}
        staticConfig={staticConfig}
        triggerPopupWithId={triggerPopupWithId}
        setTriggerPopupWithId={setTriggerPopupWithId}
      />
    </>
  );
};

export default MapPage;

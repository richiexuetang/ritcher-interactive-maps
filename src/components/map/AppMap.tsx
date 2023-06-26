/* eslint-disable @typescript-eslint/no-explicit-any */
import L, { LatLngBoundsExpression, LatLngExpression, Map } from 'leaflet';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import { LayerGroup, Marker, TileLayer } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import RMPopup from '@/components/popup/RMPopup';

import { AreaConfigType } from '@/types/config';
import { LocationGroupType, LocationType } from '@/types/location';

const PathLayer = dynamic(() => import('@/components/layer/path/PathLayer'), {
  ssr: false,
});

const TextLayer = dynamic(() => import('@/components/layer/text/TextLayer'), {
  ssr: false,
});

const LayerControl = dynamic(
  () => import('@/components/control/LayerControl'),
  {
    ssr: false,
  }
);

const GroupedLayer = dynamic(
  () => import('@/components/control/LayerControl').then((c) => c.GroupedLayer),
  {
    ssr: false,
  }
);

const RMMapContainer = dynamic(
  () => import('@/components/map/RMMapContainer'),
  {
    ssr: false,
  }
);

const AppMap = (props: {
  config: AreaConfigType;
  locations: LocationType[];
  locationGroups: LocationGroupType[];
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  hide: number | null;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  markerRefs: any;
  textOverlay: any;
  pathMarkers: any;
}) => {
  const {
    config,
    locations,
    locationGroups,
    setMap,
    hide,
    setHide,
    markerRefs,
    textOverlay,
    pathMarkers,
  } = props;

  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: { [config.name]: [] },
    }
  );

  useEffect(() => {
    if (!hiddenCategories[config.name]) {
      setHiddenCategories((prev) => ({ ...prev, [config.name]: [] }));
    }
  }, [config.name, hiddenCategories, setHiddenCategories]);

  const mapHiddenCategories: number[] = hiddenCategories[config.name];

  const map = useMemo(() => {
    return (
      <RMMapContainer config={config} setMap={setMap}>
        {() => (
          <>
            <TileLayer
              url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={config.bounds as LatLngBoundsExpression}
            />
            <LayerControl setHide={setHide} hide={hide} config={config}>
              {locationGroups.map(
                ({ categoryId, ranks, group, markerTypeId }) => {
                  const checked = !mapHiddenCategories?.includes(categoryId);
                  return (
                    <GroupedLayer
                      key={`${categoryId} + ${group}`}
                      checked={checked}
                      id={group}
                      name={categoryId}
                      group={group}
                    >
                      <LayerGroup>
                        {markerTypeId === 1 &&
                          ranks?.map((rank) => {
                            const location = locations[rank];

                            if (location?.coordinate) {
                              return (
                                <Marker
                                  ref={(ref) =>
                                    (markerRefs[location._id] = ref)
                                  }
                                  key={`${location._id} ${group}`}
                                  position={
                                    location.coordinate as LatLngExpression
                                  }
                                  icon={L.icon({
                                    iconUrl: `/images/icons/${location.categoryId}.png`,
                                    iconSize: [35, 45],
                                    iconAnchor: [17, 45],
                                  })}
                                  zIndexOffset={rank}
                                >
                                  <RMPopup location={location} />
                                </Marker>
                              );
                            }
                          })}
                      </LayerGroup>
                    </GroupedLayer>
                  );
                }
              )}
            </LayerControl>
            <TextLayer textOverlay={textOverlay} markerRefs={markerRefs} />
            <PathLayer pathMarkers={pathMarkers} />
          </>
        )}
      </RMMapContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hide,
    config,
    locationGroups,
    setMap,
    setHide,
    locations,
    mapHiddenCategories,
  ]);

  return map;
};

export default AppMap;

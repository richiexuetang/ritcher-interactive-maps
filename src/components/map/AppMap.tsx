import { LatLngBoundsExpression, LatLngExpression, Map } from 'leaflet';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { CircleMarker, LayerGroup, TileLayer, Tooltip } from 'react-leaflet';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import MarkerClusterGroup from '@/components/layer/cluster/MarkerClusterGroup';

import { useLocalStorageContext } from '@/context/localStorageContext';

import {
  LocationGroupType,
  LocationType,
  MarkerIdToMarkerRefT,
  PathType,
  TextOverlayType,
} from '@/types/location';

const RMMarker = dynamic(() => import('@/components/marker/RMMarker'), {
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
  locations: LocationType[];
  locationGroups: LocationGroupType[];
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  hide: number | null;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  markerRefs: MarkerIdToMarkerRefT[];
  textOverlay: TextOverlayType[];
  pathMarkers: PathType[];
  searchResults: LocationType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  staticConfig: any;
  triggerPopupWithId: null | string;
  setTriggerPopupWithId: Dispatch<SetStateAction<string | null>>;
}) => {
  const {
    locations,
    locationGroups,
    setMap,
    hide,
    setHide,
    markerRefs,
    textOverlay,
    pathMarkers,
    searchResults,
    staticConfig,
    triggerPopupWithId,
    setTriggerPopupWithId,
  } = props;
  const { hiddenCategories, areaConfig: config } = useLocalStorageContext();

  const router = useRouter();
  const mapHiddenCategories: number[] = config?.name
    ? hiddenCategories[config.name]
    : [];

  const map = useMemo(() => {
    return (
      <RMMapContainer setMap={setMap} staticConfig={staticConfig}>
        {() => (
          <>
            <TileLayer
              url={`/tiles/${staticConfig?.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={staticConfig?.bounds as LatLngBoundsExpression}
            />
            <LayerControl setHide={setHide} hide={hide}>
              {searchResults.length &&
                searchResults.map((result, i) => (
                  <RMMarker
                    key={result._id}
                    markerRefs={markerRefs}
                    location={result}
                    rank={i}
                    triggerPopupWithId={triggerPopupWithId}
                    setTriggerPopupWithId={setTriggerPopupWithId}
                  />
                ))}
              {!searchResults.length &&
                locationGroups.map(
                  ({ categoryId, ranks, group, markerTypeId }) => {
                    const checked = !mapHiddenCategories?.includes(categoryId);
                    const groupColor =
                      '#' +
                      (0x1000000 + Math.random() * 0xffffff)
                        .toString(16)
                        .substr(1, 6);

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
                              const path = pathMarkers.find(
                                (item) => item.parentId === location._id
                              );

                              if (location?.coordinate) {
                                return (
                                  <RMMarker
                                    key={location._id}
                                    markerRefs={markerRefs}
                                    location={location}
                                    rank={rank}
                                    childPath={path}
                                  />
                                );
                              }
                            })}
                          {markerTypeId === 3 && (
                            <MarkerClusterGroup
                              fillColor={groupColor}
                              zoomToBoundsOnClick={true}
                            >
                              <LayerGroup>
                                {ranks?.map((rank) => {
                                  const location = locations[rank];
                                  return (
                                    <CircleMarker
                                      key={`${rank}`}
                                      center={
                                        location.coordinate as LatLngExpression
                                      }
                                      color={groupColor}
                                      radius={2}
                                    >
                                      <Tooltip>
                                        {categoryIdNameMap[categoryId]}
                                      </Tooltip>
                                    </CircleMarker>
                                  );
                                })}
                              </LayerGroup>
                            </MarkerClusterGroup>
                          )}
                        </LayerGroup>
                      </GroupedLayer>
                    );
                  }
                )}
            </LayerControl>
            {!searchResults.length && (
              <>
                <TextLayer textOverlay={textOverlay} markerRefs={markerRefs} />
              </>
            )}
          </>
        )}
      </RMMapContainer>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide, config, searchResults, router, hiddenCategories, markerRefs]);

  return map;
};

export default AppMap;

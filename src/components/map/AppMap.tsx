import { LatLngBoundsExpression, LatLngExpression, Map } from 'leaflet';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import { CircleMarker, LayerGroup, TileLayer, Tooltip } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import MarkerClusterGroup from '@/components/layer/cluster/MarkerClusterGroup';
import MapEventListener from '@/components/map/MapEventListener';

import { AreaConfigType } from '@/types/config';
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
  config: AreaConfigType;
  locations: LocationType[];
  locationGroups: LocationGroupType[];
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  hide: number | null;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  markerRefs: MarkerIdToMarkerRefT[];
  textOverlay: TextOverlayType[];
  pathMarkers: PathType[];
  searchResults: LocationType[];
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
    searchResults,
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
            <MapEventListener />
            <TileLayer
              url={`/tiles/${config.name}/{z}/{x}/{y}.png`}
              noWrap
              bounds={config.bounds as LatLngBoundsExpression}
            />
            <LayerControl setHide={setHide} hide={hide} config={config}>
              {searchResults.length &&
                searchResults.map((result, i) => (
                  <RMMarker
                    key={result._id}
                    markerRefs={markerRefs}
                    location={result}
                    rank={i}
                    config={config}
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
                                    config={config}
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
                {/* <Marker
                  position={[0.6922458720270068, -0.6505778088279058]}
                  draggable
                  icon={L.icon({
                    iconUrl: `/images/icons/69.png`,
                    iconSize: [35, 45],
                    iconAnchor: [17, 45],
                  })}
                  eventHandlers={{
                    dragend: (e) => {
                      const pos = e.target._latlng;
                      copy(`[${pos.lat}, ${pos.lng}]`);
                    },
                  }}
                /> */}
              </>
            )}
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
    searchResults,
  ]);

  return map;
};

export default AppMap;

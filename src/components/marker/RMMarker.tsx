/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression, Polyline } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import PathDecorator from '@/components/layer/path/PathDecorator';
import RMPopup from '@/components/popup/RMPopup';

import { MapToCompletedT } from '@/types/category';
import { AreaConfigType } from '@/types/config';
import { PathType } from '@/types/location';

interface RMMarkerPropsType {
  markerRefs: any;
  location: any;
  rank: number;
  config: AreaConfigType;
  childPath?: PathType | undefined;
}

const RMMarker: React.FC<RMMarkerPropsType> = ({
  markerRefs,
  location,
  rank,
  config,
  childPath,
}) => {
  const map = useMap();
  const params = useSearchParams();
  const markerSearchParam = params.get('markerId');

  const [polylines, setPolylines] = useState<Polyline[] | any[]>([]);

  const [completedMarkers] = useLocalStorageState('rm_completed', {
    defaultValue: { [config.name]: [] } as MapToCompletedT,
  });

  const [userSettings] = useLocalStorageState('rm_user_settings', {
    defaultValue: { hideCompleted: true },
  });

  const [completed, setCompleted] = useState(false);
  const [hideMarker, setHideMarker] = useState(false);
  const [triggerPopup, setTriggerPopup] = useState(false);

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === location._id) {
      map.flyTo(location?.coordinate, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });

      setTriggerPopup(true);
      window.history.replaceState(null, '', `/map/${config.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerSearchParam]);

  useEffect(() => {
    if (completedMarkers[config.name]?.includes(location._id) && !completed) {
      setCompleted(true);
    }
  }, [completedMarkers, completed, setCompleted, location._id, config.name]);

  useEffect(() => {
    if (userSettings.hideCompleted && completed) {
      setHideMarker(true);
    }
    if (!userSettings.hideCompleted) {
      setHideMarker(false);
    }
  }, [userSettings, completed]);

  const arrow = [
    {
      offset: '100%',
      repeat: 0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
    {
      offset: '20%',
      repeat: '40%',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
  ];

  useEffect(() => {
    if (polylines.length && hideMarker) {
      polylines.map((polyline) => {
        if (map.hasLayer(polyline)) {
          map.removeLayer(polyline);
        }
      });
      setPolylines([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polylines, hideMarker]);

  return !hideMarker ? (
    <>
      {childPath?.path && (
        <PathDecorator
          patterns={arrow}
          polyline={childPath.path as LatLngExpression[]}
          setPolylines={setPolylines}
        />
      )}
      <Marker
        ref={(ref) => (markerRefs[location._id] = ref)}
        opacity={completed ? 0.5 : 1}
        position={location.coordinate as LatLngExpression}
        icon={L.icon({
          iconUrl: `/images/icons/${location.categoryId}.png`,
          iconSize: [35, 45],
          iconAnchor: [17, 45],
        })}
        zIndexOffset={rank}
      >
        <RMPopup
          location={location}
          config={config}
          triggerPopup={triggerPopup}
          setTriggerPopup={setTriggerPopup}
          markerRefs={markerRefs}
          hasChild={childPath?.categoryId === location.categoryId}
        />
      </Marker>
    </>
  ) : null;
};

export default RMMarker;

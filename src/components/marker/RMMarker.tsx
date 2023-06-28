/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import RMPopup from '@/components/popup/RMPopup';

import { MapToCompletedT } from '@/types/category';
import { AreaConfigType } from '@/types/config';

interface RMMarkerPropsType {
  markerRefs: any;
  location: any;
  rank: number;
  config: AreaConfigType;
}

const RMMarker: React.FC<RMMarkerPropsType> = ({
  markerRefs,
  location,
  rank,
  config,
}) => {
  const map = useMap();
  const params = useSearchParams();
  const markerSearchParam = params.get('markerId');

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

  return !hideMarker ? (
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
      />
    </Marker>
  ) : null;
};

export default RMMarker;

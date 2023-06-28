/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';

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
  const [completedMarkers] = useLocalStorageState('rm_completed', {
    defaultValue: { [config.name]: [] } as MapToCompletedT,
  });

  const [userSettings] = useLocalStorageState('rm_user_settings', {
    defaultValue: { hideCompleted: true },
  });

  const [completed, setCompleted] = useState(false);
  const [hideMarker, setHideMarker] = useState(false);

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
      <RMPopup location={location} config={config} />
    </Marker>
  ) : null;
};

export default RMMarker;

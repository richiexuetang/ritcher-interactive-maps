/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import { Marker } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import RMPopup from '@/components/popup/RMPopup';

interface RMMarkerPropsType {
  markerRefs: any;
  location: any;
  rank: number;
}

const RMMarker: React.FC<RMMarkerPropsType> = ({
  markerRefs,
  location,
  rank,
}) => {
  const [completedMarkers] = useLocalStorageState('rm_completed', {
    defaultValue: [] as string[],
  });

  const [userSettings] = useLocalStorageState('rm_user_settings', {
    defaultValue: { hideCompleted: true },
  });

  const [completed, setCompleted] = useState(false);
  const [hideMarker, setHideMarker] = useState(false);

  useEffect(() => {
    if (completedMarkers?.includes(location._id) && !completed) {
      setCompleted(true);
    }
  }, [completedMarkers, completed, setCompleted, location._id]);

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
      <RMPopup location={location} />
    </Marker>
  ) : null;
};

export default RMMarker;

/* eslint-disable @typescript-eslint/no-empty-function */
import { LatLngExpression } from 'leaflet';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import { useLocalStorageContext } from '@/context/localStorageContext';

const MapEventListener = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const map = useMap();
  const router = useRouter();
  const { areaConfig } = useLocalStorageContext();

  useEffect(() => {
    map.setView(areaConfig?.center as LatLngExpression, areaConfig?.zoom);
  }, [router, map, areaConfig]);

  return null;
};

export default MapEventListener;

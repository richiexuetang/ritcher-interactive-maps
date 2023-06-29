/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import '@/lib/leaflet/smooth-wheel-zoom.js';
import 'leaflet-contextmenu';

import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import 'leaflet/dist/leaflet.css';

import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';

import { useLocalStorageContext } from '@/context/localStorageContext';

const { MapContainer } = ReactLeaflet;

interface MapContainerProp {
  children?: any;
  setMap: any;
  staticConfig: any;
}

const RMMapContainer: React.FC<MapContainerProp> = ({
  children,
  setMap,
  staticConfig,
  ...rest
}) => {
  const { areaConfig } = useLocalStorageContext();
  const router = useRouter();
  const [_, copy] = useCopyToClipboard();
  const [mapZoom, setMapZoom] = useState<null | number>(null);
  const [mapBounds, setMapBounds] = useState<LatLngBoundsExpression>(
    areaConfig?.bounds as LatLngBoundsExpression
  );
  const addMarker = (e: any) => {
    const newPos = e.latlng;
    copy(`${newPos.lat}, ${newPos.lng}`);
  };

  useEffect(() => {
    setMapBounds(areaConfig?.bounds as LatLngBoundsExpression);
  }, [router, areaConfig]);

  return (
    <MapContainer
      style={{ background: 'black', height: '100vh', width: '100vw' }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
      center={staticConfig?.center as LatLngExpression}
      zoom={staticConfig?.zoom}
      bounds={mapBounds}
      minZoom={staticConfig?.minZoom}
      maxZoom={staticConfig?.maxZoom}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      smoothWheelZoom={true}
      smoothSensitivity={15}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      whenReady={(map) => setMap(map)}
      contextmenu={true}
      contextmenuWidth={140}
      contextmenuItems={[
        {
          text: 'Add marker',
          callback: (e: any) => addMarker(e),
        },
      ]}
      {...rest}
    >
      {children(ReactLeaflet, mapZoom, setMapZoom)}
    </MapContainer>
  );
};

export default RMMapContainer;

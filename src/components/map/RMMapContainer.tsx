/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import '@/lib/leaflet/smooth-wheel-zoom.js';
import 'leaflet-contextmenu';

import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import 'leaflet/dist/leaflet.css';

import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';

const { MapContainer } = ReactLeaflet;

interface MapContainerProp {
  children?: any;
  config: any;
  setMap: any;
}

const RMMapContainer: React.FC<MapContainerProp> = ({
  children,
  config,
  setMap,
  ...rest
}) => {
  const [_, copy] = useCopyToClipboard();
  const [mapZoom, setMapZoom] = useState<null | number>(null);
  const addMarker = (e: any) => {
    const newPos = e.latlng;
    copy(`${newPos.lat}, ${newPos.lng}`);
  };

  return (
    <MapContainer
      style={{ background: 'black', height: '100vh', width: '100vw' }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      zoomControl={false}
      scrollWheelZoom={false}
      attributionControl={false}
      center={config.center}
      zoom={config.zoom}
      bounds={config.bounds}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
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

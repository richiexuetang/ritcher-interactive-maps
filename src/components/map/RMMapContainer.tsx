/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
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
}) => {
  const [_, copy] = useCopyToClipboard();

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
      contextMenu={true}
      contextmenuItems={[
        {
          text: 'Add marker',
          callback: (e: any) => addMarker(e),
        },
      ]}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      smoothWheelZoom={true}
      smoothSensitivity={15}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      whenReady={(map) => setMap(map)}
    >
      {children(ReactLeaflet)}
    </MapContainer>
  );
};

export default RMMapContainer;

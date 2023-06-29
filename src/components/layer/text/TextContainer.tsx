import { divIcon, LatLngExpression } from 'leaflet';
import { useState } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';

import { MarkerIdToMarkerRefT } from '@/types/location';

interface TextContainerPropsType {
  id: string;
  position: number[];
  minZoom: number;
  maxZoom: number;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerRefs: MarkerIdToMarkerRefT[] | any;
}

const TextContainer: React.FC<TextContainerPropsType> = ({
  id,
  position,
  minZoom,
  maxZoom,
  content,
  markerRefs,
}) => {
  const map = useMap();
  const [show, setShow] = useState(
    map.getZoom() <= minZoom && map.getZoom() >= maxZoom
  );

  const iconWidth = content.length * 10;
  const icon = divIcon({
    className: 'map-label',
    iconSize: [iconWidth, 12],
    iconAnchor: [iconWidth / 2, 12],
    html: `${content}`,
  });

  useMapEvents({
    zoom() {
      setShow(maxZoom <= map.getZoom() && map.getZoom() <= minZoom);
    },
  });

  return (
    <>
      {show ? (
        <Marker
          ref={(ref) => (markerRefs[id] = ref)}
          position={position as LatLngExpression}
          icon={icon}
        />
      ) : null}
    </>
  );
};

export default TextContainer;

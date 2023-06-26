import { divIcon } from 'leaflet';
import { useState } from 'react';
import { Marker, useMap, useMapEvents } from 'react-leaflet';

interface TextContainerPropsType {
  id: string;
  position: number[];
  minZoom: number;
  maxZoom: number;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerRefs: any;
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

  const icon = divIcon({
    className: 'map-label',
    iconSize: [100, 12],
    iconAnchor: [50, 12],
    html: `<span>${content}</span>`,
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
          position={[position[0], position[1]]}
          icon={icon}
        />
      ) : null}
    </>
  );
};

export default TextContainer;

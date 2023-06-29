/* eslint-disable @typescript-eslint/no-empty-function */
import { useMapEvents } from 'react-leaflet';

const MapEventListener = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const map = useMapEvents({
    moveend: () => {},
  });
  return null;
};

export default MapEventListener;

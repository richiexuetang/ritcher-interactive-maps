import L, { LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@/lib/leaflet/path/L.PolylineDecorator.js';

interface PathDecoratorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patterns: any;
  polyline: number[][] | LatLngExpression[];
  visible: boolean;
}

const PathDecorator: React.FC<PathDecoratorProps> = ({
  patterns,
  polyline,
  visible,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !visible) return;

    L.polyline(polyline as LatLngExpression[]).addTo(map);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    L.polylineDecorator(polyline, {
      patterns,
    }).addTo(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default PathDecorator;

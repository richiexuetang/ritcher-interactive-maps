import L, { LatLngExpression } from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@/lib/leaflet/path/L.polylineDecorator.js';

interface PathDecoratorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patterns: any;
  polyline: number[][] | LatLngExpression[];
}

const PathDecorator: React.FC<PathDecoratorProps> = ({
  patterns,
  polyline,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

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

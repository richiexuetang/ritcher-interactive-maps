/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression, Polyline } from 'leaflet';
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import '@/lib/leaflet/path/L.PolylineDecorator.js';

interface PathDecoratorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patterns: any;
  polyline: number[][] | LatLngExpression[];
  setPolylines: React.Dispatch<React.SetStateAction<Polyline[] | any[]>>;
}

const PathDecorator: React.FC<PathDecoratorProps> = ({
  patterns,
  polyline,
  setPolylines,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const path = L.polyline(polyline as LatLngExpression[]).addTo(map);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const decorator = L.polylineDecorator(polyline, {
      patterns,
    }).addTo(map);

    setPolylines((prev: any) => [...prev, decorator, path]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, polyline]);

  return null;
};

export default PathDecorator;

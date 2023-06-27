import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { Polyline } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { AreaConfigType } from '@/types/config';
import { PathType } from '@/types/location';

interface PathComponentProps {
  pathInfo: PathType;
  config: AreaConfigType;
}

// eslint-disable-next-line unused-imports/no-unused-vars
const Path: React.FC<PathComponentProps> = ({ pathInfo, config }) => {
  const { path, id, categoryId, parentId } = pathInfo;

  const [completedMarkers, setCompletedMarkers] = useLocalStorageState(
    'rm_completed',
    { defaultValue: [] as string[] }
  );
  const [_, setCompletedCount] = useLocalStorageState('rm_completed_count', {
    defaultValue: { [categoryId]: 0 },
  });

  const start = [path[0][0], path[0][1]] as LatLngExpression;
  const end = [path[1][0], path[1][1]] as LatLngExpression;

  useEffect(() => {
    if (
      completedMarkers?.includes(parentId) &&
      !completedMarkers?.includes(id)
    ) {
      setCompletedMarkers((prev) => [...prev, id]);
      setCompletedCount((prev) => ({
        ...prev,
        [categoryId]: prev[categoryId] + 1,
      }));
    }
  }, [
    completedMarkers,
    id,
    parentId,
    categoryId,
    setCompletedCount,
    setCompletedMarkers,
  ]);

  return !completedMarkers?.includes(id) ? (
    <Polyline positions={[start, end]} color='white' weight={1} />
  ) : null;
};

export default Path;

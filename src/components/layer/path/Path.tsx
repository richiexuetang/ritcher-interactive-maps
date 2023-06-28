import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { Polyline } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { MapToCompletedT } from '@/types/category';
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
    { defaultValue: { [config.name]: [] } as MapToCompletedT }
  );
  const [_, setCompletedCount] = useLocalStorageState('rm_completed_count', {
    defaultValue: { [config.name]: { [categoryId]: 0 } },
  });
  const [hiddenCategories] = useLocalStorageState('rm_hidden_categories', {
    defaultValue: { [config.name]: [] as number[] },
  });

  const start = [path[0][0], path[0][1]] as LatLngExpression;
  const end = [path[1][0], path[1][1]] as LatLngExpression;

  useEffect(() => {
    if (
      completedMarkers[config.name]?.includes(parentId) &&
      !completedMarkers[config.name]?.includes(id)
    ) {
      setCompletedMarkers((prev) => ({
        ...prev,
        [config.name]: [...prev[config.name], id],
      }));
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          [categoryId]: prev[config.name][categoryId] + 1,
        },
      }));
    }
  }, [
    completedMarkers,
    id,
    parentId,
    categoryId,
    setCompletedCount,
    setCompletedMarkers,
    config.name,
  ]);

  return !completedMarkers[config.name]?.includes(id) &&
    !hiddenCategories[config.name]?.includes(categoryId) ? (
    <Polyline positions={[start, end]} color='white' weight={1} />
  ) : null;
};

export default Path;

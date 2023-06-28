import { useEffect, useState } from 'react';
import '@/lib/leaflet/path/L.Symbol.js';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import PathDecorator from '@/components/layer/path/PathDecorator';

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

  const [visible, setVisible] = useState(
    !completedMarkers[config.name]?.includes(parentId) &&
      !hiddenCategories[config.name]?.includes(categoryId)
  );

  useEffect(() => {
    if (completedMarkers[config.name]?.includes(parentId)) {
      if (!completedMarkers[config.name]?.includes(id)) {
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
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedMarkers]);

  const arrow = [
    {
      offset: '100%',
      repeat: 0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
    {
      offset: '20%',
      repeat: '40%',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
  ];

  return (
    visible && (
      <PathDecorator patterns={arrow} polyline={path} visible={visible} />
    )
  );
};

export default Path;

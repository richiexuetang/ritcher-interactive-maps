/* eslint-disable @typescript-eslint/no-explicit-any */
import Path from './Path';

import { AreaConfigType } from '@/types/config';

const PathLayer = (props: { pathMarkers: any; config: AreaConfigType }) => {
  const { pathMarkers, config } = props;

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({ parentId, path, _id, categoryId }: any, i: any) => {
          return (
            <Path
              key={`${parentId} + ${i}`}
              pathInfo={{
                path: path,
                parentId: parentId,
                categoryId: categoryId,
                id: _id,
              }}
              config={config}
            />
          );
        })}
    </>
  );
};

export default PathLayer;

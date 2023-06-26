/* eslint-disable @typescript-eslint/no-explicit-any */
import Path from './Path';

const PolyLines = (props: { pathMarkers: any }) => {
  const { pathMarkers } = props;

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({ parentId, path, _id, categoryId }: any, i: any) => {
          return (
            <Path
              key={`${parentId} + ${i}`}
              path={path}
              parentId={parentId}
              categoryId={categoryId}
              id={_id}
            />
          );
        })}
    </>
  );
};

export default PolyLines;

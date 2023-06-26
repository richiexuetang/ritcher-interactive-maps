import { LatLngExpression } from 'leaflet';
import { Polyline } from 'react-leaflet';

import { PathType } from '@/types/location';

// eslint-disable-next-line unused-imports/no-unused-vars
const Path: React.FC<PathType> = ({ path, parentId, categoryId, id }) => {
  const start = [path[0][0], path[0][1]] as LatLngExpression;
  const end = [path[1][0], path[1][1]] as LatLngExpression;
  return <Polyline positions={[start, end]} color='white' weight={1} />;
};

export default Path;

export interface LocationType {
  markerTypeId: number;
  markerName: string;
  categoryId: number;
  coordinate?: number[];
  path?: [number, number][];
  description?: string;
  mapSlug: string;
  gameSlug: string;
  parentId?: string;
  _id: string;
  lat?: number;
  zoomRange?: number[];
}

export interface LocationGroupType {
  group: string;
  ranks: number[] | undefined;
  categoryId: number;
  markerTypeId: number;
}

export interface TextOverlayType {
  _id: string;
  coordinate: number[];
  zoomRange: number[];
  markerName: string;
}

export interface PathType {
  path: number[][];
  parentId: string;
  categoryId: number;
  id: string;
}

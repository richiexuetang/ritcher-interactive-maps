export interface ImageDataType {
  name: string;
  path: string;
  imagePath: string;
  font?: string;
}

export interface GameDataType {
  name: string;
  path: string;
  imagePath: string;
  font: string;
}

export interface ConfigDataType {
  name: string;
  title: string;
  font: string;
  mapOptions: ImageDataType[];
}

export interface AreaSubSelectionType {
  name: string;
  to: string;
  location: number[];
  bounds: number[][];
}

export interface AreaSelection {
  name: string;
  to: string;
  location: number[];
  bounds?: number[][];
  zoom?: number;
  flex?: string;
}

export interface AreaConfigType {
  name: string;
  maxZoom: number;
  minZoom: number;
  zoom: number;
  center: number[];
  bounds: number[][];
  gameSlug: string;
  subSelections: AreaSelection[];
}

export interface CategoryItemsType {
  gameSlug: string;
  mapSlugs: string[];
  categoryGroups: {
    name: string;
    groupType: number;
    members: number[];
  }[];
}

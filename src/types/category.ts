export type CategoryIdToCountT = {
  [categoryId: number]: number;
};

export type MapToCategoryIdCountT = {
  [mapSlug: string]: CategoryIdToCountT;
};

export type MapToCompletedT = {
  [mapSlug: string]: string[];
};

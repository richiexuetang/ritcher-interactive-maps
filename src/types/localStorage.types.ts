export interface UserSettingsType {
  hideCompleted: boolean;
  hideAllCategories: boolean;
}

export type MapSlugToHiddenCategoryT = {
  [mapSlug: string]: number[];
};

export type MapSlugToCompletedT = {
  [mapSlug: string]: string[];
};

export type CategoryIdToCountT = {
  [categoryId: number]: number;
};

export type MapSlugToCategoryIdCountT = {
  [mapSlug: string]: CategoryIdToCountT;
};

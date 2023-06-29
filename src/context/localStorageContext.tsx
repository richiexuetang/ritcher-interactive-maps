/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useRouter } from 'next/router';
import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import useLocalStorageState, {
  LocalStorageState,
} from '@/lib/hooks/useLocalStorage';

import { AreaConfigType } from '@/types/config';
import {
  MapSlugToCategoryIdCountT,
  MapSlugToCompletedT,
  MapSlugToHiddenCategoryT,
  UserSettingsType,
} from '@/types/localStorage.types';

interface ILocalStorageContext {
  areaConfig: AreaConfigType;
  setAreaConfig: Dispatch<SetStateAction<AreaConfigType>>;
  userSettings: UserSettingsType;
  hiddenCategories: MapSlugToHiddenCategoryT;
  completed: MapSlugToCompletedT | LocalStorageState<MapSlugToCompletedT> | any;
  completedCount:
    | LocalStorageState<MapSlugToCategoryIdCountT>
    | MapSlugToCategoryIdCountT
    | any;
  setCompleted: Dispatch<LocalStorageState<MapSlugToCompletedT>> | any;
  setCompletedCount:
    | Dispatch<SetStateAction<LocalStorageState<MapSlugToCategoryIdCountT>>>
    | any;
  toggleHideCompleted: () => void;
  toggleHidingCategories: (mapSlug: string, locationGroups: any) => void;
  setHiddenCategories: Dispatch<SetStateAction<MapSlugToHiddenCategoryT>> | any;
  toggleGroupHiddenState: (currentGroup: any) => void;
}

const LocalStorageContext = createContext<ILocalStorageContext>({
  areaConfig: {
    name: '',
    maxZoom: 0,
    minZoom: 0,
    zoom: 0,
    center: [],
    bounds: [],
    gameSlug: '',
    subSelections: [],
  },
  setAreaConfig: (): any => {},
  userSettings: { hideCompleted: false, hideAllCategories: false },
  hiddenCategories: {},
  setCompleted: (): void => {},
  setCompletedCount: (): void => {},
  toggleHideCompleted: (): void => {},
  toggleHidingCategories: (mapSlug: string, locationGroups: any): void => {},
  setHiddenCategories: () => {},
  toggleGroupHiddenState: (): void => {},
  completed: {},
  completedCount: {},
});

interface LocalStoragePropsInterface {
  children?: JSX.Element | JSX.Element[];
}

export function LocalStorageContextProvider(
  props: LocalStoragePropsInterface
): ReactElement {
  const router = useRouter();
  const [areaConfig, setAreaConfig] = useState<AreaConfigType | any>({});
  const [completed, setCompleted] = useLocalStorageState('rm_completed', {
    defaultValue: { [areaConfig?.name]: [] },
  });

  const [completedCount, setCompletedCount] = useLocalStorageState(
    'rm_completed_count',
    { defaultValue: { [areaConfig?.name]: {} } }
  );

  const [userSettings, setUserSettings] = useLocalStorageState(
    'rm_user_settings',
    { defaultValue: { hideCompleted: false, hideAllCategories: false } }
  );

  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: {} as any,
    }
  );

  useEffect(() => {
    if (areaConfig?.name) {
      if (!hiddenCategories?.[areaConfig.name]) {
        setHiddenCategories((prev: any) => ({
          ...prev,
          [areaConfig.name]: [],
        }));
      }
      if (!completed?.[areaConfig.name]) {
        setCompleted((prev) => ({ ...prev, [areaConfig.name]: [] }));
      }
      if (!completedCount?.[areaConfig.name]) {
        setCompletedCount((prev) => ({ ...prev, [areaConfig.name]: 0 }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaConfig, router]);

  const toggleHideCompleted = () => {
    const isHidingCompleted: boolean = userSettings?.hideCompleted;

    setUserSettings((prev) => ({ ...prev, hideCompleted: !isHidingCompleted }));
  };

  const toggleHidingCategories = (mapSlug: string, locationGroups: any) => {
    const isHidingAllCategories: boolean = userSettings?.hideAllCategories;

    if (!isHidingAllCategories) {
      const hiddenState = hiddenCategories[mapSlug] || ([] as number[]);

      locationGroups.map((group: { categoryId: any }) => {
        if (!hiddenState?.includes(group?.categoryId)) {
          hiddenState.push(group.categoryId);
        }
      });
      setHiddenCategories((prev: any) => ({
        ...prev,
        [mapSlug]: [...hiddenState],
      }));
    } else {
      setHiddenCategories((prev: any) => ({ ...prev, [mapSlug]: [] }));
    }
    setUserSettings((prev) => ({
      ...prev,
      hideAllCategories: !isHidingAllCategories,
    }));
  };

  const toggleGroupHiddenState = (currentGroup: any) => {
    let numOfHidden = 0;
    const currentCategories: number[] = [];
    currentGroup.map((group: { categoryId: number }) => {
      numOfHidden = hiddenCategories[areaConfig.name].includes(group.categoryId)
        ? numOfHidden + 1
        : numOfHidden;
      currentCategories.push(group.categoryId);
    });

    // all categories are hidden, toggle all to show
    if (numOfHidden === currentGroup.length) {
      let data = hiddenCategories[areaConfig.name];
      currentCategories.map((category) => {
        data = data.filter((item: number) => item !== category);
      });

      setHiddenCategories((prev: any) => ({
        ...prev,
        [areaConfig.name]: [...data],
      }));
    } else {
      currentCategories.map((category) => {
        if (!hiddenCategories[areaConfig.name].includes(category)) {
          setHiddenCategories((prev: { [x: string]: any }) => ({
            ...prev,
            [areaConfig.name]: [...prev[areaConfig.name], category],
          }));
        }
      });
    }
  };
  return (
    <LocalStorageContext.Provider
      value={{
        completed,
        completedCount,
        userSettings,
        toggleHideCompleted,
        hiddenCategories,
        toggleHidingCategories,
        areaConfig,
        setAreaConfig,
        setHiddenCategories,
        setCompleted,
        setCompletedCount,
        toggleGroupHiddenState,
      }}
    >
      {props.children}
    </LocalStorageContext.Provider>
  );
}

export function useLocalStorageContext() {
  const context = useContext(LocalStorageContext);

  if (!context) {
    throw new Error(
      'useLocalStorageContext must be used inside a `LocalStorageProvider`'
    );
  }

  return context;
}

export default LocalStorageContext;

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronUp,
  FiCompass,
  FiHome,
  FiSearch,
  FiSettings,
} from 'react-icons/fi';

import clsxm from '@/lib/clsxm';
import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import SearchResult from '@/components/control/sidebar/SearchResult';
import Sidebar from '@/components/control/sidebar/Sidebar';
import Tab from '@/components/control/sidebar/Tab';
import UnderlineLink from '@/components/links/UnderlineLink';
import NextImage from '@/components/NextImage';

import { CategoryIdToCountT } from '@/types/category';
import { AreaConfigType } from '@/types/config';
import { LocationGroupType, LocationType } from '@/types/location';

interface SidebarControlPropsType {
  map: any;
  locationGroups: LocationGroupType[];
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  categoryCounts: CategoryIdToCountT;
  config: AreaConfigType;
  markerRefs: any;
  mapConfigInfo: any;
}

const SidebarControl: React.FC<SidebarControlPropsType> = ({
  map,
  locationGroups,
  setHide,
  categoryCounts,
  config,
  markerRefs,
  mapConfigInfo,
}) => {
  const [openTab, setOpenTab] = useState<string | boolean>('home');
  const [searchResults, setSearchResults] = useState<LocationType[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const font = mapConfigInfo?.font;
  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: { [config.name]: [] },
    }
  );
  const [completedCount] = useLocalStorageState('rm_completed_count', {
    defaultValue: {},
  });

  const [_, setUserSettings] = useLocalStorageState('rm_user_settings', {
    defaultValue: { hideCompleted: true },
  });

  let prevGroup = '';

  const onClose = () => {
    setOpenTab(false);
  };

  const onOpen = (id: string) => {
    setOpenTab(id);
  };

  const handleHideAll = () => {
    const hiddenState = hiddenCategories[config.name] || [];
    locationGroups.map((group) => {
      if (!hiddenState.includes(group.categoryId)) {
        hiddenState.push(group.categoryId);
      }
    });
    setHiddenCategories((prev) => ({
      ...prev,
      [config.name]: [...hiddenState],
    }));
  };

  const handleShowAll = () => {
    setHiddenCategories((prev) => ({
      ...prev,
      [config.name]: [],
    }));
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await search((e.target as HTMLInputElement).value);
    }
  };

  const search = async (searchParam: string) => {
    setSearching(true);
    setSearchResults([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/marker/find?searchParam=` +
          searchParam +
          `&mapSlug=${config.name}`
      );
      const json = await res.json();
      setSearchResults(json);
      setSearching(false);

      // if (json.length) {
      //   setSearchState("COMPLETE");
      // } else {
      //   setSearchState("NO RESULT");
      // }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    if (!hiddenCategories[config.name]) {
      setHiddenCategories((prev) => ({ ...prev, [config.name]: [] }));
    }
  }, [config.name, hiddenCategories, setHiddenCategories]);

  const mapHiddenCategories: number[] = hiddenCategories[config.name];

  return (
    <section className={`Sidebar font-${font}`}>
      <Sidebar
        map={map}
        position='left'
        collapsed={!openTab}
        selected={openTab}
        closeIcon={<FiChevronLeft />}
        onClose={onClose}
        onOpen={onOpen}
        panMapOnChange
        rehomeControls
      >
        <Tab id='home' header='Filter Markers' icon={<FiHome />} active>
          <div className='flex flex-col'>
            <div className='flex justify-between py-4'>
              <button onClick={handleHideAll}>Hide All</button>
              <button onClick={handleShowAll}>Show All</button>
            </div>
            <div className='flex justify-between py-4'>
              <button
                onClick={() =>
                  setUserSettings((prev) => ({ ...prev, hideCompleted: true }))
                }
              >
                Hide Completed
              </button>
              <button
                onClick={() =>
                  setUserSettings((prev) => ({ ...prev, hideCompleted: false }))
                }
              >
                Show Completed
              </button>
            </div>
          </div>
          {locationGroups.map(({ group, categoryId }) => {
            let flag = false;
            const hiddenFlag = mapHiddenCategories?.includes(categoryId);
            if (group !== prevGroup) {
              prevGroup = group;
              flag = true;
            }

            return (
              <div
                key={categoryId}
                className='flex flex-col py-1 hover:cursor-pointer'
              >
                {flag && (
                  <div className='flex items-center'>
                    <FiChevronUp className='mr-3' />
                    <div className='py-3'>{group.toUpperCase()}</div>
                  </div>
                )}

                <div
                  className='flex flex-row justify-between'
                  onClick={() => setHide(categoryId)}
                >
                  <NextImage
                    useSkeleton
                    src={`/images/icons/${categoryId}.png`}
                    width='25'
                    height='25'
                    alt='Icon'
                  />
                  <p className={clsxm([hiddenFlag && 'line-through	'])}>
                    {categoryIdNameMap[categoryId]}
                  </p>
                  <p className={clsxm([hiddenFlag && 'line-through	'])}>
                    {completedCount[categoryId] || 0}/
                    {categoryCounts[categoryId]}
                  </p>
                </div>
              </div>
            );
          })}
        </Tab>
        <Tab id='props' header='Navigate' icon={<FiCompass />}>
          <div className='flex flex-wrap justify-center gap-2 align-middle'>
            {config?.subSelections.map((selection) => {
              return (
                <UnderlineLink
                  key={selection.name}
                  href={`/map/${selection.to}`}
                >
                  {selection.name}
                </UnderlineLink>
              );
            })}
          </div>
        </Tab>
        <Tab id='search' header='' icon={<FiSearch />}>
          <div className='relative text-gray-600 focus-within:text-gray-400'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
              <button
                type='submit'
                className='focus:shadow-outline p-1 focus:outline-none'
              >
                <svg
                  fill='none'
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  viewBox='0 0 24 24'
                  className='h-6 w-6'
                >
                  <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                </svg>
              </button>
            </span>
            <input
              type='search'
              name='q'
              className='rounded-md bg-gray-900 py-2 pl-10 text-sm text-white focus:bg-white focus:text-gray-900 focus:outline-none'
              placeholder='Search...'
              onKeyUp={(e) => handleKeyPress(e)}
            />
          </div>
          <div className='overflow-scroll hover:cursor-pointer'>
            {searching && <div>Searching for markers...</div>}
            {searchResults?.map((result) => (
              <SearchResult
                key={result._id}
                result={result}
                markerRef={markerRefs[result._id]}
                config={config}
                map={map.target}
              />
            ))}
          </div>
        </Tab>
        <Tab
          id='settings'
          header='Settings'
          icon={<FiSettings />}
          anchor='bottom'
        >
          <p>
            The button for this tab can be anchored to the bottom by using the{' '}
            <code>anchor="bottom"</code> props on the <code>Tab</code> component
          </p>
        </Tab>
      </Sidebar>
    </section>
  );
};

export default SidebarControl;

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import React, { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiCompass,
  FiHome,
  FiSearch,
  FiSettings,
} from 'react-icons/fi';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import TextButton from '@/components/buttons/TextButton';
import CategoryGroup from '@/components/control/sidebar/CategoryGroup';
import SearchResult from '@/components/control/sidebar/SearchResult';
import Sidebar from '@/components/control/sidebar/Sidebar';
import Tab from '@/components/control/sidebar/Tab';
import UnderlineLink from '@/components/links/UnderlineLink';
import Loader from '@/components/loader/Loader';

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
  searchResults: LocationType[];
  setSearchResults: any;
}

const SidebarControl: React.FC<SidebarControlPropsType> = ({
  map,
  locationGroups,
  setHide,
  categoryCounts,
  config,
  markerRefs,
  mapConfigInfo,
  searchResults,
  setSearchResults,
}) => {
  const [openTab, setOpenTab] = useState<string | boolean>('home');
  const [searching, setSearching] = useState<boolean>(false);
  const font = mapConfigInfo?.font;
  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: { [config.name]: [] as number[] },
    }
  );

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
    const hiddenState = hiddenCategories[config.name] || ([] as number[]);
    locationGroups.map((group) => {
      if (!hiddenState?.includes(group?.categoryId)) {
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

  useEffect(() => {
    if (openTab !== 'search' && searchResults.length) {
      setSearchResults([]);
    }
  }, [openTab, searchResults.length, setSearchResults]);

  return (
    <section className={`Sidebar font-${font}`}>
      <Sidebar
        id='sidebar'
        map={map}
        position='left'
        collapsed={!openTab}
        selected={openTab}
        closeIcon={<FiChevronLeft />}
        onClose={onClose}
        onOpen={onOpen}
        rehomeControls
      >
        <Tab
          id='home'
          header=''
          icon={<FiHome />}
          active
          font={font}
          gameSlug={config.gameSlug}
        >
          <div className='flex flex-col'>
            <div className='flex justify-between py-4'>
              <TextButton className='text-primary-200' onClick={handleHideAll}>
                Hide All
              </TextButton>
              <TextButton className='text-primary-200' onClick={handleShowAll}>
                Show All
              </TextButton>
            </div>
            <div className='flex justify-between py-4'>
              <TextButton
                className='text-primary-200'
                onClick={() =>
                  setUserSettings((prev) => ({ ...prev, hideCompleted: true }))
                }
              >
                Hide Completed
              </TextButton>
              <TextButton
                className='text-primary-200'
                onClick={() =>
                  setUserSettings((prev) => ({ ...prev, hideCompleted: false }))
                }
              >
                Show Completed
              </TextButton>
            </div>
          </div>
          {locationGroups.map(({ group, categoryId }) => {
            if (group !== prevGroup) {
              prevGroup = group;

              const currentGroup = locationGroups.filter(
                (item) => item.group === group
              );

              return (
                <CategoryGroup
                  key={group}
                  categoryId={categoryId}
                  group={group}
                  setHide={setHide}
                  categoryCounts={categoryCounts}
                  currentGroup={currentGroup}
                  config={config}
                />
              );
            }
          })}
        </Tab>
        <Tab
          id='props'
          header=''
          icon={<FiCompass />}
          font={font}
          gameSlug={config.gameSlug}
        >
          <div className='mt-5 flex flex-col flex-wrap items-center justify-center gap-2 align-middle'>
            {config?.subSelections.map((selection) => {
              return (
                <UnderlineLink
                  key={selection.name}
                  href={`/map/${selection.to}`}
                  className='text-primary-200'
                >
                  {selection.name}
                </UnderlineLink>
              );
            })}
          </div>
        </Tab>
        <Tab
          id='search'
          header=''
          icon={<FiSearch />}
          font={font}
          gameSlug={config.gameSlug}
        >
          <div className='text-primary-600 focus-within:text-primary-400 relative mt-4'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-2'>
              <button
                type='submit'
                className='focus:shadow-outline p-1 focus:outline-none'
              >
                <svg
                  fill='none'
                  stroke='currentColor'
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
              className='bg-primary-200 text-primary-200 focus:bg-primary-200 w-full rounded-md py-2 pl-10 text-sm focus:text-black focus:outline-none'
              placeholder='Search...'
              onKeyUp={(e) => handleKeyPress(e)}
              onChange={() => setSearchResults([])}
            />
          </div>
          <div className='text-primary-100 overflow-scroll hover:cursor-pointer'>
            {searching && (
              <div className='mt-3'>
                <Loader loading={searching} />
              </div>
            )}
            {searchResults?.map((result: any) => (
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
          header=''
          icon={<FiSettings />}
          anchor='bottom'
        ></Tab>
      </Sidebar>
    </section>
  );
};

export default SidebarControl;

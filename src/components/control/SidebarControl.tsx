/* eslint-disable @typescript-eslint/no-explicit-any */
import { Map } from 'leaflet';
import React, { useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiCompass,
  FiHome,
  FiSearch,
  FiSettings,
} from 'react-icons/fi';

import { getFontClassName } from '@/lib/fonts';
import logger from '@/lib/logger';

import TextButton from '@/components/buttons/TextButton';
import {
  CategoryGroup,
  SearchResult,
  Sidebar,
  Tab,
} from '@/components/control/sidebar';
import UnderlineLink from '@/components/links/UnderlineLink';
import Loader from '@/components/loader/Loader';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { CategoryIdToCountT } from '@/types/category';
import {
  LocationGroupType,
  LocationType,
  MarkerIdToMarkerRefT,
} from '@/types/location';

interface SidebarControlPropsType {
  map: Map | any;
  locationGroups: LocationGroupType[];
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  categoryCounts: CategoryIdToCountT;
  markerRefs: MarkerIdToMarkerRefT;
  searchResults: LocationType[];
  setSearchResults: React.Dispatch<React.SetStateAction<LocationType[]>>;
  setTriggerPopupWithId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SidebarControl: React.FC<SidebarControlPropsType> = ({
  map,
  locationGroups,
  setHide,
  categoryCounts,
  markerRefs,
  searchResults,
  setSearchResults,
  setTriggerPopupWithId,
}) => {
  const {
    toggleHideCompleted,
    userSettings,
    toggleHidingCategories,
    areaConfig: config,
  } = useLocalStorageContext();

  const [openTab, setOpenTab] = useState<string | boolean>('home');
  const [searching, setSearching] = useState<boolean>(false);
  const font = config?.font;

  let prevGroup = '';

  const fontClassName = getFontClassName(font);

  const onClose = () => {
    setOpenTab(false);
  };

  const onOpen = (id: string) => {
    setOpenTab(id);
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
        `/api/marker/find?searchParam=` +
          searchParam +
          `&mapSlug=${config?.name}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      );
      const json = await res.json();
      setSearchResults(json);
      setSearching(false);
    } catch (error) {
      logger(error);
      setSearching(false);
    }
  };

  useEffect(() => {
    if (openTab !== 'search') {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTab]);

  return (
    <section className={`Sidebar ${fontClassName}`}>
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
          gameSlug={config?.gameSlug}
        >
          <div className='flex flex-col'>
            <hr />
            <div className='my-5 flex flex-wrap items-center justify-center gap-6 align-middle'>
              {config?.subSelections?.map((selection) => {
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
            <hr />
            <div className='my-5 flex flex-wrap items-center justify-center gap-6 align-middle'>
              <TextButton
                className='text-primary-200'
                onClick={() =>
                  toggleHidingCategories(config?.name, locationGroups)
                }
              >
                {userSettings?.hideAllCategories ? 'Show All' : 'Hide All'}
              </TextButton>
              <TextButton
                className='text-primary-200'
                onClick={toggleHideCompleted}
              >
                {userSettings?.hideCompleted
                  ? 'Show Completed'
                  : 'Hide Completed'}
              </TextButton>
            </div>
          </div>
          <hr />
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
          gameSlug={config?.gameSlug}
        >
          <div className='mt-5 flex flex-col flex-wrap items-center justify-center gap-2 align-middle'>
            {config?.subSelections?.map((selection) => {
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
          gameSlug={config?.gameSlug}
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
                map={map.target}
                setTriggerPopupWithId={setTriggerPopupWithId}
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

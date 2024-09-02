import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

import clsx from '@/lib/clsxm';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import NextImage from '@/components/NextImage';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { CategoryIdToCountT } from '@/types/category';
import { LocationGroupType } from '@/types/location';

interface CategoryGroupPropsType {
  categoryId: number;
  group: string;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  categoryCounts: CategoryIdToCountT;
  currentGroup: LocationGroupType[];
}

const CategoryGroup: React.FC<CategoryGroupPropsType> = ({
  group,
  setHide,
  categoryCounts,
  currentGroup,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    hiddenCategories,
    completedCount,
    toggleGroupHiddenState,
    areaConfig,
  } = useLocalStorageContext();

  const mapHiddenCategories: number[] = areaConfig?.name
    ? hiddenCategories[areaConfig.name]
    : [];

  if (!areaConfig) {
    return null;
  }

  return (
    <div className='text-primary-200 flex flex-col py-1 hover:cursor-pointer'>
      <div className='flex flex-wrap items-center'>
        {collapsed ? (
          <FiPlus className='mr-3' onClick={() => setCollapsed(false)} />
        ) : (
          <FiMinus className='mr-3' onClick={() => setCollapsed(true)} />
        )}

        <div
          className='py-3'
          onClick={() => toggleGroupHiddenState(currentGroup)}
        >
          {group.toUpperCase()}
        </div>
      </div>

      <div className='group-container flex flex-wrap'>
        {!collapsed &&
          currentGroup.map((member) => {
            const hiddenFlag = mapHiddenCategories?.includes(member.categoryId);
            return (
              <div
                key={member.categoryId}
                className='flex flex-row justify-between'
                onClick={() => setHide(member.categoryId)}
              >
                <NextImage
                  useSkeleton
                  src={`/images/icons/${member.categoryId}.png`}
                  width='25'
                  height='0'
                  alt='Icon'
                  fallbackSrc={`/images/icons/${group}.png`}
                  className='w-auto'
                />
                <p className={clsx([hiddenFlag && 'line-through	'])}>
                  {categoryIdNameMap[member.categoryId]}
                </p>
                <p className={clsx([hiddenFlag && 'line-through	'])}>
                  {(areaConfig.name &&
                    completedCount[areaConfig?.name] &&
                    completedCount[areaConfig?.name][member.categoryId]) ||
                    0}
                  /{categoryCounts[member.categoryId]}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryGroup;

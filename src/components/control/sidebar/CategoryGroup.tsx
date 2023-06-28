import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import clsxm from '@/lib/clsxm';
import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import NextImage from '@/components/NextImage';

import { CategoryIdToCountT, MapToCategoryIdCountT } from '@/types/category';
import { AreaConfigType } from '@/types/config';
import { LocationGroupType } from '@/types/location';

interface CategoryGroupPropsType {
  categoryId: number;
  group: string;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  categoryCounts: CategoryIdToCountT;
  currentGroup: LocationGroupType[];
  config: AreaConfigType;
}

const CategoryGroup: React.FC<CategoryGroupPropsType> = ({
  group,
  setHide,
  categoryCounts,
  currentGroup,
  config,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: { [config.name]: [] as number[] },
    }
  );

  const [completedCount] = useLocalStorageState('rm_completed_count', {
    defaultValue: { [config.name]: {} } as MapToCategoryIdCountT,
  });

  const handleGroupToggle = () => {
    let numOfHidden = 0;
    const currentCategories: number[] = [];
    currentGroup.map((group) => {
      numOfHidden = hiddenCategories[config.name].includes(group.categoryId)
        ? numOfHidden + 1
        : numOfHidden;
      currentCategories.push(group.categoryId);
    });

    // all categories are hidden, toggle all to show
    if (numOfHidden === currentGroup.length) {
      let data = hiddenCategories[config.name];
      currentCategories.map((category) => {
        data = data.filter((item) => item !== category);
      });

      setHiddenCategories((prev) => ({
        ...prev,
        [config.name]: [...data],
      }));
    } else {
      currentCategories.map((category) => {
        if (!hiddenCategories[config.name].includes(category)) {
          setHiddenCategories((prev) => ({
            ...prev,
            [config.name]: [...prev[config.name], category],
          }));
        }
      });
    }
  };

  useEffect(() => {
    if (!hiddenCategories[config.name]) {
      setHiddenCategories((prev) => ({ ...prev, [config.name]: [] }));
    }
  }, [config.name, hiddenCategories, setHiddenCategories]);

  const mapHiddenCategories: number[] = hiddenCategories[config.name];

  return (
    <div className='text-primary-200 flex flex-col py-1 hover:cursor-pointer'>
      <div className='flex items-center'>
        {collapsed ? (
          <FiChevronUp className='mr-3' onClick={() => setCollapsed(false)} />
        ) : (
          <FiChevronDown className='mr-3' onClick={() => setCollapsed(true)} />
        )}

        <div className='py-3' onClick={handleGroupToggle}>
          {group.toUpperCase()}
        </div>
      </div>

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
                height='25'
                alt='Icon'
              />
              <p className={clsxm([hiddenFlag && 'line-through	'])}>
                {categoryIdNameMap[member.categoryId]}
              </p>
              <p className={clsxm([hiddenFlag && 'line-through	'])}>
                {(completedCount[config.name] &&
                  completedCount[config.name][member.categoryId]) ||
                  0}
                /{categoryCounts[member.categoryId]}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default CategoryGroup;

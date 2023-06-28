import { useEffect, useState } from 'react';
import { Popup } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import { MapToCompletedT } from '@/types/category';
import { AreaConfigType } from '@/types/config';
import { LocationType } from '@/types/location';

interface RMPopupPropsType {
  location: LocationType;
  config: AreaConfigType;
}

const RMPopup: React.FC<RMPopupPropsType> = ({ location, config }) => {
  const [completed, setCompleted] = useLocalStorageState('rm_completed', {
    defaultValue: { [config.name]: [] as string[] } as MapToCompletedT,
  });
  const [completedCount, setCompletedCount] = useLocalStorageState(
    'rm_completed_count',
    {
      defaultValue: { [config.name]: { [location.categoryId]: 0 } },
    }
  );

  const { markerName, categoryId, _id, description } = location;
  const [checked, setChecked] = useState<boolean>(
    completed[config.name]?.includes(_id)
  );

  const handleCompletionCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const newCompleted = completed[config.name] || [];
    if (!e.target.checked) {
      const lst = completed[config.name]?.filter((item) => item !== id) || [];
      setCompleted((prev) => ({ ...prev, [config.name]: [...lst] }));
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          [location.categoryId]: prev[config.name][location.categoryId] - 1,
        },
      }));
    } else {
      newCompleted.push(id);
      setCompleted((prev) => ({ ...prev, [config.name]: [...newCompleted] }));
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          [location.categoryId]:
            prev[config.name][location.categoryId] + 1 || 1,
        },
      }));
    }
    setChecked(e.target.checked);
  };

  useEffect(() => {
    if (!completedCount[config.name]) {
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: { [location.categoryId]: 0 },
      }));
    }
  });
  return (
    <Popup className='rm-popup'>
      <p className='font-hylia text-lg'>{markerName}</p>
      <p>{categoryIdNameMap[categoryId]}</p>
      {description && (
        <div
          key={_id}
          className='text-primary-100 m-1'
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      <div className='dark:border-primary-700 border-primary-200 mt-3 flex items-center rounded border pl-4'>
        <input
          type='checkbox'
          value=''
          checked={checked}
          className='text-primary-100 border-primary-300 bg-primary-100 focus:ring-primary-400 dark:border-primary-600 dark:bg-primary-700 dark:color-primary-800 dark:focus:color-primary-600 h-4 w-4 rounded hover:cursor-pointer focus:ring-2'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleCompletionCheck(e, location._id)
          }
        />
        <label className='text-primary-300 dark:text-primary-600 ml-2 w-full py-4 text-sm font-medium'>
          Completed
        </label>
      </div>
    </Popup>
  );
};

export default RMPopup;

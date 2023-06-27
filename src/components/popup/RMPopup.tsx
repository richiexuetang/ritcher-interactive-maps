import { useState } from 'react';
import { Popup } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import { LocationType } from '@/types/location';

interface RMPopupPropsType {
  location: LocationType;
}

const RMPopup: React.FC<RMPopupPropsType> = ({ location }) => {
  const [completed, setCompleted] = useLocalStorageState('rm_completed', {
    defaultValue: [] as string[],
  });
  const [_, setCompletedCount] = useLocalStorageState('rm_completed_count', {
    defaultValue: { [location.categoryId]: 0 },
  });

  const { markerName, categoryId, _id, description } = location;
  const [checked, setChecked] = useState<boolean>(completed?.includes(_id));

  const handleCompletionCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const newCompleted = completed;
    if (!e.target.checked) {
      const lst = completed.filter((item) => item !== id);
      setCompleted([...lst]);
      setCompletedCount((prev) => ({
        ...prev,
        [location.categoryId]: prev[location.categoryId] - 1,
      }));
    } else {
      newCompleted.push(id);
      setCompleted([...newCompleted]);
      setCompletedCount((prev) => ({
        ...prev,
        [location.categoryId]: prev[location.categoryId] + 1 || 1,
      }));
    }
    setChecked(e.target.checked);
  };

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

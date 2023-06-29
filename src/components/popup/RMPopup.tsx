/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { Popup } from 'react-leaflet';

import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';
import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import IconButton from '@/components/buttons/IconButton';

import { MapToCompletedT } from '@/types/category';
import { AreaConfigType } from '@/types/config';
import { LocationType } from '@/types/location';

interface RMPopupPropsType {
  location: LocationType;
  config: AreaConfigType;
  triggerPopup: boolean;
  setTriggerPopup: any;
  markerRefs: any;
  hasChild?: boolean;
  font: string;
}

const RMPopup: React.FC<RMPopupPropsType> = ({
  location,
  config,
  triggerPopup,
  setTriggerPopup,
  markerRefs,
  hasChild,
  font,
}) => {
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
  const [_, copy] = useCopyToClipboard();
  const pathname = usePathname();

  const handleCompletionCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const newCompleted = completed[config.name] || [];
    const decrement = hasChild ? -2 : -1;
    if (!e.target.checked) {
      const lst = completed[config.name]?.filter((item) => item !== id) || [];
      setCompleted((prev) => ({ ...prev, [config.name]: [...lst] }));
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          [location.categoryId]:
            prev[config.name][location.categoryId] + decrement,
        },
      }));
    } else {
      newCompleted.push(id);
      const increment = hasChild ? 2 : 1;
      setCompleted((prev) => ({ ...prev, [config.name]: [...newCompleted] }));
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: {
          ...prev[config.name],
          [location.categoryId]:
            prev[config.name][location.categoryId] + increment || increment,
        },
      }));
    }
    setChecked(e.target.checked);
  };

  useEffect(() => {
    if (triggerPopup) {
      markerRefs[location._id]?.openPopup();
      setTriggerPopup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerPopup, markerRefs]);

  useEffect(() => {
    if (!completedCount[config.name]) {
      setCompletedCount((prev) => ({
        ...prev,
        [config.name]: { [location.categoryId]: 0 },
      }));
    }
  });

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${location._id}`);
  };

  return (
    <Popup className='rm-popup'>
      <div className='flex'>
        <div className='flex flex-col'>
          <p className={`font-${font} text-lg`}>{markerName}</p>
          <p>{categoryIdNameMap[categoryId]}</p>
        </div>
        <IconButton
          icon={FiLink}
          className='ml-5 border-none bg-transparent'
          onClick={handleCopyLink}
        />
      </div>

      {description && (
        <div
          key={_id}
          className='text-primary-100 m-4'
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FiLink } from 'react-icons/fi';
import { Popup } from 'react-leaflet';

import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';

import { categoryIdNameMap } from '@/data/config/categoryItems';

import IconButton from '@/components/buttons/IconButton';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { LocationType } from '@/types/location';

interface RMPopupPropsType {
  location: LocationType;
  triggerPopup: boolean;
  setTriggerPopup: Dispatch<SetStateAction<boolean>>;
  markerRefs: any;
  hasChild?: boolean;
}

const RMPopup: React.FC<RMPopupPropsType> = ({
  location,
  triggerPopup,
  setTriggerPopup,
  markerRefs,
  hasChild,
}) => {
  const {
    setCompletedCount,
    completed,
    setCompleted,
    areaConfig: config,
  } = useLocalStorageContext();

  const { markerName, categoryId, _id, description } = location;
  const [checked, setChecked] = useState<boolean>(
    config?.name ? completed[config?.name]?.includes(_id) : false
  );
  const [_, copy] = useCopyToClipboard();
  const pathname = usePathname();

  const handleCompletionCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (config?.name) {
      const newCompleted = completed[config?.name] || [];
      const decrement = hasChild ? -2 : -1;
      if (!e.target.checked) {
        const lst =
          (config?.name &&
            completed[config?.name]?.filter((item: string) => item !== id)) ||
          [];
        setCompleted((prev: any) => ({ ...prev, [config.name]: [...lst] }));
        setCompletedCount((prev: { [x: string]: (string | number)[] }) => ({
          ...prev,
          [config.name]: {
            ...prev[config.name],
            [location.categoryId]:
              (prev[config.name][location.categoryId] as number) + decrement ||
              0,
          },
        }));
      } else {
        newCompleted.push(id);
        const increment = hasChild ? 2 : 1;
        setCompleted((prev: any) => ({
          ...prev,
          [config.name]: [...newCompleted],
        }));
        setCompletedCount((prev: { [x: string]: number[] }) => ({
          ...prev,
          [config.name]: {
            ...prev[config.name],
            [location.categoryId]:
              prev[config.name][location.categoryId] + increment || increment,
          },
        }));
      }
      setChecked(e.target.checked);
    }
  };

  useEffect(() => {
    if (triggerPopup) {
      markerRefs[location._id]?.openPopup();
      setTriggerPopup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerPopup, markerRefs]);

  const handleCopyLink = () => {
    copy(`${process.env.BASE_URL}${pathname}?markerId=${location._id}`);
  };

  return (
    <Popup className='rm-popup'>
      <div className='flex'>
        <div className='flex flex-col'>
          <p className={`font-${config?.font} text-lg`}>{markerName}</p>
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

import { LatLngExpression, Map } from 'leaflet';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import NextImage from '@/components/NextImage';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { LocationType } from '@/types/location';

interface SearchResultPropsType {
  result: LocationType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerRef: any;
  map: Map;
  setTriggerPopupWithId: Dispatch<SetStateAction<string | null>>;
}

const SearchResult: React.FC<SearchResultPropsType> = ({
  result,
  markerRef,
  map,
  setTriggerPopupWithId,
}) => {
  const {
    _id: id,
    categoryId,
    description,
    markerName,
    mapSlug,
    coordinate,
  } = result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markerOverlays, setMarkerOverlays] = useState<any>({});
  const ref = useRef<HTMLDivElement | null>(null);

  const { areaConfig: config } = useLocalStorageContext();

  const goToPosition = () => {
    if (mapSlug === config?.name) {
      map.panTo(coordinate as LatLngExpression);
      markerRef?.openPopup();
      setTriggerPopupWithId(id);
    }
  };

  const handleMouseEnter = () => {
    if (markerRef) {
      const overlay = L.circle(markerRef._latlng, {
        radius: (1000 + map.getZoom() * 100) / map.getZoom(),
      });
      setMarkerOverlays({ ...markerOverlays, [id]: overlay });
      overlay.addTo(map);
      map.flyTo(coordinate as LatLngExpression, map.getZoom());
    }
  };

  const handleMouseLeave = () => {
    if (id in markerOverlays) {
      map.removeLayer(markerOverlays[id]);

      const newData = { ...markerOverlays };
      delete newData[id];
      setMarkerOverlays({ ...newData });
    }
  };

  useEffect(() => {
    const el = ref?.current;
    if (el) {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      el?.removeEventListener('mouseenter', handleMouseEnter);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  return (
    <div
      className='text-primary-200 border-t-2 border-t-black pb-1'
      ref={ref}
      onClick={goToPosition}
    >
      <div className='my-4 flex'>
        <div className='mr-1 flex h-5 w-5 items-center justify-center'>
          <NextImage
            useSkeleton
            src={`/images/icons/${categoryId}.png`}
            width='25'
            height='25'
            alt='Icon'
          />
        </div>
        <div>{markerName}</div>
      </div>
      <div
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        dangerouslySetInnerHTML={{ __html: description! }}
      />
    </div>
  );
};

export default SearchResult;

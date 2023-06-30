/* eslint-disable @typescript-eslint/no-explicit-any */
import { LatLngExpression, Polyline } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-leaflet';
import 'leaflet-contextmenu';

import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';

import useCopyToClipboard from '@/lib/hooks/useCopyToClipboard';

import PathDecorator from '@/components/layer/path/PathDecorator';
import RMPopup from '@/components/popup/RMPopup';

import { useLocalStorageContext } from '@/context/localStorageContext';

import { LocationType, PathType } from '@/types/location';

interface RMMarkerPropsType {
  markerRefs: any;
  location: LocationType;
  rank: number;
  childPath?: PathType | undefined;
  triggerPopupWithId?: string | null;
  setTriggerPopupWithId?: Dispatch<SetStateAction<string | null>>;
}

const RMMarker: React.FC<RMMarkerPropsType> = ({
  markerRefs,
  location,
  rank,
  childPath,
  triggerPopupWithId,
  setTriggerPopupWithId,
}) => {
  const { areaConfig: config } = useLocalStorageContext();

  const map = useMap();
  const params = useSearchParams();
  const markerSearchParam = params.get('markerId');

  const [polylines, setPolylines] = useState<Polyline[] | any[]>([]);

  const { completed: completedMarkers, userSettings } =
    useLocalStorageContext();

  const [completed, setCompleted] = useState(false);
  const [hideMarker, setHideMarker] = useState(false);
  const [triggerPopup, setTriggerPopup] = useState(false);

  const [_, copy] = useCopyToClipboard();

  useEffect(() => {
    if (markerSearchParam && markerSearchParam === location._id) {
      map.flyTo(location?.coordinate as LatLngExpression, map.getMaxZoom(), {
        animate: true,
        duration: 0.5,
      });

      setTriggerPopup(true);
      window.history.replaceState(null, '', `/map/${config?.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerSearchParam]);

  useEffect(() => {
    if (
      config?.name &&
      completedMarkers[config.name]?.includes(location._id) &&
      !completed
    ) {
      setCompleted(true);
    }
  }, [completedMarkers, completed, setCompleted, location._id, config]);

  useEffect(() => {
    if (userSettings.hideCompleted && completed) {
      setHideMarker(true);
    }
    if (!userSettings.hideCompleted) {
      setHideMarker(false);
    }
  }, [userSettings, completed]);

  const arrow = [
    {
      offset: '100%',
      repeat: 0,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
    {
      offset: '20%',
      repeat: '40%',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      symbol: L.Symbol.arrowHead({
        pixelSize: 15,
        polygon: false,
        pathOptions: { stroke: true },
      }),
    },
  ];

  useEffect(() => {
    if (polylines.length && hideMarker) {
      polylines.map((polyline) => {
        if (map.hasLayer(polyline)) {
          map.removeLayer(polyline);
        }
      });
      setPolylines([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polylines, hideMarker]);

  useEffect(() => {
    if (triggerPopupWithId && location._id === triggerPopupWithId) {
      setTriggerPopup(true);
      if (setTriggerPopupWithId) {
        setTriggerPopupWithId(null);
      }
    }
  }, [triggerPopupWithId, location._id, setTriggerPopupWithId]);

  const getMarkerId = () => {
    copy(location._id);
  };

  const copyMarkerCoordinate = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    copy(`${location.coordinate[0]}, ${location.coordinate[1]}`);
  };

  return !hideMarker ? (
    <>
      {childPath?.path && (
        <PathDecorator
          patterns={arrow}
          polyline={childPath.path as LatLngExpression[]}
          setPolylines={setPolylines}
        />
      )}
      <Marker
        ref={(ref) => (markerRefs[location._id] = ref)}
        opacity={completed ? 0.5 : 1}
        position={location.coordinate as LatLngExpression}
        icon={L.icon({
          iconUrl: `/images/icons/${location.categoryId}.png`,
          iconSize: [35, 45],
          iconAnchor: [17, 45],
        })}
        zIndexOffset={rank}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        contextmenu={true}
        contextmenuWidth={140}
        contextmenuItems={[
          {
            text: 'Get marker id',
            callback: getMarkerId,
          },
          {
            text: 'Get marker coordinate',
            callback: copyMarkerCoordinate,
          },
        ]}
      >
        <RMPopup
          location={location}
          triggerPopup={triggerPopup}
          setTriggerPopup={setTriggerPopup}
          markerRefs={markerRefs}
          hasChild={childPath?.categoryId === location.categoryId}
        />
      </Marker>
    </>
  ) : null;
};

export default RMMarker;

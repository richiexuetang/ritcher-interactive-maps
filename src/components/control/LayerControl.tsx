import { Layer, Util } from 'leaflet';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';

import useLocalStorageState from '@/lib/hooks/useLocalStorage';

import { LayersControlProvider } from '@/components/control/context';

import createControlledLayer from './controlledLayer';

import { AreaConfigType } from '@/types/config';

interface LayerControlPropsType {
  hide: number | null;
  setHide: React.Dispatch<React.SetStateAction<number | null>>;
  config: AreaConfigType;
}

interface LayerObjType {
  group: string;
  name: number;
  checked: boolean;
  id: number;
  layer: Layer;
}

type MapGroupToLayerT = {
  [group: string]: LayerObjType[];
};

const LayerControl: React.FC<PropsWithChildren<LayerControlPropsType>> = ({
  children,
  hide,
  setHide,
  config,
}) => {
  const [layers, setLayers] = useState<LayerObjType[]>([]);
  const [groupedLayers, setGroupedLayers] = useState({});

  const [hiddenCategories, setHiddenCategories] = useLocalStorageState(
    'rm_hidden_categories',
    {
      defaultValue: { [config.name]: [] as number[] },
    }
  );

  useEffect(() => {
    if (!hiddenCategories[config.name]) {
      setHiddenCategories((prev) => ({ ...prev, [config.name]: [] }));
    }
  }, [config.name, hiddenCategories, setHiddenCategories]);

  const map = useMapEvents({
    layerremove: () => {
      // console.log("layer removed");
    },
    layeradd: () => {
      // console.log("layer add");
    },
  });

  const onGroupAdd = (layer: Layer, name: number, group: string) => {
    setLayers((_layers) => [
      ..._layers,
      {
        layer,
        group,
        name,
        checked: map?.hasLayer(layer),
        id: Util.stamp(layer),
      },
    ]);
  };

  useEffect(() => {
    if (hide) {
      const target = layers.find((item) => item.name === (hide as number));
      if (map?.hasLayer(target?.layer as Layer)) {
        map.removeLayer(target?.layer as Layer);
        const mapHidden: number[] = hiddenCategories[config.name];
        mapHidden.push(hide);
        setHiddenCategories((prev) => ({
          ...prev,
          [config.name]: [...mapHidden],
        }));
        setLayers(
          layers.map((layer) => {
            if (layer.id === target?.id)
              return {
                ...layer,
                checked: false,
              };
            return layer;
          })
        );
      } else {
        map.addLayer(target?.layer as Layer);
        const mapHidden = hiddenCategories[config.name].filter(
          (item) => item !== hide
        );
        setHiddenCategories((prev) => ({
          ...prev,
          [config.name]: [...mapHidden],
        }));
        setLayers(
          layers.map((layer) => {
            if (layer.id === target?.id)
              return {
                ...layer,
                checked: true,
              };
            return layer;
          })
        );
      }
      setHide(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide, setHide, map, layers, config.name]);

  useEffect(() => {
    if (Object.keys(groupedLayers).length === 0) {
      const seen = new Set();
      const data: MapGroupToLayerT = {};
      layers.map((layer) => {
        const { group, name } = layer;
        if (!seen.has(name)) {
          if (data[group]) {
            data[group].push(layer);
          } else {
            data[group] = [layer];
          }
          seen.add(name);
        }
      });
      setGroupedLayers({ ...data });
    }
  }, [layers, groupedLayers]);

  if (!groupedLayers) {
    return null;
  }

  return (
    <LayersControlProvider
      value={{
        layers,
        addGroup: onGroupAdd,
      }}
    >
      <div className='leaflet-top leaflet-right'>{children}</div>
    </LayersControlProvider>
  );
};

const GroupedLayer = createControlledLayer(function addGroup(
  layersControl: {
    addGroup: (layer: Layer, name: number, group: string) => void;
  },
  layer: Layer,
  name: number,
  group: string
) {
  layersControl.addGroup(layer, name, group);
});

export default LayerControl;
export { GroupedLayer };

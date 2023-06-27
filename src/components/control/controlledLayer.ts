/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { LeafletProvider, useLeafletContext } from '@react-leaflet/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLayerControlContext } from './context';

export default function createControlledLayer(addLayerToControl: any) {
  return function ControlledLayer(props: any) {
    const context = useLeafletContext();
    const layerContext = useLayerControlContext();
    const propsRef = useRef(props);

    const _useState = useState(null);
    const layer = _useState[0];
    const setLayer = _useState[1];

    const addLayer = useCallback(
      function addLayerCallback(layerToAdd: any) {
        const container = context.layerContainer || context.map;

        if (propsRef.current.checked) {
          container.addLayer(layerToAdd);
        }

        addLayerToControl(
          layerContext,
          layerToAdd,
          propsRef.current.name,
          propsRef.current.group
        );
        setLayer(layerToAdd);
      },
      [context]
    );
    const removeLayer = useCallback(
      function removeLayerCallback(this: any, layerToRemove: any) {
        const _context$layersContro =
          context.layersControl == null ? 0 : removeLayer(layerToRemove);
        setLayer(null);
      },
      [context]
    );

    const newContext = useMemo(
      function makeNewContext() {
        return context
          ? Object.assign({}, context, {
              layerContainer: {
                addLayer,
                removeLayer,
              },
            })
          : null;
      },
      [context, addLayer, removeLayer]
    );

    useEffect(function update() {
      const container = context.layerContainer || context.map;

      if (layer !== null && propsRef.current !== props) {
        if (
          props.checked === true &&
          (propsRef.current.checked == null ||
            propsRef.current.checked === false)
        ) {
          container.addLayer(layer);
        } else if (
          propsRef.current.checked === true &&
          (props.checked == null || props.checked === false)
        ) {
          container.removeLayer(layer);
        }

        propsRef.current = props;
      }

      return function checker() {
        if (layer) {
          const _context$layersContro2 =
            context.layersControl == null ? 0 : removeLayer(layer);
        }
      };
    });
    return props.children
      ? React.createElement(
          LeafletProvider,
          {
            value: newContext,
          },
          props.children
        )
      : null;
  };
}

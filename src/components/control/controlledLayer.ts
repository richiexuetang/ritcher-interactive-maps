/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import _mapInstanceProperty from '@babel/runtime-corejs3/core-js-stable/instance/map';
import _Object$assign from '@babel/runtime-corejs3/core-js-stable/object/assign';
import { LeafletProvider, useLeafletContext } from '@react-leaflet/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLayerControlContext } from './context';

export default function createControlledLayer(addLayerToControl) {
  return function ControlledLayer(props) {
    const context = useLeafletContext();
    const layerContext = useLayerControlContext();
    const propsRef = useRef(props);

    const _useState = useState(null);
    const layer = _useState[0];
    const setLayer = _useState[1];

    const addLayer = useCallback(
      function addLayerCallback(layerToAdd) {
        if (propsRef.current.checked) {
          _mapInstanceProperty(context).addLayer(layerToAdd);
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
          context.layersControl == null ? 0 : this.removeLayer(layerToRemove);
        setLayer(null);
      },
      [context]
    );

    const newContext = useMemo(
      function makeNewContext() {
        return context
          ? _Object$assign({}, context, {
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
      if (layer !== null && propsRef.current !== props) {
        if (
          props.checked === true &&
          (propsRef.current.checked == null ||
            propsRef.current.checked === false)
        ) {
          _mapInstanceProperty(context).addLayer(layer);
        } else if (
          propsRef.current.checked === true &&
          (props.checked == null || props.checked === false)
        ) {
          _mapInstanceProperty(context).removeLayer(layer);
        }

        propsRef.current = props;
      }

      return function checker() {
        if (layer) {
          const _context$layersContro2 =
            context.layersControl == null ? 0 : this.removeLayer(layer);
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

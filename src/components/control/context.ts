/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react';

interface LayersControlContextInterface {
  layers: any[];
  addGroup: any;
}

const LayersControlContext = createContext<LayersControlContextInterface>({
  layers: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addGroup: () => {},
});

export const LayersControlProvider = LayersControlContext.Provider;

export function useLayerControlContext() {
  const context = useContext(LayersControlContext);

  if (context == null) {
    throw new Error(
      'No context provided: useLayerControlContext() can only be used in a descendant of <LayerControl>'
    );
  }

  return context;
}

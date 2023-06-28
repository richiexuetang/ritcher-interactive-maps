/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPathComponent } from '@react-leaflet/core';
import L, { LeafletMouseEventHandlerFn } from 'leaflet';
import 'leaflet.markercluster';

type ClusterEvents = {
  onClick?: LeafletMouseEventHandlerFn;
  onDblClick?: LeafletMouseEventHandlerFn;
  onMouseDown?: LeafletMouseEventHandlerFn;
  onMouseUp?: LeafletMouseEventHandlerFn;
  onMouseOver?: LeafletMouseEventHandlerFn;
  onMouseOut?: LeafletMouseEventHandlerFn;
  onContextMenu?: LeafletMouseEventHandlerFn;
};

type MarkerClusterControl = L.MarkerClusterGroupOptions & {
  children: React.ReactNode;
  zoomToBoundsOnClick: boolean;
  fillColor?: string;
} & ClusterEvents;

const MarkerClusterGroup = createPathComponent(
  (props: MarkerClusterControl, ctx) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { children, ...rest } = props;
    const clusterProps: Record<string, any> = {};
    const clusterEvents: Record<string, any> = {};

    // Splitting props and events to different objects
    Object.entries(props).forEach(([propName, prop]) =>
      propName.startsWith('on')
        ? (clusterEvents[propName] = prop)
        : (clusterProps[propName] = prop)
    );

    // Creating markerClusterGroup Leaflet element
    const markerClusterGroup = L.markerClusterGroup(clusterProps);

    // Initializing event listeners
    Object.entries(clusterEvents).forEach(([eventAsProp, callback]) => {
      const clusterEvent = `cluster${eventAsProp.substring(2).toLowerCase()}`;
      markerClusterGroup.on(clusterEvent, callback);
    });

    return {
      instance: markerClusterGroup,
      context: { ...ctx, layerContainer: markerClusterGroup },
    };
  }
);

export default MarkerClusterGroup;

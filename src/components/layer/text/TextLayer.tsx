import React from 'react';

import TextContainer from './TextContainer';

import { TextOverlayType } from '@/types/location';

interface TextLayerPropsType {
  textOverlay: TextOverlayType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerRefs: any;
}

const TextLayer: React.FC<TextLayerPropsType> = (props) => {
  const { textOverlay, markerRefs } = props;

  return (
    <>
      {textOverlay.map(({ _id, coordinate, zoomRange, markerName }) => {
        return (
          <TextContainer
            key={_id}
            id={_id}
            position={coordinate}
            content={markerName}
            maxZoom={zoomRange[0]}
            minZoom={zoomRange[1]}
            markerRefs={markerRefs}
          />
        );
      })}
    </>
  );
};

export default TextLayer;

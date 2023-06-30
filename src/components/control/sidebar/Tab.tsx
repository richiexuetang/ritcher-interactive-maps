/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import React from 'react';

import NextImage from '@/components/NextImage';

const Tab = (props: any) => {
  const active = props.active ? ' active' : '';
  const closeIcon = closeIconSelector(props);
  const router = useRouter();

  return (
    <div id={props.id} className={`sidebar-pane${active}`}>
      <h1 className={`sidebar-header font-${props.font} !bg-primary-950`}>
        {props.header}
        <div className='sidebar-close' role='btn' onClick={props.onClose}>
          {closeIcon}
        </div>
      </h1>
      <div
        className='item-center flex justify-center hover:cursor-pointer'
        onClick={() => router.push('/game/' + props.gameSlug)}
      >
        <NextImage
          useSkeleton
          src={`/images/logos/${props.gameSlug}/logo.png`}
          width='350'
          height='60'
          alt='Icon'
        />
      </div>
      {props.children}
    </div>
  );
};

const closeIconSelector = (props: any) => {
  switch (typeof props.closeIcon) {
    case 'string':
      return <i className={props.closeIcon} />;
    case 'object':
      return props.closeIcon;
    default:
      return props.position === 'right' ? (
        <i className='fa fa-caret-right' />
      ) : (
        <i className='fa fa-caret-left' />
      );
  }
};

export default Tab;

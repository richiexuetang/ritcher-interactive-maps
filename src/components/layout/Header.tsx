import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-center'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Ritcher Maps
        </UnstyledLink>
      </div>
    </header>
  );
}

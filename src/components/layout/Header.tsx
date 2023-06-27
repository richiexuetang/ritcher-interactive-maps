import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='bg-primary-300 sticky top-0 z-50'>
      <div className='layout flex h-14 items-center justify-center'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Ritcher Maps
        </UnstyledLink>
      </div>
    </header>
  );
}

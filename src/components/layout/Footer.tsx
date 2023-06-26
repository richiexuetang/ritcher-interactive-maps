import UnderlineLink from '@/components/links/UnderlineLink';

const Footer = () => {
  return (
    <footer className='absolute bottom-2 text-gray-700'>
      © {new Date().getFullYear()} By
      <UnderlineLink href='/'>Richard Tang</UnderlineLink>
    </footer>
  );
};

export default Footer;

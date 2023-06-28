import ClipLoader from 'react-spinners/ClipLoader';

const Loader: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <ClipLoader
      size={100}
      loading={loading}
      cssOverride={{
        display: 'block',
        margin: '0 auto',
        borderColor: '#af894d',
      }}
      aria-label='Loading Spinner'
      data-testid='loader'
    />
  );
};

export default Loader;

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createContext, ReactElement, useState } from 'react';

const ConfigContext = createContext({
  gameSlug: '',
  mapSlug: '',
  font: '',
});

interface ConfigPropsInterface {
  children?: JSX.Element | JSX.Element[];
}

export function ConfigContextProvider(
  props: ConfigPropsInterface
): ReactElement {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [gameSlug, setGameSlug] = useState('');

  return (
    <ConfigContext.Provider value={{ gameSlug: '', mapSlug: '', font: '' }}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export default ConfigContext;

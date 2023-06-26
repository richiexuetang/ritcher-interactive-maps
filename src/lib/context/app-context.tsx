import { createContext, useContext, useState } from 'react';

import { GameDataType } from '@/types/config';

interface AppContextInterface {
  mapConfigInfo: GameDataType | null;
  setMapConfigInfo?: () => void;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider = ({ children }) => {
  const [mapConfigInfo, setMapConfigInfo] = useState<GameDataType | null>(null);

  return (
    <AppContext.Provider value={{ mapConfigInfo, setMapConfigInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside a `AppProvider`');
  }

  return context;
}

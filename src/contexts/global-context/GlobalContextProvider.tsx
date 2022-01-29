import React, {FC, useMemo} from 'react';
import {GlobalContext} from './GlobalContext';
import {createGlobalContext} from './createGlobalContext';
import {IGlobalContext} from './IGlobalContext';

const GlobalContextProvider: FC = ({children}) => {
  const value: IGlobalContext = useMemo(() => {
    return createGlobalContext();
  }, []);

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalContextProvider;

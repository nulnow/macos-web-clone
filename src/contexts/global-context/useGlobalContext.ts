import {useContext} from 'react';
import {IGlobalContext} from './IGlobalContext';
import {GlobalContext} from './GlobalContext';

export const useGlobalContext = (): IGlobalContext => {
  const contextValue: IGlobalContext | null = useContext(GlobalContext);
  if (!contextValue) {
    throw new Error('AppContext is not provided');
  }
  return contextValue;
};

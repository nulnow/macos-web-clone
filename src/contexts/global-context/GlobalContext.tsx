import {createContext, Context} from 'react';
import {IGlobalContext} from './IGlobalContext';

export const GlobalContext: Context<IGlobalContext | null> = createContext<IGlobalContext | null>(null);

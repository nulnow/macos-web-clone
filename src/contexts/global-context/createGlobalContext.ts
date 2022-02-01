import {IGlobalContext} from './IGlobalContext';
import System from '../../services/System';
import {ISystem} from '../../interfaces/ISystem';
import {IWindowManager} from '../../interfaces/IWindowManager';

export const createGlobalContext = (): IGlobalContext => {
  const system: ISystem = new System();
  const windowManager: IWindowManager = system.getWindowManager();

  return {
    system,
    windowManager,
  };
};

import {IGlobalContext} from './IGlobalContext';
import System from '../../services/System';
import {ISystem} from '../../models/ISystem';
import {IWindowManager} from '../../models/IWindowManager';

export const createGlobalContext = (): IGlobalContext => {
  const system: ISystem = new System();
  const windowManager: IWindowManager = system.getWindowManager();

  return {
    system,
    windowManager,
  };
};

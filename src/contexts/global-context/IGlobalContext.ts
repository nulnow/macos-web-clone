import {ISystem} from '../../interfaces/ISystem';
import {IWindowManager} from '../../interfaces/IWindowManager';

export interface IGlobalContext {
  system: ISystem;
  windowManager: IWindowManager;
}

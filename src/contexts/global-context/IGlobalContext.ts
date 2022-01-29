import {ISystem} from '../../models/ISystem';
import {IWindowManager} from '../../models/IWindowManager';

export interface IGlobalContext {
  system: ISystem;
  windowManager: IWindowManager;
}

import {IWindowManager} from './IWindowManager';
import {IProcess} from './IProcess';
import {IAppFactory} from './IAppFactory';
import {BehaviorSubject} from 'rxjs';

export interface ISystem {
  getWindowManager(): IWindowManager;
  spawnProcess<T extends IProcess>(factory: IAppFactory<T>): T;
  killProcess(pid: number): void;
  getProcesses$(): BehaviorSubject<IProcess[]>;
}

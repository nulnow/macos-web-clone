import {IWindow} from './IWindow';
import {IProcessStream} from './IProcessStream';

export interface IProcess {
  readonly pid: number;
  readonly meta?: any;

  start(): void;
  getWindows(): IWindow[];
  onClose?(): void;

  // todo
  readonly inputStream$: IProcessStream;
  readonly outputStream$: IProcessStream;
  readonly errorStream$: IProcessStream;
}

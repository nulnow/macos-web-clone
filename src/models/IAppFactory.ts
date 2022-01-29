import {ISystem} from './ISystem';
import {IProcess} from './IProcess';
import {IProcessStream} from './IProcessStream';

export interface IAppFactory<T extends IProcess> {
  create(
    system: ISystem,
    pid: number,
    inputStream: IProcessStream,
    outputStream: IProcessStream,
    errorStream: IProcessStream
  ): T;
}

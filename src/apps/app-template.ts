import {ISystem} from '../models/ISystem';
import {IProcessStream} from '../models/IProcessStream';
import {IProcess} from '../models/IProcess';
import {IWindow} from '../models/IWindow';

export default abstract class AppTemplate implements IProcess {
  protected constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public getWindows(): IWindow[] {
    return [];
  }

  public start(): void {}

  public onClose(): void {}
}

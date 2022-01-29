import {IProcess} from '../../models/IProcess';
import {IAppFactory} from '../../models/IAppFactory';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IShortcut} from '../../models/IShortcut';
import icon from '../../../resources/apps/paint/icon.svg';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';

export default class ProcessManager implements IProcess {
  public static readonly processManagerAppFactory: IAppFactory<ProcessManager> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): ProcessManager {
      return new ProcessManager(system, pid, inputStream, outputStream, errorStream);
    }
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Process manager',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(ProcessManager.processManagerAppFactory);
      }
    };
  }

  private mainWindow: IWindow | null = null;

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public getWindows(): IWindow[] {
    if (this.mainWindow) {
      return [this.mainWindow];
    }
    return [];
  }

  public start(): void {
    this.mainWindow = WindowManager.createBlankWindow(this);
  }

  public onClose(): void {}
}

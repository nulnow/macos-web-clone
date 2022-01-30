import {IAutoStart} from '../models/IAutoStart';
import {IProcess} from '../models/IProcess';
import {IAppFactory} from '../models/IAppFactory';
import {ISystem} from '../models/ISystem';
import {IProcessStream} from '../models/IProcessStream';
import {IWindow} from '../models/IWindow';
import WallpaperApp from '../apps/wallpaper/WallpaperApp';
import AboutApp from '../apps/about/AboutApp';

export default class AutoStart implements IAutoStart, IProcess {
  public static autoStartFactory: IAppFactory<AutoStart> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): AutoStart {
      return new AutoStart(system, pid, inputStream, outputStream, errorStream);
    },
  };

  public readonly meta = {
    name: 'Auto Start'
  };

  private constructor(
    private system: ISystem,
    public pid: number,
    public inputStream$: IProcessStream,
    public outputStream$: IProcessStream,
    public errorStream$: IProcessStream
  ) {}

  public start(): void {
    const aboutAppProcess: IProcess = this.system.spawnProcess(
      AboutApp.aboutAppFactory
    );
    const mainWindow: IWindow = aboutAppProcess.getWindows()[0];

    mainWindow.y$.next(200);
    mainWindow.x$.next(800);
    mainWindow.width$.next(400);
    mainWindow.height$.next(300);

    this.system.spawnProcess(WallpaperApp.wallpaperAppFactory);
  }

  public getWindows(): IWindow[] {
    return [];
  }
}

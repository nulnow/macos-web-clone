import {IAutoStart} from '../interfaces/IAutoStart';
import {IProcess} from '../interfaces/IProcess';
import {IAppFactory} from '../interfaces/IAppFactory';
import {ISystem} from '../interfaces/ISystem';
import {IProcessStream} from '../interfaces/IProcessStream';
import {IWindow} from '../interfaces/IWindow';
import BrowserApp from '../apps/browser/BrowserApp';

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
    const browserProcess: BrowserApp = this.system.spawnProcess(
      BrowserApp.factory
    );
    const mainWindow: IWindow = browserProcess.getWindows()[0];

    mainWindow.y$.next(100);
    mainWindow.x$.next(140);
    mainWindow.width$.next(800);
    mainWindow.height$.next(600);
    // browserProcess.setSelectedTab('https://www.wikipedia.org/');
    // this.system.spawnProcess(WallpaperApp.wallpaperAppFactory);
  }

  public getWindows(): IWindow[] {
    return [];
  }
}

import {IAutoStart} from '../models/IAutoStart';
import {IProcess} from '../models/IProcess';
import {IAppFactory} from '../models/IAppFactory';
import {ISystem} from '../models/ISystem';
import {IProcessStream} from '../models/IProcessStream';
import {IWindow} from '../models/IWindow';
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
    browserProcess.inputText$.next('https://www.wikipedia.org/');
    browserProcess.url$.next('https://www.wikipedia.org/');

    // this.system.spawnProcess(WallpaperApp.wallpaperAppFactory);
  }

  public getWindows(): IWindow[] {
    return [];
  }
}

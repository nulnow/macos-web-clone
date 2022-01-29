import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IAppFactory} from '../../models/IAppFactory';
import {IWindow} from '../../models/IWindow';
import {BehaviorSubject} from 'rxjs';
import {IShortcut} from '../../models/IShortcut';
import TerminalApp from '../terminal/TerminalApp';
import CyberBirdApp from '../cyber-bird/CyberBirdApp';
import WallpaperApp from '../wallpaper/WallpaperApp';
import VSCodeApp from '../vs-code/VSCodeApp';
import PaintApp from '../paint/PaintApp';
import WardaemonApp from '../wardaemon/WardaemonApp';
import SelfApp from '../self/SelfApp';
import AboutApp from '../about/AboutApp';
import TalkingFaceApp from '../talking-face/TalkingFaceApp';
import {tween} from '../../utils/rx/tween';
import {DOCK_ICON_SIZE} from '../../components/dock/dock-shortcut/consts';

const browserWindow: Window = ((): Window => {
  return globalThis as any as Window;
})();

export class DockApp implements IProcess {
  public static dockAppFactory: IAppFactory<DockApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): DockApp {
      return new DockApp(system, pid, inputStream, outputStream, errorStream);
    }
  };

  private readonly shortcuts$: BehaviorSubject<IShortcut[]> = new BehaviorSubject<IShortcut[]>([]);

  private readonly collapsedWindows$: BehaviorSubject<IWindow[]> = new BehaviorSubject<IWindow[]>(
    []
  );

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly errorStream$: IProcessStream,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream
  ) {
    this.shortcuts$.next([
      AboutApp.getAboutShortcut(system),
      TerminalApp.getTerminalShortcut(system),
      VSCodeApp.getShortcut(system),
      PaintApp.getShortcut(system),
      WallpaperApp.createShortcut(system),
      CyberBirdApp.getShortcut(system),
      WardaemonApp.getShortcut(system),
      SelfApp.getShortcut(system),
      TalkingFaceApp.getShortcut(system)
    ]);
  }

  public collapseWindow(window: IWindow): void {
    const DURATION: number = 1000;

    tween(0, -window.x$.getValue(), DURATION).subscribe(x => {
      window.transform$.next({
        ...window.transform$.getValue(),
        x: x - window.width$.getValue() / 2 - 25
      });
    });

    const Y_TO: number = browserWindow.innerHeight / 2 - window.y$.getValue();

    tween(0, Y_TO, DURATION).subscribe(y => {
      window.transform$.next({
        ...window.transform$.getValue(),
        y: y
      });
    });

    tween(window.width$.getValue(), DOCK_ICON_SIZE, DURATION).subscribe(w => {
      window.transform$.next({
        ...window.transform$.getValue(),
        scaleX: w / window.width$.getValue()
      });
    });

    tween(window.height$.getValue(), DOCK_ICON_SIZE, DURATION).subscribe(h => {
      window.transform$.next({
        ...window.transform$.getValue(),
        scaleY: h / window.height$.getValue()
      });
    });

    setTimeout(() => {
      this.collapsedWindows$.next([...this.collapsedWindows$.getValue(), window]);
      window.transform$.next({
        ...window.transform$.getValue(),
        x: 0,
        y: 0,
        collapsed: true
      });
    }, DURATION);
  }

  public uncollapseWindow(window: IWindow): void {
    window.transform$.next({});
    this.collapsedWindows$.next(this.collapsedWindows$.getValue().filter(w => w.id !== window.id));
  }

  public getWindows(): IWindow[] {
    return [];
  }

  public start(): void {}

  public onClose(): void {}

  public getShortcuts$(): BehaviorSubject<IShortcut[]> {
    return this.shortcuts$;
  }

  public getCollapsedWindows$(): BehaviorSubject<IWindow[]> {
    return this.collapsedWindows$;
  }
}

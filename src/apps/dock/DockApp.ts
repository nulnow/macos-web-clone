import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IAppFactory} from '../../models/IAppFactory';
import {IWindow} from '../../models/IWindow';
import {BehaviorSubject, Subscription} from 'rxjs';
import {IShortcut} from '../../models/IShortcut';
import TerminalApp from '../terminal/TerminalApp';
import CyberBirdApp from '../cyber-bird/CyberBirdApp';
import WallpaperApp from '../wallpaper/WallpaperApp';
import PaintApp from '../paint/PaintApp';
import AboutApp from '../about/AboutApp';
import TalkingFaceApp from '../talking-face/TalkingFaceApp';
import {tween} from '../../utils/rx/tween';
import {DOCK_ICON_SIZE} from '../../components/dock/dock-shortcut/consts';
import ProcessManager from '../process-manager/ProcessManager';
import {mapWindowsSubjectToCollapsedWindowsSubject} from '../../utils/rx/mapWindowsSubjectToCollapsedWindowsSubject';

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

  public readonly meta = {
    name: 'Dock'
  };

  private readonly shortcuts$: BehaviorSubject<IShortcut[]> = new BehaviorSubject<IShortcut[]>([]);

  private collapsedWindows$: BehaviorSubject<IWindow[]> = new BehaviorSubject<IWindow[]>([]);

  private initializeCollapsedWindows(): void {
    mapWindowsSubjectToCollapsedWindowsSubject(
      this.system.getWindowManager().getWindows$()
    ).subscribe(this.collapsedWindows$);
  }

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
      ProcessManager.getShortcut(system),
      PaintApp.getShortcut(system),
      WallpaperApp.createShortcut(system),
      CyberBirdApp.getShortcut(system),
      // WardaemonApp.getShortcut(system),
      // SelfApp.getShortcut(system),
      // IphoneMockupApp.getShortcut(system),
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
      window.transform$.next({
        ...window.transform$.getValue(),
        x: 0,
        y: 0,
        collapsed: true
      });
      // this.collapsedWindows$.next([...this.collapsedWindows$.getValue(), window]);
    }, DURATION);
  }

  public uncollapseWindow(window: IWindow): void {
    window.transform$.next({});
    // this.collapsedWindows$.next(this.collapsedWindows$.getValue().filter(w => w.id !== window.id));
  }

  public getWindows(): IWindow[] {
    return [];
  }

  private windowsSubscription: Subscription | null = null;

  public start(): void {
    // TODO Find a way to do this properly
    // this setTimeout allows to access IWindowManager because
    // DockApp instantiated in `start` method of WindowManager
    setTimeout(() => {
      // const windowManager: IWindowManager = this.system.getWindowManager();
      this.initializeCollapsedWindows();
      // this.collapsedWindows$
      // this.windowsSubscription = windowManager.getWindows$().subscribe(windows => {
      //   this.collapsedWindows$.next(
      //     this.collapsedWindows$.getValue().filter(window => windows.includes(window))
      //   );
      // });
    }, 0);
  }

  public onClose(): void {
    if (this.windowsSubscription) {
      this.windowsSubscription.unsubscribe();
      this.windowsSubscription = null;
    }
  }

  public getShortcuts$(): BehaviorSubject<IShortcut[]> {
    return this.shortcuts$;
  }

  public getCollapsedWindows$(): BehaviorSubject<IWindow[]> {
    if (!this.collapsedWindows$) {
      throw new Error('this.collapsedWindows is null');
    }

    return this.collapsedWindows$;
  }
}

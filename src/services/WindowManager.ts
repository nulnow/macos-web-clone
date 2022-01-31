import {IWindowManager} from '../models/IWindowManager';
import {BehaviorSubject} from 'rxjs';
import {IWindow} from '../models/IWindow';
import React, {ReactElement} from 'react';
import {IAppFactory} from '../models/IAppFactory';
import {ISystem} from '../models/ISystem';
import {IProcess} from '../models/IProcess';
import {IProcessStream} from '../models/IProcessStream';
import WindowManagerComponent from '../components/window-manager/WindowManagerComponent';
import {DockApp} from '../apps/dock/DockApp';
import {NAVBAR_HEIGHT} from '../components/navbar/consts';
import {APP_HEADER_HEIGHT} from '../components/app-layout/consts';
import {DOCK_WIDTH} from '../components/dock/consts';
import {tween} from '../utils/rx/tween';
import {decrease} from '../utils/rx/decrease';
import {IWindowTransform} from '../models/IWindowTransform';

const browserWindow: Window = ((): Window => {
  return globalThis as any as Window;
})();

export default class WindowManager implements IWindowManager, IProcess {
  private static generateUniqueId(windows: IWindow[]): number {
    let id: number = Math.random();
    while (windows.find(window => window.id === id)) {
      id = Math.random();
    }
    return id;
  }

  public static windowManagerFactory: IAppFactory<IWindowManager & IProcess> = {
    create(system, pid, inputStream, outputStream, errorStream): IWindowManager & IProcess {
      return new WindowManager(system, pid, inputStream, outputStream, errorStream);
    }
  };

  // TODO Move to Window class
  public static createBlankWindow(process: IProcess, params?: Partial<IWindow>): IWindow {
    const window: IWindow = {
      id: 0,
      title$: new BehaviorSubject<string>('untitled'),

      x$: new BehaviorSubject<number>(0),
      y$: new BehaviorSubject<number>(0),
      width$: new BehaviorSubject<number>(800),
      height$: new BehaviorSubject<number>(600),
      resizable$: new BehaviorSubject<boolean>(true),
      movable$: new BehaviorSubject<boolean>(true),
      isResizing$: new BehaviorSubject<boolean>(false),
      zIndex$: new BehaviorSubject<number>(0),

      component$: new BehaviorSubject<React.FC | null>(null),
      transform$: new BehaviorSubject<IWindowTransform>({}),
      fullscreen$: new BehaviorSubject<boolean>(false),

      process: process,

      ...params
    };
    WindowManager.moveToCenter(window);
    return window;
  }

  public static moveToCenter(window: IWindow): void {
    const y: number = browserWindow.innerHeight / 2 - window.height$.getValue() / 2;
    const x: number = browserWindow.innerWidth / 2 - window.width$.getValue() / 2;

    window.y$.next(y);
    window.x$.next(x);
  }

  private static readonly ANIMATION_DURATION = 150;

  public readonly meta = {
    name: 'Window Manager'
  };

  private readonly windows$: BehaviorSubject<IWindow[]> = new BehaviorSubject<IWindow[]>([]);

  private readonly wallpaperUrl$ = new BehaviorSubject<string | undefined>(undefined);

  private readonly wallpaperColor$ = new BehaviorSubject<string | undefined>(undefined);

  private readonly fullscreenWindow$: BehaviorSubject<IWindow | null> = new BehaviorSubject<IWindow | null>(null);

  private dockApp: DockApp | null = null;

  private constructor(
    private system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public start(): void {
    this.dockApp = this.system.spawnProcess(DockApp.dockAppFactory);
  }

  public getDockApp(): DockApp {
    if (!this.dockApp) throw new Error('this.docApp is null');
    return this.dockApp;
  }

  public createWindow(window: IWindow): IWindow {
    const newWindow: IWindow = {
      ...window,
      id: WindowManager.generateUniqueId(this.windows$.getValue())
    };

    this.windows$.next([...this.windows$.getValue(), newWindow]);

    this.setFocus(newWindow);
    WindowManager.moveToCenter(newWindow);
    return newWindow;
  }

  public closeWindow(window: IWindow): void {
    this.windows$.next(this.windows$.getValue().filter(w => w.id !== window.id));
    // TODO use a stream as with collapsed windows
    if (this.fullscreenWindow$.getValue()?.id === window.id) {
      this.fullscreenWindow$.next(null);
    }
  }

  public collapseWindow(window: IWindow): void {
    this.getDockApp().collapseWindow(window);
  }

  /**
   * Window manager does not have any windows
   */
  public getWindows(): IWindow[] {
    return [];
  }

  public getWindows$(): BehaviorSubject<IWindow[]> {
    return this.windows$;
  }

  public getProcessWindows(pid: number): IWindow[] {
    return this.windows$.value.filter(window => window.process.pid === pid);
  }

  public getWallpaperUrl$(): BehaviorSubject<string | undefined> {
    return this.wallpaperUrl$;
  }

  public setWallpaperUrl(url?: string): void {
    this.wallpaperUrl$.next(url);
  }

  public getWallpaperColor$(): BehaviorSubject<string | undefined> {
    return this.wallpaperColor$;
  }

  public setWallpaperColor(color?: string): void {
    this.wallpaperColor$.next(color);
  }

  public setFocus(window: IWindow): void {
    this.clearWindowsFocus();
    window.zIndex$.next(1);
  }

  public clearWindowsFocus(): void {
    this.windows$.getValue().forEach(window => {
      window.zIndex$.next(0);
    });
  }

  public render(): ReactElement<any, any> | null {
    return React.createElement(WindowManagerComponent, {windowManager: this});
  }

  public expand(window: IWindow): void {
    if (!window.resizable$.getValue()) {
      WindowManager.moveToCenter(window);
      return;
    }

    // TODO Move animations to somewhere
    const WIDTH_FROM: number = window.width$.getValue();
    const WIDTH_TO: number = browserWindow.innerWidth - DOCK_WIDTH;
    tween(WIDTH_FROM, WIDTH_TO, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.width$.next(x);
    });

    const HEIGHT_FROM: number = window.height$.getValue();
    const HEIGHT_TO: number = browserWindow.innerHeight - NAVBAR_HEIGHT - APP_HEADER_HEIGHT;
    tween(HEIGHT_FROM, HEIGHT_TO, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.height$.next(x);
    });

    const X_FROM: number = window.x$.getValue();
    const X_TO: number = DOCK_WIDTH;
    decrease(X_TO, X_FROM, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.x$.next(x);
    });

    const Y_FROM: number = window.y$.getValue();
    const Y_TO: number = NAVBAR_HEIGHT;
    decrease(Y_TO, Y_FROM, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.y$.next(x);
    });

    this.setFocus(window);
  }

  public unexpand(window: IWindow): void {
    const HEIGHT_FROM: number = window.height$.getValue();
    const HEIGHT_TO: number = 600;
    decrease(HEIGHT_TO, HEIGHT_FROM, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.height$.next(x);
    });

    const WIDTH_FROM: number = window.width$.getValue();
    const WIDTH_TO: number = 800;
    decrease(WIDTH_TO, WIDTH_FROM, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.width$.next(x);
    });

    const X_FROM: number = window.x$.getValue();
    const X_TO: number = browserWindow.innerWidth / 2 - WIDTH_TO / 2;
    tween(X_FROM, X_TO, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.x$.next(x);
    });

    const Y_FROM: number = window.y$.getValue();
    const Y_TO: number = browserWindow.innerHeight / 2 - HEIGHT_TO / 2;
    tween(Y_FROM, Y_TO, WindowManager.ANIMATION_DURATION).subscribe(x => {
      window.y$.next(x);
    });

    // this.moveToCenter(window);
    this.setFocus(window);
  }

  public toggleExpand(window: IWindow): void {
    if (WindowManager.isWindowExpanded(window)) {
      return this.unexpand(window);
    }
    return this.expand(window);
  }

  public getFullscreenWindow$(): BehaviorSubject<IWindow | null> {
    return this.fullscreenWindow$;
  }

  public enterFullScreen(window: IWindow): void {
    this.windows$.getValue().forEach(w => {
      w.fullscreen$.next(false);
    });
    this.fullscreenWindow$.next(window);
    window.fullscreen$.next(true);
  }

  public leaveFullScreen(window: IWindow): void {
    this.fullscreenWindow$.next(null);
    window.fullscreen$.next(false);
  }

  // todo move to window class
  public static isWindowExpanded(window: IWindow): boolean {
    return (
      window.y$.getValue() === NAVBAR_HEIGHT &&
      window.x$.getValue() <= DOCK_WIDTH &&
      window.height$.getValue() === browserWindow.innerHeight - NAVBAR_HEIGHT - APP_HEADER_HEIGHT &&
      window.width$.getValue() >= browserWindow.innerWidth - DOCK_WIDTH
    );
  }

  // todo move to window class
  public static setValidWindowX(newX: number, window: IWindow): void {
    if (newX <= 0) {
      window.x$.next(0);
    } else if (newX >= browserWindow.innerWidth - window.width$.getValue()) {
      window.x$.next(browserWindow.innerWidth - window.width$.getValue());
    } else {
      window.x$.next(newX);
    }
  }

  // todo move to window class
  public static isValidWindowX(newX: number, window: IWindow): boolean {
    if (newX <= 0) {
      return false;
    } else if (newX >= browserWindow.innerWidth - window.width$.getValue()) {
      return false;
    }
    return true;
  }

  // todo move to window class
  public static setValidWindowY(newY: number, window: IWindow): void {
    if (newY <= NAVBAR_HEIGHT) {
      window.y$.next(NAVBAR_HEIGHT);
    } else if (
      newY >=
      browserWindow.innerHeight - (window.height$.getValue() + APP_HEADER_HEIGHT)
    ) {
      window.y$.next(browserWindow.innerHeight - (window.height$.getValue() + APP_HEADER_HEIGHT));
    } else {
      window.y$.next(newY);
    }
  }

  // todo move to window class
  public static isValidWindowY(newY: number, window: IWindow): boolean {
    if (newY <= NAVBAR_HEIGHT) {
      return false;
    } else if (
      newY >=
      browserWindow.innerHeight - (window.height$.getValue() + APP_HEADER_HEIGHT)
    ) {
      return false;
    }
    return true;
  }
}

import {IProcess} from '../../models/IProcess';
import {IAppFactory} from '../../models/IAppFactory';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IShortcut} from '../../models/IShortcut';
import icon from '../../../resources/apps/talking-face/icon.svg';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';
import {IWindowManager} from '../../models/IWindowManager';
import {BehaviorSubject} from 'rxjs';
import EyeComponent from './components/EyeComponent';
import React, {FC} from 'react';
import MouthComponent from './components/MouthComponent';

const browserWindow: Window = ((): Window => {
  return globalThis as any as Window;
})();

export default class TalkingFaceApp implements IProcess {
  public static readonly processManagerAppFactory: IAppFactory<TalkingFaceApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): TalkingFaceApp {
      return new TalkingFaceApp(system, pid, inputStream, outputStream, errorStream);
    }
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Talking face',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(TalkingFaceApp.processManagerAppFactory);
      }
    };
  }

  private readonly windowManager: IWindowManager;

  public readonly mousePositionTracker$: BehaviorSubject<{
    x: number;
    y: number;
  }> = new BehaviorSubject<{x: number; y: number}>({
    x: 0,
    y: 0
  });

  private leftEyeWindow: IWindow | null = null;

  private rightEyeWindow: IWindow | null = null;

  private mouthWindow: IWindow | null = null;

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {
    this.windowManager = system.getWindowManager();
  }

  public getWindows(): IWindow[] {
    const windows: IWindow[] = [];
    if (this.leftEyeWindow) windows.push(this.leftEyeWindow);
    if (this.rightEyeWindow) windows.push(this.rightEyeWindow);
    if (this.mouthWindow) windows.push(this.mouthWindow);
    return windows;
  }

  public start(): void {
    this.openLeftEyeWindow();
    this.openRightEyeWindow();
    this.openMouthWindow();
    browserWindow.document?.addEventListener('mousemove', this.onDocumentMouseMove);
  }

  public onClose(): void {
    browserWindow.document?.removeEventListener('mousemove', this.onDocumentMouseMove);

    if (this.leftEyeWindow) this.windowManager.closeWindow(this.leftEyeWindow);
    if (this.rightEyeWindow) this.windowManager.closeWindow(this.rightEyeWindow);
    if (this.mouthWindow) this.windowManager.closeWindow(this.mouthWindow);
    this.leftEyeWindow = null;
    this.rightEyeWindow = null;
    this.mouthWindow = null;
  }

  public onCloseClick(): void {
    this.system.killProcess(this.pid);
  }

  private onDocumentMouseMove = (event: DocumentEventMap['mousemove']): void => {
    this.mousePositionTracker$.next({
      x: event.clientX,
      y: event.clientY
    });
  };

  private openLeftEyeWindow(): void {
    const that: TalkingFaceApp = this;
    this.leftEyeWindow = WindowManager.createBlankWindow(this);
    this.windowManager.createWindow(this.leftEyeWindow);

    this.leftEyeWindow.width$.next(200);
    this.leftEyeWindow.height$.next(100);

    this.leftEyeWindow.x$.next(200);
    this.leftEyeWindow.y$.next(300);

    this.leftEyeWindow.resizable$.next(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.leftEyeWindow.component$.next(() => {
      return function LeftEyeWindowComponentWrapper({window}: {window: IWindow}) {
        return React.createElement(EyeComponent, {window, app: that});
      } as FC<{window: IWindow}>;
    });
  }

  private openRightEyeWindow(): void {
    const that: TalkingFaceApp = this;
    this.rightEyeWindow = WindowManager.createBlankWindow(this);
    this.windowManager.createWindow(this.rightEyeWindow);

    this.rightEyeWindow.width$.next(200);
    this.rightEyeWindow.height$.next(100);

    this.rightEyeWindow.x$.next(510);
    this.rightEyeWindow.y$.next(300);

    this.rightEyeWindow.resizable$.next(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.rightEyeWindow.component$.next(() => {
      return function LeftEyeWindowComponentWrapper({window}) {
        return React.createElement(EyeComponent, {window, app: that});
      } as FC<{window: IWindow}>;
    });
  }

  private openMouthWindow(): void {
    const that: TalkingFaceApp = this;
    this.mouthWindow = WindowManager.createBlankWindow(this);
    this.windowManager.createWindow(this.mouthWindow);

    this.mouthWindow.width$.next(400);
    this.mouthWindow.height$.next(200);

    this.mouthWindow.x$.next(200);
    this.mouthWindow.y$.next(450);

    this.mouthWindow.resizable$.next(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mouthWindow.component$.next(() => {
      return function LeftEyeWindowComponentWrapper({window}) {
        return React.createElement(MouthComponent, {window, app: that});
      } as FC<{window: IWindow}>;
    });
  }
}

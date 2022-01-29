import {IAppFactory} from '../../models/IAppFactory';
import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IWindow} from '../../models/IWindow';
import {BehaviorSubject} from 'rxjs';
import WindowManager from '../../services/WindowManager';
import React, {FC} from 'react';
import TerminalAppComponent from './TerminalAppComponent';
import {IShortcut} from '../../models/IShortcut';

import terminalIcon from '../../../resources/apps/terminal/icon.svg';

export default class TerminalApp implements IProcess {
  private static WIDTH = 598;

  private static HEIGHT = 429;

  public static terminalAppFactory: IAppFactory<TerminalApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): TerminalApp {
      return new TerminalApp(
        system,
        pid,
        inputStream,
        outputStream,
        errorStream
      );
    },
  };

  public static getTerminalShortcut(system: ISystem): IShortcut {
    return {
      title: 'Terminal',
      iconUrl: terminalIcon.src,
      action(): void {
        system.spawnProcess(TerminalApp.terminalAppFactory);
      },
    };
  }

  public static createComponent(
    terminalApp: TerminalApp
  ): FC<{window: IWindow}> {
    return function TerminalAppComponentWrapper({window}: {window: IWindow}) {
      return React.createElement(TerminalAppComponent, {terminalApp, window});
    };
  }

  public readonly meta = {
    name: 'Terminal'
  };

  protected mainWindow?: IWindow;

  protected constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public start(): void {
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(TerminalApp.WIDTH),
      height$: new BehaviorSubject<number>(TerminalApp.HEIGHT),
    });

    this.mainWindow = this.system.getWindowManager().createWindow(window);
    this.mainWindow.title$.next('Terminal');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TODO find a better way to handle this extra wrapper
    // this extra wrapper required because BehaviorSubject calls its constructor
    // argument if it is a function
    this.mainWindow.component$.next(() => TerminalApp.createComponent(this));
  }

  public getWindows(): IWindow[] {
    if (!this.mainWindow) {
      return [];
    }
    return [this.mainWindow];
  }

  public onCloseClick(): void {
    this.system.killProcess(this.pid);
  }
}

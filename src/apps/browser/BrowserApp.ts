import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IWindow} from '../../models/IWindow';
import {IAppFactory} from '../../models/IAppFactory';
import {IShortcut} from '../../models/IShortcut';

import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import React from 'react';

import icon from '../../../resources/apps/browser/icon.svg';
import BrowserComponent from './BrowserComponent';

export default class BrowserApp implements IProcess {
  public static readonly factory: IAppFactory<BrowserApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): BrowserApp {
      return new BrowserApp(
        system,
        pid,
        inputStream,
        outputStream,
        errorStream
      );
    },
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Browser',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(BrowserApp.factory);
      },
    };
  }

  public readonly meta = {
    name: 'Browser',
  };

  private mainWindow: IWindow | null = null;

  public inputText$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public url$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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

  public start(): void {
    const that: BrowserApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(800),
      height$: new BehaviorSubject<number>(600),
      title$: new BehaviorSubject<string>('Browser')
    });
    this.mainWindow = this.system.getWindowManager().createWindow(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function AppTemplateWrapper({window}: {window: IWindow}) {
        if (!that.mainWindow) {
          throw new Error('that.mainWindow does not exist');
        }

        return React.createElement(BrowserComponent, {window, app: that});
      };
    });
  }

  public onClose(): void {

  }
}

import {ISystem} from '../interfaces/ISystem';
import {IProcessStream} from '../interfaces/IProcessStream';
import {IProcess} from '../interfaces/IProcess';
import {IWindow} from '../interfaces/IWindow';
import {IAppFactory} from '../interfaces/IAppFactory';
import {IShortcut} from '../interfaces/IShortcut';

import icon from '../../resources/apps/terminal/icon.svg';
import WindowManager from '../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import {useBehaviorSubject} from '../utils/rx/useBehaviorSubject';
import React from 'react';
import AppLayout from '../components/app-layout/AppLayout';

export default abstract class AppTemplate implements IProcess {
  public static readonly factory: IAppFactory<AppTemplate> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): AppTemplate {
      class App extends AppTemplate {}
      return new App(
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
      title: 'App',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(AppTemplate.factory);
      },
    };
  }

  public readonly meta = {
    name: '',
  };

  private mainWindow: IWindow | null = null;

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
    const that: AppTemplate = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(800),
      height$: new BehaviorSubject<number>(600),
      title$: new BehaviorSubject<string>('CyberBird')
    });
    this.mainWindow = this.system.getWindowManager().createWindow(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function AppTemplateWrapper({window}: {window: IWindow}) {
        const width: number = useBehaviorSubject(window.width$);
        const height: number = useBehaviorSubject(window.height$);
        const zIndex: number = useBehaviorSubject(window.zIndex$);

        if (!that.mainWindow) {
          throw new Error('that.mainWindow does not exist');
        }

        return React.createElement(
          AppLayout,
          {
            window: that.mainWindow,
            onRedButtonClick() {
              that.system.killProcess(that.pid);
            },
          },
          [
            React.createElement('iframe', {
              src: location.href,
              width: width,
              height: height,
              style: {
                border: 0,
                pointerEvents: zIndex === 0 ? 'none' : undefined,
              },
            }),
          ]
        );
      };
    });
  }

  public onClose(): void {}
}

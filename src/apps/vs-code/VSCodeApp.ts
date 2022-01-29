import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IAppFactory} from '../../models/IAppFactory';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import React from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import {IShortcut} from '../../models/IShortcut';

export default class VSCodeApp implements IProcess {
  public static readonly vsCodeAppFactory: IAppFactory<VSCodeApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): VSCodeApp {
      return new VSCodeApp(system, pid, inputStream, outputStream, errorStream);
    },
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'VS Code',
      iconUrl:
        'https://upload.wikimedia.org/wikipedia/commons/2/2d/Visual_Studio_Code_1.18_icon.svg',
      action(): void {
        system.spawnProcess(VSCodeApp.vsCodeAppFactory);
      },
    };
  }

  private mainWindow: IWindow | null = null;

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public start(): void {
    const that: VSCodeApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(1000),
      height$: new BehaviorSubject<number>(700),
      title$: new BehaviorSubject<string>('Visual Studio Code')
    });
    this.system.getWindowManager().createWindow(window);
    this.mainWindow = window;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function VSCodeAppWrapper({window}: {window: IWindow}) {
        const width: number = useBehaviorSubject(window.width$);
        const height: number = useBehaviorSubject(window.height$);
        const zIndex: number = useBehaviorSubject(window.zIndex$);

        if (!that.mainWindow) {
          throw new Error('that.mainWindow does not provided');
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
              src: 'https://vscode.dev',
              width: width,
              height: height,
              // csp: "default-src 'self' *",
              allow: '',
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

  public getWindows(): IWindow[] {
    return [];
  }
}

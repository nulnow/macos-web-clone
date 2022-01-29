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

export default class WardaemonApp implements IProcess {
  public static readonly paintAppAppFactory: IAppFactory<WardaemonApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): WardaemonApp {
      return new WardaemonApp(system, pid, inputStream, outputStream, errorStream);
    }
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Wardaemon',
      iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Daemon-phk.svg',
      action(): void {
        system.spawnProcess(WardaemonApp.paintAppAppFactory);
      }
    };
  }

  public readonly meta = {
    name: 'Wardaemon'
  };

  private mainWindow: IWindow | null = null;

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public start(): void {
    const that: WardaemonApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(1000),
      height$: new BehaviorSubject<number>(700),
      title$: new BehaviorSubject<string>('Wardaemon')
    });
    this.system.getWindowManager().createWindow(window);
    this.mainWindow = window;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function PaintAppWrapper({window}: {window: IWindow}) {
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
            }
          },
          [
            React.createElement(
              'div',
              {
                style: {
                  height: height,
                  overflow: 'scroll'
                }
              },
              [
                React.createElement('iframe', {
                  src: 'http://localhost:3001/auth',
                  width: width,
                  height: 900,
                  style: {
                    // transform: 'scale(0.8)';
                    border: 0,
                    pointerEvents: zIndex === 0 ? 'none' : undefined
                  }
                })
              ]
            )
          ]
        );
      };
    });
  }

  public getWindows(): IWindow[] {
    return [];
  }
}

import {IProcess} from '../../interfaces/IProcess';
import {ISystem} from '../../interfaces/ISystem';
import {IProcessStream} from '../../interfaces/IProcessStream';
import {IAppFactory} from '../../interfaces/IAppFactory';
import {IWindow} from '../../interfaces/IWindow';
import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import React from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import {IShortcut} from '../../interfaces/IShortcut';

import icon from '../../../resources/apps/paint/icon.svg';

export default class PaintApp implements IProcess {
  public static readonly paintAppAppFactory: IAppFactory<PaintApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): PaintApp {
      return new PaintApp(system, pid, inputStream, outputStream, errorStream);
    },
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Paint',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(PaintApp.paintAppAppFactory);
      },
    };
  }

  public readonly meta = {
    name: 'Paint'
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
    const that: PaintApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(1000),
      height$: new BehaviorSubject<number>(700),
      title$: new BehaviorSubject<string>('Paint online')
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
            },
          },
          [
            React.createElement('iframe', {
              src: 'https://nulnow.github.io/paint-online-666/',
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

  public getWindows(): IWindow[] {
    return [];
  }
}

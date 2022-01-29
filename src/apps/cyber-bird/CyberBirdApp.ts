import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import React from 'react';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import {IAppFactory} from '../../models/IAppFactory';
import {IShortcut} from '../../models/IShortcut';
import AppLayout from '../../components/app-layout/AppLayout';

import icon from '../../../resources/apps/cyber-bird/icon.svg';

export default class CyberBirdApp implements IProcess {
  public static readonly cyberBirdAppFactory: IAppFactory<CyberBirdApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): CyberBirdApp {
      return new CyberBirdApp(
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
      title: 'CyberBird',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(CyberBirdApp.cyberBirdAppFactory);
      },
    };
  }

  private static readonly WIDTH = 800;

  private static readonly HEIGHT = 609;

  private mainWindow?: IWindow;

  private constructor(
    private system: ISystem,
    public pid: number,
    public inputStream$: IProcessStream,
    public outputStream$: IProcessStream,
    public errorStream$: IProcessStream
  ) {}

  public getWindows(): IWindow[] {
    return [];
  }

  public start(): void {
    const that: CyberBirdApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(CyberBirdApp.WIDTH),
      height$: new BehaviorSubject<number>(CyberBirdApp.HEIGHT),
      title$: new BehaviorSubject<string>('CyberBird')
    });
    this.mainWindow = this.system.getWindowManager().createWindow(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function CyberBirdWrapper({window}: {window: IWindow}) {
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
              src: 'https://nulnow.github.io/cyber-bird/',
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
}

import {IProcess} from '../../models/IProcess';
import {IAppFactory} from '../../models/IAppFactory';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IShortcut} from '../../models/IShortcut';
import icon from '../../../resources/apps/iphone-mockup/icon.svg';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import React from 'react';
import AppLayout from '../../components/app-layout/AppLayout';

export default class IphoneMockupApp implements IProcess {
  public static readonly factory: IAppFactory<IphoneMockupApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): IphoneMockupApp {
      return new IphoneMockupApp(
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
      title: 'Iphone Mockup',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(IphoneMockupApp.factory);
      },
    };
  }

  private static readonly WIDTH = 800;

  private static readonly HEIGHT = 660;

  public readonly meta = {
    name: 'Iphone Mockup'
  };

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
    const that: IphoneMockupApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(IphoneMockupApp.WIDTH),
      height$: new BehaviorSubject<number>(IphoneMockupApp.HEIGHT),
      title$: new BehaviorSubject<string>('IPhone mockup')
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
              src: 'https://nulnow.github.io/iphone-css-mockup/',
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

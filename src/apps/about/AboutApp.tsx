import {IProcess} from '../../interfaces/IProcess';
import {IAppFactory} from '../../interfaces/IAppFactory';
import {ISystem} from '../../interfaces/ISystem';
import {IProcessStream} from '../../interfaces/IProcessStream';
import {IShortcut} from '../../interfaces/IShortcut';
import aboutIcon from '../../../resources/apps/about/icon.svg';
import {IWindow} from '../../interfaces/IWindow';
import React from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';

export default class AboutApp implements IProcess {
  public static aboutAppFactory: IAppFactory<AboutApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): AboutApp {
      return new AboutApp(system, pid, inputStream, outputStream, errorStream);
    },
  };

  public static getAboutShortcut(system: ISystem): IShortcut {
    return {
      title: 'About',
      iconUrl: aboutIcon.src,
      action(): void {
        const process: IProcess = system.spawnProcess(AboutApp.aboutAppFactory);
        const mainWindow: IWindow = process.getWindows()[0];
        if (mainWindow) {
          mainWindow.title$.next('About');
        }
      },
    };
  }

  public readonly meta = {
    name: 'About'
  };

  public constructor(
    private system: ISystem,
    public pid: number,
    public inputStream$: IProcessStream,
    public outputStream$: IProcessStream,
    public errorStream$: IProcessStream
  ) {}

  private mainWindow: IWindow | null = null;

  public start(): void {
    // eslint-disable-next-line @typescript-eslint/typedef
    const that = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      width$: new BehaviorSubject<number>(600),
      height$: new BehaviorSubject<number>(500),
      title$: new BehaviorSubject<string>('About')
    });
    this.mainWindow = this.system.getWindowManager().createWindow(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow?.component$.next(() => {
      return function AboutAppWrapper() {

        if (!that.mainWindow) {
          throw new Error('that.mainWindow does not exist');
        }

        return (
          <AppLayout window={that.mainWindow} onRedButtonClick={(): void => that.system.killProcess(that.pid)}>
            <div style={{width: '100%', height: '100%', overflowY: 'scroll'}}>
              <img src="resume.svg" alt="cv" style={{width: '100%'}} />
            </div>
          </AppLayout>
        );
      };
    });
  }

  public getWindows(): IWindow[] {
    if (!this.mainWindow) {
      return [];
    }
    return [this.mainWindow];
  }
}

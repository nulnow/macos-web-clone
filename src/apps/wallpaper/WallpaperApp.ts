import {IProcess} from '../../models/IProcess';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IAppFactory} from '../../models/IAppFactory';
import {IWindow} from '../../models/IWindow';
import {BehaviorSubject} from 'rxjs';

import wp1 from '../../../resources/apps/wallpaper/wallpapers/wp1.gif';
import wp2 from '../../../resources/apps/wallpaper/wallpapers/wp2.gif';
import wp3 from '../../../resources/apps/wallpaper/wallpapers/wp3.gif';

import {IShortcut} from '../../models/IShortcut';
import WindowManager from '../../services/WindowManager';
import WallpaperAppComponent from './WallpaperAppComponent';
import React, {FC} from 'react';

import icon from '../../../resources/apps/wallpaper/icon.svg';

export default class WallpaperApp implements IProcess {
  private static readonly IDENTIFIER = 'wallpaper-app';

  public static isWallpaperAppProcess(process: IProcess): boolean {
    return process.meta.name === 'Wallpaper';
  }

  public static createShortcut(system: ISystem): IShortcut {
    return {
      title: 'Wallpapers',
      iconUrl: icon.src,
      action(): void {
        const wallpaperApp: WallpaperApp = <WallpaperApp>(
          system.getProcesses$().getValue().find(p => WallpaperApp.isWallpaperAppProcess(p))
        );
        wallpaperApp.openWindow();
      },
    };
  }

  public static readonly wallpaperAppFactory: IAppFactory<WallpaperApp> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): WallpaperApp {
      return new WallpaperApp(
        system,
        pid,
        inputStream,
        outputStream,
        errorStream
      );
    },
  };

  private mainWindow: IWindow | null = null;

  public readonly wallpapers$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  public readonly meta = {
    name: 'Wallpaper'
  };

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {
    this.wallpapers$.next([wp1.src, wp2.src, wp3.src]);
  }

  public setWallpaper(url?: string): void {
    this.system.getWindowManager().setWallpaperUrl(url);
  }

  public openWindow(): void {
    if (this.mainWindow) {
      return;
    }
    const that: WallpaperApp = this;
    const window: IWindow = WindowManager.createBlankWindow(this, {
      title$: new BehaviorSubject<string>('Wallpaper'),
    });
    window.width$.next(500);
    window.height$.next(600);
    this.mainWindow = this.system.getWindowManager().createWindow(window);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      return function WallpaperAppWrapper({window}) {
        return React.createElement(WallpaperAppComponent, {window, app: that});
      } as FC<{window: IWindow}>;
    });
  }

  public closeWindow(): void {
    if (!this.mainWindow) {
      return;
    }
    this.system.getWindowManager().closeWindow(this.mainWindow);
    this.mainWindow = null;
  }

  public start(): void {}

  public onClose(): void {}

  public getWindows(): IWindow[] {
    if (this.mainWindow) {
      return [this.mainWindow];
    }
    return [];
  }
}

import {IProcess} from '../../models/IProcess';
import {IAppFactory} from '../../models/IAppFactory';
import {ISystem} from '../../models/ISystem';
import {IProcessStream} from '../../models/IProcessStream';
import {IShortcut} from '../../models/IShortcut';
import icon from '../../../resources/apps/process-manager/icon.svg';
import {IWindow} from '../../models/IWindow';
import WindowManager from '../../services/WindowManager';
import {IWindowManager} from '../../models/IWindowManager';
import React, {FC} from 'react';
import ProcessManagerComponent from './ProcessManagerComponent';
import {BehaviorSubject} from 'rxjs';

export default class ProcessManager implements IProcess {
  public static readonly processManagerAppFactory: IAppFactory<ProcessManager> = {
    create(
      system: ISystem,
      pid: number,
      inputStream: IProcessStream,
      outputStream: IProcessStream,
      errorStream: IProcessStream
    ): ProcessManager {
      return new ProcessManager(system, pid, inputStream, outputStream, errorStream);
    }
  };

  public static getShortcut(system: ISystem): IShortcut {
    return {
      title: 'Process manager',
      iconUrl: icon.src,
      action(): void {
        system.spawnProcess(ProcessManager.processManagerAppFactory);
      }
    };
  }

  public readonly meta = {
    name: 'Process Manager'
  };

  private mainWindow: IWindow | null = null;

  private readonly windowManager: IWindowManager;

  private constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {
    this.windowManager = system.getWindowManager();
  }

  public getProcesses$(): BehaviorSubject<IProcess[]> {
    return this.system.getProcesses$();
  }

  public getWindows(): IWindow[] {
    if (this.mainWindow) {
      return [this.mainWindow];
    }
    return [];
  }

  public start(): void {
    const that: ProcessManager = this;
    this.mainWindow = this.windowManager.createWindow(WindowManager.createBlankWindow(this, {
      title$: new BehaviorSubject<string>('Process Manager')
    }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.component$.next(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return function ProcessManagerAppWrapper({window}) {
        return React.createElement(ProcessManagerComponent, {window, app: that});
      } as FC<{window: IWindow, app: ProcessManager}>;
    });
  }

  public onCloseClick(): void {
    this.system.killProcess(this.pid);
  }

  public onKillProcessClick(process: IProcess): void {
    this.system.killProcess(process.pid);
  }

  public onClose(): void {

  }
}

import {IProcess} from '../../interfaces/IProcess';
import {ISystem} from '../../interfaces/ISystem';
import {IProcessStream} from '../../interfaces/IProcessStream';
import {IWindow} from '../../interfaces/IWindow';
import {IAppFactory} from '../../interfaces/IAppFactory';
import {IShortcut} from '../../interfaces/IShortcut';

import WindowManager from '../../services/WindowManager';
import {BehaviorSubject} from 'rxjs';
import React from 'react';

import icon from '../../../resources/apps/browser/icon.svg';
import BrowserComponent from './BrowserComponent';
import {ITab} from './ITab';
import Tab from './Tab';

export default class BrowserApp implements IProcess {
  private static getUniqueTabId(): number {
    return Math.round(Math.random() * 100000);
  }

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

  public selectedTab$: BehaviorSubject<ITab> = new BehaviorSubject<ITab>(new Tab(BrowserApp.getUniqueTabId()));

  public tabs$: BehaviorSubject<ITab[]> = new BehaviorSubject<ITab[]>([
    this.selectedTab$.getValue()
  ]);

  protected constructor(
    private readonly system: ISystem,
    public readonly pid: number,
    public readonly inputStream$: IProcessStream,
    public readonly outputStream$: IProcessStream,
    public readonly errorStream$: IProcessStream
  ) {}

  public onNewTabClick(): ITab {
    const tab: ITab = this.openNewTab();
    this.setSelectedTab(tab);
    return tab;
  }

  public setSelectedTab(tab: ITab): void {
    this.selectedTab$.next(tab);
  }

  public openNewTab(url?: string): ITab {
    const tab: ITab = new Tab(BrowserApp.getUniqueTabId(), url);
    this.tabs$.next([
      ...this.tabs$.getValue(),
      tab
    ]);
    return tab;
  }

  public onCloseTabClick(tab: ITab): void {
    if (!tab.getUrl() && this.tabs$.getValue().length === 1) {
      return;
    }
    this.tabs$.next(
      this.tabs$.getValue().filter(t => t.id !== tab.id)
    );
    const selectedTab: ITab = this.selectedTab$.getValue();
    const tabs: ITab[] = this.tabs$.getValue();
    if (tab.id === selectedTab.id && tabs.length !== 0) {
      this.setSelectedTab(tabs[tabs.length - 1]);
    }
    if (tabs.length === 0) {
      const lastTab: ITab = new Tab(BrowserApp.getUniqueTabId());
      this.tabs$.next([lastTab]);
      this.setSelectedTab(lastTab);
    }
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

  public getWindows(): IWindow[] {
    if (this.mainWindow) {
      return [this.mainWindow];
    }
    return [];
  }

  public onClose(): void {

  }
}

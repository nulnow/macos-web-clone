import {ReactElement} from 'react';
import {IWindow} from './IWindow';
import {DockApp} from '../apps/dock/DockApp';
import {BehaviorSubject} from 'rxjs';

export interface IWindowManager {
  getWallpaperUrl$(): BehaviorSubject<string | undefined>;
  getWindows$(): BehaviorSubject<IWindow[]>;

  setWallpaperUrl(url?: string): void;
  setFocus(window: IWindow): void;
  clearWindowsFocus(): void;
  createWindow(window: IWindow): IWindow;
  closeWindow(window: IWindow): void;
  collapseWindow(window: IWindow): void;

  expand(window: IWindow): void;
  unexpand(window: IWindow): void;
  toggleExpand(window: IWindow): void;
  getProcessWindows(pid: number): IWindow[];
  getDockApp(): DockApp;
  render(): ReactElement<any, any> | null;
}

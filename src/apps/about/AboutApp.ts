import {IProcess} from '../../interfaces/IProcess';
import {IAppFactory} from '../../interfaces/IAppFactory';
import {ISystem} from '../../interfaces/ISystem';
import {IProcessStream} from '../../interfaces/IProcessStream';
import {IShortcut} from '../../interfaces/IShortcut';
import aboutIcon from '../../../resources/apps/about/icon.svg';
import {IWindow} from '../../interfaces/IWindow';
import React, {FC} from 'react';
import TerminalAppComponent from '../terminal/TerminalAppComponent';
import TerminalApp from '../terminal/TerminalApp';
import {useDocumentEvent} from '../../utils/dom/useDocumentEvent';

export default class AboutApp extends TerminalApp implements IProcess {
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

  public static createComponent(aboutApp: AboutApp): FC<{window: IWindow}> {
    return function AboutAppComponentWrapper({window}: {window: IWindow}) {
      useDocumentEvent('mousemove', event => {
        aboutApp.outputStream$.next(
          JSON.stringify({
            x: event.clientX,
            y: event.clientY,
          }) + '\n'
        );
      });

      return React.createElement(TerminalAppComponent, {
        terminalApp: aboutApp,
        window,
        scrollToBottom: true,
      });
    };
  }

  public readonly meta = {
    name: 'About'
  };

  public constructor(
    system: ISystem,
    pid: number,
    inputStream: IProcessStream,
    outputStream: IProcessStream,
    errorStream: IProcessStream
  ) {
    super(system, pid, inputStream, outputStream, errorStream);
  }

  public start(): void {
    super.start();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow?.component$.next(() => AboutApp.createComponent(this));
    this.outputStream$.next('Hello there!!!');
  }
}

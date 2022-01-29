import React, {FC} from 'react';
import {IWindowManager} from '../../models/IWindowManager';
import styles from './WindowManager.module.scss';
import Head from 'next/head';
import WindowComponent from '../window-component/WindowComponent';
import Navbar from '../navbar/Navbar';
import Dock from '../dock/Dock';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import {IWindow} from '../../models/IWindow';

const WindowManagerComponent: FC<{windowManager: IWindowManager}> = ({
  windowManager,
}) => {
  const windows: IWindow[] = useBehaviorSubject(windowManager.getWindows$());
  const wallpaperUrl: string | undefined = useBehaviorSubject(windowManager.getWallpaperUrl$());
  const collapsedWindows: IWindow[] = useBehaviorSubject(
    windowManager.getDockApp().getCollapsedWindows$()
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Mac OS Web Clone</title>
        <meta name="description" content="Portfolio website" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </Head>

      <main
        className={styles.desktop}
        style={{backgroundImage: wallpaperUrl && `url("${wallpaperUrl}")`}}
      >
        <Navbar />
        {windows
          .filter(window => !collapsedWindows.find(w => w.id === window.id))
          .map(window => {
            return <WindowComponent key={window.id} window={window} />;
          })}
      </main>
      <Dock />
    </div>
  );
};

export default WindowManagerComponent;

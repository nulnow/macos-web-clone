import React, {FC} from 'react';
import {IWindowManager} from '../../models/IWindowManager';
import styles from './WindowManager.module.scss';
import Head from 'next/head';
import WindowComponent from '../window-component/WindowComponent';
import Navbar from '../navbar/Navbar';
import Dock from '../dock/Dock';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import {IWindow} from '../../models/IWindow';
import WallpaperApp from '../../apps/wallpaper/WallpaperApp';

const WindowManagerComponent: FC<{windowManager: IWindowManager}> = ({
  windowManager,
}) => {
  const windows: IWindow[] = useBehaviorSubject(windowManager.getWindows$());
  const wallpaperUrl: string | undefined = useBehaviorSubject(windowManager.getWallpaperUrl$());
  const wallpaperColor: string | undefined = useBehaviorSubject(windowManager.getWallpaperColor$());
  const collapsedWindows: IWindow[] = useBehaviorSubject(
    windowManager.getDockApp().getCollapsedWindows$()
  );
  const fullscreenWindow: IWindow | null = useBehaviorSubject(windowManager.getFullscreenWindow$());

  return (
    <div className={styles.container}>
      <Head>
        <title>Mac OS Web Clone</title>
        <meta name="description" content="Portfolio website" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </Head>

      <main
        className={styles.desktop}
        style={{backgroundColor: wallpaperColor ?? WallpaperApp.DEFAULT_WALLPAPER_COLOR, backgroundImage: wallpaperUrl && `url("${wallpaperUrl}")`}}
      >
        <Navbar />
        {windows
          .filter(window => {
            if (fullscreenWindow && window.id === fullscreenWindow.id) {
              return false;
            }
            if (collapsedWindows.find(w => w.id === window.id)) {
              return false;
            }
            return true;
          })
          .map(window => {
            return <WindowComponent key={window.id} window={window} />;
          })}
      </main>
      <Dock />
      {fullscreenWindow && (
        <WindowComponent window={fullscreenWindow} />
      )}
    </div>
  );
};

export default WindowManagerComponent;

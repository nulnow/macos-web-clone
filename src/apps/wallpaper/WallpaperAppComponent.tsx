import React, {FC} from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import {IWindow} from '../../models/IWindow';
import WallpaperApp from './WallpaperApp';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import styles from './WallpaperApp.module.scss';

const WallpaperAppComponent: FC<{window: IWindow; app: WallpaperApp}> = ({window, app}) => {
  const allWallpapers: string[] = useBehaviorSubject(app.wallpapers$);

  return (
    <AppLayout window={window} onRedButtonClick={(): void => app.closeWindow()}>
        <button className={styles.clearButton} onClick={(): void => app.setWallpaper()}>
        Clear
      </button>
      <div className={styles.WallpaperApp}>
          <input className={styles.colorButton} type="color" onChange={(event): void => {
            const value: string = event.target.value;
            app.setWallpaperColor(value);
          }} />
        {allWallpapers.map(wp => {
          return (
            <button
              key={wp}
              onClick={(): void => app.setWallpaper(wp)}
              className={styles.wallpaper}
              style={{backgroundImage: `url("${wp}")`}}
            />
          );
        })}
      </div>
    </AppLayout>
  );
};

export default WallpaperAppComponent;

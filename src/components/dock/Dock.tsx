import React, {FC} from 'react';
import styles from './Dock.module.scss';
import {useGlobalContext} from '../../contexts/global-context/useGlobalContext';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import DockShortcut from './dock-shortcut/DockShortcut';
import {DOCK_WIDTH} from './consts';
import WindowComponent from '../window-component/WindowComponent';
import {BehaviorSubject} from 'rxjs';
import {IWindowTransform} from '../../interfaces/IWindowTransform';
import {DOCK_ICON_SIZE} from './dock-shortcut/consts';
import {IWindow} from '../../interfaces/IWindow';
import {IShortcut} from '../../interfaces/IShortcut';
import {DockApp} from '../../apps/dock/DockApp';

const Dock: FC = () => {
  const {windowManager} = useGlobalContext();
  const docApp: DockApp = windowManager.getDockApp();

  const dockAppShortcuts: IShortcut[] = useBehaviorSubject(docApp.getShortcuts$());
  const collapsedWindows: IWindow[] = useBehaviorSubject(docApp.getCollapsedWindows$());

  const onMouseOver = (): void => {
    windowManager.clearWindowsFocus();
  };

  return (
    <div
      className={styles.dock}
      style={{width: DOCK_WIDTH}}
      onMouseOver={onMouseOver}
    >
      {dockAppShortcuts.map(shortcut => {
        return <DockShortcut key={shortcut.title} shortcut={shortcut} />;
      })}
      {collapsedWindows.map(collapsedWindow => {
        const window: IWindow = {
          ...collapsedWindow,
          x$: new BehaviorSubject<number>(0),
          y$: new BehaviorSubject<number>(0),
          transform$: new BehaviorSubject<IWindowTransform>({
            x:
              2.5 -
              (collapsedWindow.width$.getValue() / 2 - DOCK_ICON_SIZE / 2),
            y:
              2.5 -
              (collapsedWindow.height$.getValue() / 2 - DOCK_ICON_SIZE / 2) -
              15,
            scaleY: DOCK_ICON_SIZE / collapsedWindow.height$.getValue(),
            scaleX: DOCK_ICON_SIZE / collapsedWindow.width$.getValue(),
          }),
        };
        return (
          <div
            role="button"
            className={styles.collapsedWindow}
            key={collapsedWindow.id}
            style={{position: 'relative', height: 50, width: 50}}
            onClick={(): void => docApp.uncollapseWindow(collapsedWindow)}
          >
            <div className={styles.collapsedWindowOverlay} />
            <WindowComponent window={window} />
          </div>
        );
      })}
    </div>
  );
};

export default Dock;

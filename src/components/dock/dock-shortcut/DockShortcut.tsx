import React, {FC} from 'react';
import styles from './DockShortcut.module.scss';
import {IShortcut} from '../../../models/IShortcut';
import {DOCK_ICON_SIZE} from './consts';

const DockShortcut: FC<{shortcut: IShortcut}> = ({shortcut}) => {
  return (
    <div role="button" className={styles.DockShortcut}>
      <div onClick={shortcut.action}>
        <div className={styles.terminalIcon}>
          {shortcut.iconUrl && (
            <img
              style={{width: DOCK_ICON_SIZE, height: DOCK_ICON_SIZE}}
              src={shortcut.iconUrl}
              alt={shortcut.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DockShortcut;

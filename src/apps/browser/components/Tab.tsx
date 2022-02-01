import React, {FC} from 'react';
import styles from './Tab.module.scss';
import {ITab} from '../ITab';
import {useBehaviorSubject} from '../../../utils/rx/useBehaviorSubject';

const Tab: FC<{tab: ITab, isSelected?: boolean, onClick?: () => void, onClose?: () => void}> = ({tab, isSelected, onClick, onClose}) => {
  const {url} = useBehaviorSubject(tab.asBehaviorSubject());

  return (
    <div className={`${styles.Tab} ${isSelected ? styles.selectedTab : ''}`} role="button" onClick={onClick}>
      <div className={styles.tabText}>{url ?? 'New tab'}</div>
      <div className={styles.closeButton} onClick={(event): void => {
        event.stopPropagation();
        onClose?.();
      }}>x</div>
    </div>
  );
};

export default Tab;

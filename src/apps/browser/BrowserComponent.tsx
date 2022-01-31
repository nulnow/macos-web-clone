import React, {FC} from 'react';
import {IWindow} from '../../models/IWindow';
import BrowserApp from './BrowserApp';
import styles from './Browser.module.scss';
import AppLayout from '../../components/app-layout/AppLayout';

const BrowserComponent: FC<{ window: IWindow, app: BrowserApp }> = ({window}) => {
  return (
    <AppLayout window={window}>
      <div className={styles.Browser}>

      </div>
    </AppLayout>
  );
};

export default BrowserComponent;

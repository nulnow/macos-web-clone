import React, {FC} from 'react';
import {IWindow} from '../../models/IWindow';
import BrowserApp from './BrowserApp';
import styles from './Browser.module.scss';
import AppLayout from '../../components/app-layout/AppLayout';
import {useGlobalContext} from '../../contexts/global-context/useGlobalContext';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';

const BrowserComponent: FC<{ window: IWindow, app: BrowserApp }> = ({window, app}) => {
  const {system} = useGlobalContext();
  const inputText: string = useBehaviorSubject(app.inputText$);
  const url: string = useBehaviorSubject(app.url$);

  return (
    <AppLayout window={window} onRedButtonClick={(): void => system.killProcess(app.pid)}>
      <div className={styles.Browser}>
        <div className={styles.urlWrapper}>
          <input
            type='text'
            placeholder="Enter url"
            className={styles.urlField}
            value={inputText}
            onKeyPress={(event): void => {
              if (event.key === 'Enter') {
                app.url$.next(inputText);
              }
            }}
            onBlur={(): void => app.url$.next(inputText)}
            onChange={(event): void => app.inputText$.next(event.target.value)}
          />
        </div>
        {url && (
          <iframe className={styles.page} frameBorder={0} src={url} />
        )}
      </div>
    </AppLayout>
  );
};

export default BrowserComponent;
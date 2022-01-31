import React, {FC, useState} from 'react';
import {IWindow} from '../../models/IWindow';
import BrowserApp from './BrowserApp';
import styles from './Browser.module.scss';
import AppLayout from '../../components/app-layout/AppLayout';
import {useGlobalContext} from '../../contexts/global-context/useGlobalContext';

const BrowserComponent: FC<{ window: IWindow, app: BrowserApp }> = ({window, app}) => {
  const {system} = useGlobalContext();
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState<string | null>(null);

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
                setUrl(inputText);
              }
            }}
            onBlur={(): void => setUrl(inputText)}
            onChange={(event): void => setInputText(event.target.value)}
          />
        </div>
        {url && (
          <iframe className={styles.page} src={url} />
        )}
      </div>
    </AppLayout>
  );
};

export default BrowserComponent;

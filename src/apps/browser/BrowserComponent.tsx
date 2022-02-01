import React, {FC} from 'react';
import {IWindow} from '../../interfaces/IWindow';
import BrowserApp from './BrowserApp';
import styles from './Browser.module.scss';
import AppLayout from '../../components/app-layout/AppLayout';
import {useGlobalContext} from '../../contexts/global-context/useGlobalContext';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';

import wikipediaIcon from '../../../resources/apps/browser/bookmarks/wikipedia-icon.svg';
import freeMusicIcon from '../../../resources/apps/browser/bookmarks/freemusic.ico';

import {ITab} from './ITab';
import Tab from './components/Tab';

const BrowserComponent: FC<{ window: IWindow, app: BrowserApp }> = ({window, app}) => {
  const {system} = useGlobalContext();
  const tabs: ITab[] = useBehaviorSubject(app.tabs$);
  const selectedTab: ITab = useBehaviorSubject(app.selectedTab$);
  const {
    inputText: selectedTabInputText,
  } = useBehaviorSubject(selectedTab.asBehaviorSubject());

  return (
    <AppLayout window={window} onRedButtonClick={(): void => system.killProcess(app.pid)}>
      <div className={styles.Browser}>
        <div className={styles.urlWrapper}>
          <input
            type='text'
            placeholder="Enter url"
            className={styles.urlField}
            value={selectedTabInputText ?? ''}
            onKeyPress={(event): void => {
              if (event.key === 'Enter') {
                selectedTab.setUrl(selectedTabInputText);
              }
            }}
            onBlur={(): void => selectedTab.setUrl(selectedTabInputText)}
            onChange={(event): void => selectedTab.setInputText(event.target.value)}
          />
        </div>
        <div className={styles.tabs}>
          {tabs.map(tab => {
            const isSelected: boolean = selectedTab.id === tab.id;
            return (
              <Tab
                key={tab.id}
                isSelected={isSelected}
                tab={tab}
                onClick={(): void => app.setSelectedTab(tab)}
                onClose={(): void => app.onCloseTabClick(tab)}
              />
            );
          })}
          <div role="button" onClick={(): void => {app.onNewTabClick();}} className={styles.newTabButton}>+</div>
        </div>
        {tabs.map(tab => {
          const isSelected: boolean = selectedTab.id === tab.id;
          const tabUrl: string | null = tab.getUrl();

          if (!tabUrl) {
            return (
              <div key={tab.id} style={{ width: '100%', maxWidth: 600, margin: '0 auto', display: isSelected ? undefined : 'none',
                pointerEvents: isSelected ? undefined : 'none' }}>
                <div className={styles.searchWrapper}>
                  <input
                    type='text'
                    placeholder="Search with Bing"
                    className={styles.searchField}
                    onKeyPress={(event): void => {
                      if (event.key === 'Enter') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        tab.setUrl(`https://bing.com/search?q=${event.target.value}`);
                      }
                    }}
                  />
                </div>
                <div className={styles.bookmarks}>
                  <div role="button" className={styles.bookmark} onClick={(): void => {
                    tab.setUrl('https://www.wikipedia.org/');
                  }}>
                    <img src={wikipediaIcon.src} alt='wikipedia bookmark' />
                  </div>

                  <div role="button" className={styles.bookmark} onClick={(): void => {
                    tab.setUrl('https://freeplaymusic.com/#/');
                  }}>
                    <img src={freeMusicIcon.src} alt='free Music bookmark' />
                  </div>

                  <div role="button" className={styles.bookmark} onClick={(): void => {
                    tab.setUrl('https://bing.com');
                  }}>
                    <img src="https://www.vectorlogo.zone/logos/bing/bing-icon.svg" alt='free Music bookmark' />
                  </div>

                </div>
              </div>
            );
          }

          return (
            <iframe
              key={tab.id}
              className={styles.page}
              style={{
                display: isSelected ? 'block' : 'none',
                pointerEvents: isSelected ? undefined : 'none'
              }}
              frameBorder={0}
              src={tabUrl}
            />
          );
        })}
      </div>
    </AppLayout>
  );
};

export default BrowserComponent;

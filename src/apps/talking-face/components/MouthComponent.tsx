import React, {FC} from 'react';
import {IWindow} from '../../../interfaces/IWindow';
import TalkingFaceApp from '../TalkingFaceApp';
import AppLayout from '../../../components/app-layout/AppLayout';

const MouthComponent: FC<{window: IWindow; app: TalkingFaceApp}> = ({
  window,
  app,
}) => {
  return (
    <AppLayout window={window} onRedButtonClick={(): void => app.onCloseClick()}>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <svg
          width="257"
          height="64"
          viewBox="0 0 257 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0C50.6667 47.6667 173 114.4 257 0H0Z" fill="white" />
        </svg>
      </div>
    </AppLayout>
  );
};

export default MouthComponent;

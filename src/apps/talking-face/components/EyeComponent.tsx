import React, {FC} from 'react';
import {IWindow} from '../../../models/IWindow';
import TalkingFaceApp from '../TalkingFaceApp';
import AppLayout from '../../../components/app-layout/AppLayout';
import {useBehaviorSubject} from '../../../utils/rx/useBehaviorSubject';
import {APP_HEADER_HEIGHT} from '../../../components/app-layout/consts';

const EyeComponent: FC<{window: IWindow; app: TalkingFaceApp}> = ({
  window,
  app,
}) => {
  const windowHeight: number = useBehaviorSubject(window.height$);
  const windowWidth: number = useBehaviorSubject(window.width$);

  const windowY: number = useBehaviorSubject(window.y$);
  const windowX: number = useBehaviorSubject(window.x$);

  const mousePosition: {x: number, y: number} = useBehaviorSubject(app.mousePositionTracker$);

  let x: number = mousePosition.x - 25 - windowX;
  let y: number = mousePosition.y - 25 - windowY - APP_HEADER_HEIGHT;

  if (y + 50 > windowHeight) {
    y = windowHeight - 50;
  }
  if (y < 0) {
    y = 0;
  }
  if (x + 50 > windowWidth) {
    x = windowWidth - 50;
  }
  if (x < 0) {
    x = 0;
  }

  return (
    <AppLayout window={window} onRedButtonClick={(): void => app.onCloseClick()}>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: y,
            left: x,
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: 'black',
            transition: '1s easy-in-out',
          }}
        />
      </div>
    </AppLayout>
  );
};

export default EyeComponent;

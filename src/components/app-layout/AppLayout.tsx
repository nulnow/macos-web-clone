import React, {FC} from 'react';
import styles from './AppLayout.module.scss';
import AppWindowControls from '../app-window-controls/AppWindowControls';
import {IWindow} from '../../models/IWindow';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';
import {useGlobalContext} from '../../contexts/global-context/useGlobalContext';
import {
  APP_CONTENT_WRAPPER_MIN_HEIGHT,
  APP_CONTENT_WRAPPER_MIN_WIDTH,
  APP_HEADER_HEIGHT
} from './consts';
import {IUseWindowResizeReturn, useWindowResize} from '../../utils/window/useWindowResize';
import {useWindowMove} from '../../utils/window/useWindowMove';
import {getTransformFromIWindowTransform} from '../../utils/window/getTransformFromIWindowTransform';

const AppLayout: FC<{window: IWindow; onRedButtonClick?(): void}> = ({
  children,
  window,
  onRedButtonClick
}) => {
  const resizer: IUseWindowResizeReturn = useWindowResize(window);
  const {windowManager} = useGlobalContext();

  const title: string = useBehaviorSubject(window.title$);

  const x: number = useBehaviorSubject(window.x$);
  const y: number = useBehaviorSubject(window.y$);
  const width: number = useBehaviorSubject(window.width$);
  const height: number = useBehaviorSubject(window.height$);

  const resizable: boolean = useBehaviorSubject(window.resizable$);
  const movable: boolean = useBehaviorSubject(window.movable$);

  const zIndex: number = useBehaviorSubject(window.zIndex$);
  const transform: string | undefined = getTransformFromIWindowTransform(
    useBehaviorSubject(window.transform$)
  );

  const {onDragEnd, onDragStart} = useWindowMove(window, windowManager);

  return (
    <article
      className={styles.appLayout}
      style={{left: x, top: y, zIndex, transform}}
      onClick={(): void => {
        windowManager.setFocus(window);
      }}
    >
      <div
        className={styles.header}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable={movable}
        style={{height: APP_HEADER_HEIGHT}}
        onDoubleClick={(): void => windowManager.toggleExpand(window)}
      >
        <h1 className={styles.title}>{title}</h1>
        <AppWindowControls
          onRedClick={onRedButtonClick}
          onYellowClick={(): void => windowManager.collapseWindow(window)}
        />
      </div>
      <main
        className={styles.contentWrapper}
        style={{
          width,
          height,
          minWidth: APP_CONTENT_WRAPPER_MIN_WIDTH,
          minHeight: APP_CONTENT_WRAPPER_MIN_HEIGHT
        }}
      >
        {children}
      </main>
      {resizable && (
        <>
          <div className={styles.topResizeLine} onMouseDown={resizer.top.onMouseDown} />
          <div className={styles.rightResizeLine} onMouseDown={resizer.right.onMouseDown} />
          <div className={styles.bottomResizeLine} onMouseDown={resizer.bottom.onMouseDown} />
          <div className={styles.leftResizeLine} onMouseDown={resizer.left.onMouseDown} />

          <div className={styles.topLeftCorner} onMouseDown={resizer.topLeftCorner.onMouseDown} />
          <div className={styles.topRightCorner} onMouseDown={resizer.topRightCorner.onMouseDown} />
          <div
            className={styles.bottomRightCorner}
            onMouseDown={resizer.bottomRightCorner.onMouseDown}
          />
          <div
            className={styles.bottomLeftCorner}
            onMouseDown={resizer.bottomLeftCorner.onMouseDown}
          />
        </>
      )}
    </article>
  );
};

export default AppLayout;

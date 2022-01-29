import {IWindow} from '../../models/IWindow';
import {MouseEventHandler, useRef} from 'react';
import {useDocumentEvent} from '../dom/useDocumentEvent';
import {
  APP_CONTENT_WRAPPER_MIN_HEIGHT,
  APP_CONTENT_WRAPPER_MIN_WIDTH,
} from '../../components/app-layout/consts';
import WindowManager from '../../services/WindowManager';

enum ResizeDirection {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  TOP_LEFT_CORNER,
  TOP_RIGHT_CORNER,
  BOTTOM_RIGHT_CORNER,
  BOTTOM_LEFT_CORNER,
}

interface IResizer {
  onMouseDown: MouseEventHandler<HTMLDivElement>;
}

export interface IUseWindowResizeReturn {
  top: IResizer;
  right: IResizer;
  bottom: IResizer;
  left: IResizer;

  topLeftCorner: IResizer;
  topRightCorner: IResizer;
  bottomRightCorner: IResizer;
  bottomLeftCorner: IResizer;
}

export const useWindowResize = (window: IWindow): IUseWindowResizeReturn => {
  // eslint-disable-next-line @typescript-eslint/typedef
  const data = useRef({
    clientX: 0,
    clientY: 0,
    isResizing: false,
    resizeDirection: ResizeDirection.TOP,

    initialY: 0,
    initialX: 0,

    initialHeight: 0,
    initialWidth: 0,
  } as {
    clientX: number;
    clientY: number;
    isResizing: boolean;
    resizeDirection: ResizeDirection;

    initialY: number;
    initialX: number;

    initialHeight: number;
    initialWidth: number;
  });

  const getResizer = (direction: ResizeDirection): IResizer => {
    return {
      onMouseDown: (event): void => {
        event.preventDefault();
        data.current.isResizing = true;
        data.current.resizeDirection = direction;
        data.current.clientX = event.clientX;
        data.current.clientY = event.clientY;

        data.current.initialY = window.y$.getValue();
        data.current.initialX = window.x$.getValue();

        data.current.initialHeight = window.height$.getValue();
        data.current.initialWidth = window.width$.getValue();
      },
    };
  };

  useDocumentEvent('mousemove', event => {
    if (!data.current.isResizing) {
      return;
    }

    const diffX: number = event.clientX - data.current.clientX;
    const diffY: number = event.clientY - data.current.clientY;

    const top = (): void => {
      const nextHeight: number = data.current.initialHeight - diffY;
      if (nextHeight < APP_CONTENT_WRAPPER_MIN_HEIGHT) {
        window.height$.next(APP_CONTENT_WRAPPER_MIN_HEIGHT);
      } else {
        const nextY: number = data.current.initialY + diffY;
        WindowManager.setValidWindowY(data.current.initialY + diffY, window);
        if (WindowManager.isValidWindowY(nextY, window)) {
          window.height$.next(nextHeight);
        }
      }
    };
    const right = (): void => {
      const nextWidth: number = data.current.initialWidth + diffX;
      if (nextWidth < APP_CONTENT_WRAPPER_MIN_WIDTH) {
        window.width$.next(APP_CONTENT_WRAPPER_MIN_WIDTH);
      } else {
        window.width$.next(nextWidth);
      }
    };
    const bottom = (): void => {
      const nextHeight: number = data.current.initialHeight + diffY;
      if (nextHeight < APP_CONTENT_WRAPPER_MIN_HEIGHT) {
        window.height$.next(APP_CONTENT_WRAPPER_MIN_HEIGHT);
      } else {
        window.height$.next(nextHeight);
      }
    };
    const left = (): void => {
      const nextWidth: number = data.current.initialWidth - diffX;
      if (nextWidth < APP_CONTENT_WRAPPER_MIN_WIDTH) {
        window.width$.next(APP_CONTENT_WRAPPER_MIN_WIDTH);
      } else {
        const nextX: number = data.current.initialX + diffX;
        WindowManager.setValidWindowX(nextX, window);
        if (WindowManager.isValidWindowX(nextX, window)) {
          window.width$.next(nextWidth);
        }
      }
    };

    switch (data.current.resizeDirection) {
      case ResizeDirection.TOP: {
        top();
        return;
      }
      case ResizeDirection.RIGHT: {
        right();
        return;
      }
      case ResizeDirection.BOTTOM: {
        bottom();
        return;
      }
      case ResizeDirection.LEFT: {
        left();
        return;
      }
      case ResizeDirection.TOP_LEFT_CORNER: {
        top();
        left();
        return;
      }
      case ResizeDirection.TOP_RIGHT_CORNER: {
        top();
        right();
        return;
      }
      case ResizeDirection.BOTTOM_RIGHT_CORNER: {
        bottom();
        right();
        return;
      }
      case ResizeDirection.BOTTOM_LEFT_CORNER: {
        bottom();
        left();
        return;
      }
    }
  });

  useDocumentEvent('mouseup', () => {
    data.current.isResizing = false;
  });

  return {
    top: getResizer(ResizeDirection.TOP),
    right: getResizer(ResizeDirection.RIGHT),
    bottom: getResizer(ResizeDirection.BOTTOM),
    left: getResizer(ResizeDirection.LEFT),

    topLeftCorner: getResizer(ResizeDirection.TOP_LEFT_CORNER),
    topRightCorner: getResizer(ResizeDirection.TOP_RIGHT_CORNER),
    bottomRightCorner: getResizer(ResizeDirection.BOTTOM_RIGHT_CORNER),
    bottomLeftCorner: getResizer(ResizeDirection.BOTTOM_LEFT_CORNER),
  };
};

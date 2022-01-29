import {IWindow} from '../../models/IWindow';
import {DragEventHandler, useRef} from 'react';
import {useDocumentEvent} from '../dom/useDocumentEvent';
import {IWindowManager} from '../../models/IWindowManager';
import {useBehaviorSubject} from '../rx/useBehaviorSubject';
import WindowManager from '../../services/WindowManager';

export const useWindowMove = (
  window: IWindow,
  windowManager: IWindowManager
): {
  onDragEnd: DragEventHandler<HTMLElement>;
  onDragStart: DragEventHandler<HTMLElement>;
} => {
  const x: number = useBehaviorSubject(window.x$);
  const y: number = useBehaviorSubject(window.y$);

  const movable: boolean = useBehaviorSubject(window.movable$);

  // eslint-disable-next-line @typescript-eslint/typedef
  const mouseDragStartPositionRef = useRef({
    clientX: 0,
    clientY: 0,
    dragStartWindowX: x,
    dragStartWindowY: y,
    isDragged: false,
  });

  const onDragStart: DragEventHandler<HTMLElement> = event => {
    if (!movable) {
      return;
    }
    mouseDragStartPositionRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      dragStartWindowX: x,
      dragStartWindowY: y,
      isDragged: true,
    };
    windowManager.setFocus(window);
  };

  useDocumentEvent('dragover', event => {
    if (!mouseDragStartPositionRef.current.isDragged) {
      return;
    }
    event.preventDefault();
    const {dragStartWindowX, dragStartWindowY, clientX, clientY} =
      mouseDragStartPositionRef.current;
    const {clientX: newClientX, clientY: newClientY} = event;

    const newX: number = dragStartWindowX + (newClientX - clientX);
    const newY: number = dragStartWindowY + (newClientY - clientY);

    // TODO Create window class and move it there
    WindowManager.setValidWindowY(newY, window);
    WindowManager.setValidWindowX(newX, window);
  });

  const onDragEnd: DragEventHandler<HTMLElement> = () => {
    mouseDragStartPositionRef.current = {
      ...mouseDragStartPositionRef.current,
      isDragged: false,
    };
    windowManager.setFocus(window);
  };

  return {
    onDragStart,
    onDragEnd,
  };
};

import {useEffect} from 'react';

export const useEvent = <K extends keyof DocumentEventMap>(
  target: Document,
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => any
): void => {
  useEffect(() => {
    target.addEventListener(eventName, handler);
    return (): void => {
      target.removeEventListener(eventName, handler);
    };
  });
};

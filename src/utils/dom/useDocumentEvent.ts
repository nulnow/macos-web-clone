import {useEvent} from './useEvent';

export const useDocumentEvent = <K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => any
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  return useEvent(document, eventName, handler);
};

import {useDocumentEvent} from './useDocumentEvent';

export const useDocumentMouseOver = (
  handler: (event: DocumentEventMap['mouseover']) => any
): void => {
  useDocumentEvent('mouseover', handler);
};

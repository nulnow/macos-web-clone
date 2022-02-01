import {BehaviorSubject, Subscription} from 'rxjs';
import {IWindow} from '../../interfaces/IWindow';

export const mapWindowsSubjectToCollapsedWindowsSubject = (windows$: BehaviorSubject<IWindow[]>): BehaviorSubject<IWindow[]> => {
  const getCollapsed = (windows: IWindow[]): IWindow[] => windows.filter(w => w.transform$.getValue().collapsed);
  const initiallyCollapsed: IWindow[] = getCollapsed(windows$.getValue());
  const collapsedWindows$: BehaviorSubject<IWindow[]> = new BehaviorSubject<IWindow[]>(initiallyCollapsed);

  let subscriptions: Subscription[];
  windows$.subscribe(windows => {
    if (subscriptions) {
      subscriptions.forEach(s => s.unsubscribe());
    }
    subscriptions = windows.map(window => {
      return window.transform$.subscribe(transform => {
        const collapsed: boolean = !!transform.collapsed;
        const collapsedWindows: IWindow[] = collapsedWindows$.getValue();
        const isInCollapsed: boolean = !!collapsedWindows.find(w => w.id === window.id);
        if (collapsed && isInCollapsed) {
          return;
        }
        if (!collapsed && !isInCollapsed) {
          return;
        }
        if (collapsed && !isInCollapsed) {
          return collapsedWindows$.next([...collapsedWindows, window]);
        }
        if (!collapsed && isInCollapsed) {
          return collapsedWindows$.next(collapsedWindows.filter(w => w.id !== window.id));
        }
      });
    });
  });
  return collapsedWindows$;
};

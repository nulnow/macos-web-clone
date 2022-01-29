import {BehaviorSubject, Subscription} from 'rxjs';
import {useEffect, useState} from 'react';

export const useBehaviorSubject = <T>(subject$: BehaviorSubject<T>): T => {
  const [value, setValue] = useState<T>(subject$.value);

  useEffect(() => {
    const subscription: Subscription = subject$.subscribe(nextValue => {
      setValue(nextValue);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [subject$]);

  return value;
};

import {Subject, Subscription} from 'rxjs';
import {useEffect, useState} from 'react';

export const useStreamToDisplay = (stream$: Subject<string>): string => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    const subscription: Subscription = stream$.subscribe(nextValue => {
      setState(prevState => prevState + nextValue);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [stream$]);

  return state;
};

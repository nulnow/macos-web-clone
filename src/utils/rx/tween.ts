import {animationFrames, endWith, map, Observable, takeWhile} from 'rxjs';

export const tween = (start: number, end: number, duration: number): Observable<number> => {
  const diff: number = end - start;
  return animationFrames().pipe(
    // Figure out what percentage of time has passed
    map(({elapsed}) => elapsed / duration),
    // Take the vector while less than 100%
    takeWhile(v => v < 1),
    // Finish with 100%
    endWith(1),
    // Calculate the distance traveled between start and end
    map(v => v * diff + start)
  );
};

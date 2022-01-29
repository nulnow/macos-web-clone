import {animationFrames, endWith, map, Observable, takeWhile} from 'rxjs';

/** @deprecated Use tween instead */
export const decrease = (start: number, end: number, duration: number): Observable<number> => {
  const diff: number = end - start;
  return animationFrames().pipe(
    // Figure out what percentage of time has passed
    map(({elapsed}) => elapsed / duration),
    // Take the vector while less than 100%
    takeWhile(v => v < 1),
    // Finish with 100%
    endWith(1),
    // Calculate the distance traveled between start and end
    map(v => v * diff + start),
    // math magic 😎
    map(x => end + start - x)
  );
};

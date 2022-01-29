import {BehaviorSubject} from 'rxjs';
import {IProcess} from './IProcess';
import {FC} from 'react';
import {IWindowTransform} from './IWindowTransform';

// TODO? Add class
export interface IWindow {
  // TODO Hide and use getters
  id: number;

  // TODO Hide streams and use getters and setters
  title$: BehaviorSubject<string>;

  x$: BehaviorSubject<number>;
  y$: BehaviorSubject<number>;
  width$: BehaviorSubject<number>;
  height$: BehaviorSubject<number>;
  zIndex$: BehaviorSubject<number>;

  component$: BehaviorSubject<FC<{window?: IWindow}> | null>;

  resizable$: BehaviorSubject<boolean>;
  movable$: BehaviorSubject<boolean>;
  transform$: BehaviorSubject<IWindowTransform>;

  process: IProcess;
}

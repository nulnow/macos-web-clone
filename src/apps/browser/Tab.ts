import {ITab} from './ITab';
import {BehaviorSubject, combineLatestWith, map, Observable, Observer, Unsubscribable} from 'rxjs';
import {ITabDto} from './ITabDto';

export default class Tab implements ITab {
  public readonly id: number;

  private readonly tabUrl$: BehaviorSubject<string | null>;

  private readonly inputText$: BehaviorSubject<string | null>;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  public constructor(id: number, url: string | null = null, inputText: string | null = url) {
    this.id = id;
    this.tabUrl$ = new BehaviorSubject<string | null>(url);
    this.inputText$ = new BehaviorSubject<string | null>(inputText);
  }

  public getInputText(): string | null {
    return this.inputText$.getValue();
  }

  public getUrl(): string | null {
    return this.tabUrl$.getValue();
  }

  public setInputText(text: string | null): void {
    this.inputText$.next(text);
  }

  public setUrl(url: string | null): void {
    this.inputText$.next(url);
    this.tabUrl$.next(url);
  }

  public subscribeToInputText(observer: Partial<Observer<string | null>>): Unsubscribable {
    return this.inputText$.subscribe(observer);
  }

  public subscribeToUrl(observer: Partial<Observer<string | null>>): Unsubscribable {
    return this.tabUrl$.subscribe(observer);
  }

  private selfSubject: BehaviorSubject<ITabDto> | null = null;

  // TODO Ensure this wont lead to memory leak
  public asBehaviorSubject(): BehaviorSubject<ITabDto> {
    if (this.selfSubject) {
      return this.selfSubject;
    }
    const stream$: Observable<ITabDto> = this.inputText$.pipe(
      combineLatestWith(this.tabUrl$),
      map((tuple) => {
        return {
          inputText: tuple[0],
          url: tuple[1]
        };
      })
    );

    const subject$: BehaviorSubject<ITabDto> = new BehaviorSubject<ITabDto>({
      url: this.tabUrl$.getValue(),
      inputText: this.inputText$.getValue()
    });

    stream$.subscribe(subject$);

    this.selfSubject = subject$;

    return subject$;
  }
}

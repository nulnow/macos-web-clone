import {Observer, Unsubscribable, BehaviorSubject} from 'rxjs';

export interface ITab {
  readonly id: number;

  subscribeToUrl(observer: Partial<Observer<string>>): Unsubscribable;
  getUrl(): string | null;
  setUrl(url: string | null): void;

  subscribeToInputText(observer: Partial<Observer<string>>): Unsubscribable;
  getInputText(): string | null;
  setInputText(text: string | null): void;

  asBehaviorSubject(): BehaviorSubject<{ url: string | null, inputText: string | null }>;
}

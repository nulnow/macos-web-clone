export interface IShortcut {
  title: string;
  iconUrl?: string;
  action?(): void;
}

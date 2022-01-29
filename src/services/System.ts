import {BehaviorSubject} from 'rxjs';
import {ISystem} from '../models/ISystem';
import {IWindowManager} from '../models/IWindowManager';
import {IAppFactory} from '../models/IAppFactory';
import {IProcess} from '../models/IProcess';
import {IProcessStream} from '../models/IProcessStream';
import WindowManager from './WindowManager';
import {IWindow} from '../models/IWindow';
import AutoStart from './AutoStart';

export default class System implements ISystem {
  public static generatePid(): number {
    return Math.round(Math.random() * 1000000);
  }

  private static generateUniquePid(processes: IProcess[]): number {
    let pid: number = System.generatePid();
    while (processes.find(process => process.pid === pid)) {
      pid = System.generatePid();
    }
    return pid;
  }

  private processes$: BehaviorSubject<IProcess[]> = new BehaviorSubject<IProcess[]>([]);

  private readonly windowManager: IWindowManager;

  public constructor() {
    this.windowManager = this.spawnProcess(WindowManager.windowManagerFactory);
    const autoStartProcess: AutoStart = this.spawnProcess(AutoStart.autoStartFactory);
    this.killProcess(autoStartProcess.pid);
  }

  public getWindowManager(): IWindowManager {
    return this.windowManager;
  }

  public spawnProcess<T extends IProcess>(factory: IAppFactory<T>): T {
    const pid: number = System.generateUniquePid(this.processes$.value);
    const system: ISystem = this;

    const inputStream: IProcessStream = new BehaviorSubject<string>('');
    const outputStream: IProcessStream = new BehaviorSubject<string>('');
    const errorStream: IProcessStream = new BehaviorSubject<string>('');

    const process: T = factory.create(system, pid, inputStream, outputStream, errorStream);

    this.processes$.next([...this.processes$.getValue(), process]);
    process.start();

    return process;
  }

  public killProcess(pid: number): void {
    const process: IProcess | undefined = this.processes$.value.find(p => p.pid === pid);

    if (!process) {
      return;
    }

    if (process.onClose) {
      process.onClose();
    }

    const windows: IWindow[] = this.windowManager.getProcessWindows(pid);

    windows.forEach(window => {
      this.windowManager.closeWindow(window);
    });

    this.processes$.next(this.processes$.getValue().filter(p => p.pid !== pid));
  }

  public getProcesses$(): BehaviorSubject<IProcess[]> {
    return this.processes$;
  }
}

import React, {FC, useState} from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import {IWindow} from '../../models/IWindow';
import ProcessManager from './ProcessManager';
import {IProcess} from '../../models/IProcess';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';

import styles from './ProcessManager.module.scss';

const ProcessManagerComponent: FC<{ window: IWindow, app: ProcessManager }> = ({ window, app }) => {
  const processes: IProcess[] = useBehaviorSubject(app.getProcesses$());
  const [selectedProcess, setSelectedProcess] = useState<IProcess | null>(null);

  return (
    <AppLayout window={window} onRedButtonClick={(): void => app.onCloseClick()}>
        <div className={styles.ProcessManager}>
          <table style={{borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                    <th style={{textAlign: 'left'}}>PID</th>
                    <th style={{textAlign: 'left'}}>Name</th>
                </tr>
              </thead>
              <tbody>
                  {processes.map(process => {
                    // TODO Use classNames library
                    return (
                          <tr onClick={(): void => setSelectedProcess(process)} key={process.pid} className={`${styles.processRow} ${selectedProcess && selectedProcess.pid === process.pid && styles.selectedProcess}`}>
                              <td>{process.pid}</td>
                              <td>{process.meta.name}</td>
                          </tr>
                    );
                  })}
              </tbody>
          </table>
            {selectedProcess && (
                <button
                    role="button"
                    className={styles.killButton}
                    onClick={(): void => app.onKillProcessClick(selectedProcess)}
                >
                    kill
                </button>
            )}
        </div>
    </AppLayout>
  );
};

export default ProcessManagerComponent;

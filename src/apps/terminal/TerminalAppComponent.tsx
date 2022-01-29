import React, {FC, MutableRefObject, useEffect, useRef} from 'react';
import AppLayout from '../../components/app-layout/AppLayout';
import TerminalApp from './TerminalApp';
import {IWindow} from '../../models/IWindow';
import {useStreamToDisplay} from './useStreamToDisplay';

const TerminalAppComponent: FC<{
  terminalApp: TerminalApp;
  window: IWindow;
  scrollToBottom?: boolean;
}> = ({terminalApp, window, scrollToBottom}) => {
  const terminalText: string = useStreamToDisplay(terminalApp.outputStream$);
  const outputRef: MutableRefObject<HTMLPreElement | undefined> = useRef<HTMLPreElement>();

  useEffect(() => {
    if (scrollToBottom && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminalText, scrollToBottom]);

  return (
    <AppLayout
      window={window}
      onRedButtonClick={(): void => terminalApp.onCloseClick()}
    >
      <div style={{padding: 8, height: '100%'}}>
        <pre
          ref={outputRef as MutableRefObject<HTMLPreElement>}
          style={{
            margin: 0,
            color: 'greenyellow',
            fontFamily: 'monospace',
            fontWeight: 100,
            fontSize: 14,
            height: '100%',
            overflow: 'scroll',
          }}
        >
          {terminalText}
        </pre>
      </div>
    </AppLayout>
  );
};

export default TerminalAppComponent;

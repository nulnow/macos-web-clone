import React, {FC} from 'react';
import {IWindow} from '../../models/IWindow';
import {useBehaviorSubject} from '../../utils/rx/useBehaviorSubject';

const WindowComponent: FC<{window: IWindow}> = ({window}) => {
  const Component: FC<{window?: IWindow}> | null = useBehaviorSubject(
    window.component$
  );

  if (!Component) {
    return null;
  }

  return React.createElement(Component, {window});
};

export default WindowComponent;

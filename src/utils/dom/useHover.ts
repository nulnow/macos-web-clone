import {useCallback, useState} from 'react';

export const useHover = (): {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  hover: boolean;
} => {
  const [hover, setHover] = useState(false);

  // eslint-disable-next-line @typescript-eslint/typedef
  const onMouseEnter = useCallback(() => {
    setHover(true);
  }, [setHover]);

  // eslint-disable-next-line @typescript-eslint/typedef
  const onMouseLeave = useCallback(() => {
    setHover(false);
  }, [setHover]);

  return {
    onMouseEnter,
    onMouseLeave,
    hover,
  };
};

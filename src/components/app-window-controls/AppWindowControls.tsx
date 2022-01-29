import React, {FC} from 'react';
import styles from './AppWindowControls.module.scss';

const AppWindowControls: FC<{
  onRedClick?(): void;
  onYellowClick?(): void;
  onGreenClick?(): void;
}> = ({onRedClick, onYellowClick, onGreenClick}) => {
  return (
    <div className={styles.appWindowControls}>
      <button className={styles.buttonRed} onClick={onRedClick} />
      <button className={styles.buttonYellow} onClick={onYellowClick} />
      <button className={styles.buttonGreen} onClick={onGreenClick} />
    </div>
  );
};

export default AppWindowControls;

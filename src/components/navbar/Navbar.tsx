import React, {FC} from 'react';
import styles from './Navbar.module.scss';
import {NAVBAR_HEIGHT} from './consts';

const Navbar: FC = () => {
  return (
    <div className={styles.navbar} style={{height: NAVBAR_HEIGHT}}>
      <div style={{fontWeight: 500}}>Bolgen OS 2.0</div>
      <div>23%</div>
    </div>
  );
};

export default Navbar;

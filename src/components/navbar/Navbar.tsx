import React, {FC} from 'react';
import styles from './Navbar.module.scss';
import {NAVBAR_HEIGHT} from './consts';

const Navbar: FC = () => {
  return (
    <div className={styles.navbar} style={{height: NAVBAR_HEIGHT}}>
      <div style={{fontWeight: 500}}>Nulnow.com</div>
      <div>
        <a href="andrey-razuvaev-resume.pdf" style={{textDecoration: 'underline'}} target="blank">resume.pdf</a>
      </div>
    </div>
  );
};

export default Navbar;

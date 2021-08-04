import React from 'react';
import { styles } from './styles.scss';

const Url = "/room/resources/images/animation_500_krj475tn.gif";
const LoadingScreen = ({ children }) => (
  <div className={styles.background}>
      <img src={Url} alt="loading logo" style={{width: 300,height: "auto"}} />
    <div className={styles.message}>
      {children}
    </div>
  </div>
);

export default LoadingScreen;

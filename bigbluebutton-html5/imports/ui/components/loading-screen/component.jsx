import React from 'react';
import { styles } from './styles.scss';
import Button from "../button/component";

const LoadingScreen = ({ children }) => (
  <div className={styles.background}>
    <div className={styles.spinner}>
      <div className={styles.bounce1} />
      <div className={styles.bounce2} />
      <div />
    </div>
    <div className={styles.message}>
      {children}
    </div>

      <div>
          <Button
              size="sm"
              color="primary"
              className={styles.button}
              onClick={() => window.location.reload()}
              label="Reload"
          />
      </div>
  </div>
);

export default LoadingScreen;

import React from 'react';
import { ToastContainer as Toastify } from 'react-toastify';

import ReactToastMessages from 'react-toast-messages';
import Icon from '../icon/component';
import { styles } from './styles';
import { toast, notice, check, Tooltip } from 'react-interaction';

class ToastContainer extends React.Component {
  // we never want this component to update since will break Toastify
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
        toast('This is a toast message')
      // <Toastify
      //   closeButton={(<Icon className={styles.close} iconName="close" />)}
      //   autoClose={5000}
      //   className={styles.container}
      //   toastClassName={styles.toast}
      //   bodyClassName={styles.body}
      //   progressClassName={styles.progress}
      //   newestOnTop={false}
      //   hideProgressBar={false}
      //   closeOnClick
      //   pauseOnHover
      // />
    );
  }
}

export default ToastContainer;

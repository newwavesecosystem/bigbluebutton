import React from 'react';
import { ToastContainer as Toastify } from 'react-toastify';

import ReactToastMessages from 'react-toast-messages';
import Icon from '../icon/component';
import { styles } from './styles';

class ToastContainer extends React.Component  {
  // we never want this component to update since will break Toastify
  constructor(props) {
    super(props);
    this.state = {
      status: 'danger', // success|danger|info|warning
      message: 'Hello',
      timeout: 2000
    }
  }
  shouldComponentUpdate() {
    return false;
  }

  show(){
    let self = this;
    self.setState({
      message:'This is test toast message'
    });
    setTimeout(function () {
      self.setState({
        message:''
      });
    }, this.state.timeout);
  }

  render() {
    return (
        <ReactToastMessages status={this.state.status} message={this.state.message} timeout={this.state.timeout}/>
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

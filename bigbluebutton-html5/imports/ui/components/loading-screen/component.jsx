import React from 'react';
import {styles} from './styles.scss';
import FancyButton from 'react-fancy-button';
import {Button} from "react-bootstrap";

const Url = '/room/resources/images/animation_500_krj475tn.gif';

state = {
    hidden: false
}

const LoadingScreen = ({children}) => (
    <div className={styles.background}>
        <div className={styles.spinner}>
            {/*<img src={Url} alt="loading logo" style={{width: 300, height: 'auto'}}/>*/}
            <div className={styles.bounce1}/>
            <div className={styles.bounce2}/>
            <div/>
        </div>
        <div className={styles.message}>
            {children}
        </div>

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}
        >
            <Button variant="primary" size="lg" onClick={() => {
                window.location.reload();
            }}>
                Re-konn3ct
            </Button>

            <FancyButton classes='btn btn--small btn-primary btn--full'
                         onClick={() => {
                             window.location.reload();
                         }}
                         label='Re-konn3ct'/>

        </div>
    </div>
);

export default LoadingScreen;

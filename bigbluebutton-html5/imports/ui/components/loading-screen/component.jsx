import React from 'react';
import {styles} from './styles.scss';
import Button from '../button/component';

const Url = '/room/resources/images/animation_500_krj475tn.gif';
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
            <Button
                label="Re-konn3ct"
                size="jumbo"
                onClick={() => {
                    window.location.reload();
                }}
            />

            {/*<FancyButton classes='btn btn--small btn-primary btn--full'*/}
            {/*             onClick={() => {*/}
            {/*                 window.location.reload();*/}
            {/*             }}*/}
            {/*             label='Re-konn3ct'/>*/}

        </div>
    </div>
);

export default LoadingScreen;

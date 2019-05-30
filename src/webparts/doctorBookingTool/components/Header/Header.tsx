import * as React from 'react';
import styles from './Header.module.scss';

const header = (props) => {
    return(
        <header className={styles.Header}>
            {/* Commented to remove Logos from Header on 15 Nov 2018 by Sandesh
                <div className={styles.LeftLogo}></div>
                <div className={styles.RightLogo}></div>
            */}
            <div className={styles.HeaderContent}>
                Doctor sessions booking tool
            </div>            
        </header>
    );
};

export default header;

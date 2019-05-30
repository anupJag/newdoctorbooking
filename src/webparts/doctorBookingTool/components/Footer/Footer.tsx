import * as React from 'react';
import styles from './Footer.module.scss';

const footer = (props) => {
    return (
        <footer className={styles.Footer}>
            <span className={styles.FooterText}>
                Please do not forget to inform Doctor by email/Skype in case you cannot attend the meeting
            </span>
        </footer>
    );
};

export default footer;
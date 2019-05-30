import * as React from 'react';
import styles from './ContractorsNotAllowed.module.scss';

export default (props) => {
    return(
        <div className={styles.ContractorNotAllowedContainer}>
            <div className={styles.ContractorMessage}>
                <p>myAnalytics Doctor sessions are available for MARS Associates only</p>
                <p>Contractors should refer to external platforms i.e., Tableau, Power BI or Alteryx communities for tool assistance</p>
            </div>
        </div>
    );
};
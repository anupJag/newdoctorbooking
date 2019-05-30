import * as React from 'react';
import styles from './TrainingTypeSelection.module.scss';

const trainingTypeSelection = () => {
    return(
        <div className={styles.TrainingType}>
            <div className={styles.TrainingTypeInfo}>Please Select a Training Session</div>
        </div>
    );
};

export default trainingTypeSelection;

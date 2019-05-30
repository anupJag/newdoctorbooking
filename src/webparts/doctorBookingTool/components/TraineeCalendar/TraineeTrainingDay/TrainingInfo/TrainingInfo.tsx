import * as React from 'react';
import styles from './TrainingInfo.module.scss';

export interface ITrainingInfoProps {
    day: string;
    date: string;
}


const trainingInfo = (props : ITrainingInfoProps) => {
    return (
        <div className={styles.TrainingInfo}>
            <div className={styles.Info}>
                <div style={{ width: "96px" }}>{props.day}</div>
                <div className={styles.Date}>{props.date}</div>
            </div>
        </div>
    );
};

export default trainingInfo;
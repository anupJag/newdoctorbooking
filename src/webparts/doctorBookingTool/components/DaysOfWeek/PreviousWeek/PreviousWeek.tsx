import * as React from 'react';
import styles from './PreviousWeek.module.scss';

export interface IPreviousProps {
    previousButtonClick: () => void;
}


const previousWeek = (props : IPreviousProps) => {
    
    return(
        <button
            onClick={props.previousButtonClick}
            className={styles.previousWeekButton}
        >
        </button>
    );
};


export default previousWeek;

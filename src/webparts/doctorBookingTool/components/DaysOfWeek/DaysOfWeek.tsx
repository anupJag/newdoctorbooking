import * as React from 'react';
import PreviousWeek from './PreviousWeek/PreviousWeek';
import NextWeek from './NextWeek/NextWeek';
import styles from './DaysOfWeek.module.scss';

export interface IDaysOfWeekProps{
    currentWeek: string;
    nextButtonClick:() => void;
    previousButtonClick: () => void;
}

const daysOfWeek = (props : IDaysOfWeekProps) => {
    return (
        <div className={styles.DaysOfWeek}>
            <PreviousWeek 
                previousButtonClick={props.previousButtonClick.bind(this)}
            />
            <div>
                {props.currentWeek}
            </div>
            <NextWeek 
                nextButtonClick={props.nextButtonClick.bind(this)}
            />
        </div>
    );
};

export default daysOfWeek;
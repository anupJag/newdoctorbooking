import * as React from 'react';
import styles from './NextWeek.module.scss';

export interface INextProps {
    nextButtonClick: () => void;
}

const nextWeek = (props: INextProps) => {

    return (
        <button
            //title="Next Week"
            onClick={props.nextButtonClick}
            className={styles.nextWeekButton}
        >
        </button>
    );
};


export default nextWeek;

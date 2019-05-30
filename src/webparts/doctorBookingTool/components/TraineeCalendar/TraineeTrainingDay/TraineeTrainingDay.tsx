import * as React from 'react';
import TrainingInfo from './TrainingInfo/TrainingInfo';
import styles from './TraineeTrainingDay.module.scss';
import { ITraineeRegisteredDataStructure } from '../ITraineeCalendar';
import TraineeDataInfo from './TraineeDataInfo/TraineeDataInfo';

export interface ITraineeTrainingDayProps {
    date: string;
    day: string;
    key: any;
    onRegisterButtonClicked: (event, key) => void;
    trainingDataInfo: ITraineeRegisteredDataStructure[];
    onDeregistrationButtonClicked: (event, key) => void;
}

const traineeTrainingDay = (props: ITraineeTrainingDayProps) => {
    return (
        <div className={styles.TraineeTrainingDay}>
            <TrainingInfo
                date={props.date}
                day={props.day}
            />
            <TraineeDataInfo
                traineeDataInfo={props.trainingDataInfo}
                onDeregisterSlotButtonClicked={props.onDeregistrationButtonClicked.bind(this)}
                onRegisterSlotButtonClicked={props.onRegisterButtonClicked.bind(this)}
            />
        </div>
    );
};

export default traineeTrainingDay;
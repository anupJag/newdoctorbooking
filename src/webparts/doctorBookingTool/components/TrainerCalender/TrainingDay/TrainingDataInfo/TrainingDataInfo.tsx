import * as React from 'react';
import styles from './TrainingDataInfo.module.scss';
import TrainingData from './TrainingData/TrainingData';
import { ITrainerRegisteredDataStructure } from '../../ITrainerCalender';

export interface ITrainingDataInfoProps {
    trainingDataInfo: ITrainerRegisteredDataStructure[];
    onDeRegistrationButtonClicked:(event, key) => void;
}

const trainingDataInfo = (props: ITrainingDataInfoProps) => {
    return (
        <div className={styles.TrainingDataInfo}>
            {
                props.trainingDataInfo && props.trainingDataInfo.length > 0 ?
                    props.trainingDataInfo.map((el, index: number) => {
                        let lastElement: boolean = false;

                        if (props.trainingDataInfo.length - 1 === index) {
                            lastElement = true;
                        }

                        return (
                            <TrainingData
                                session={el.Title}
                                key={el.Id}
                                time={el.SlotTiming}
                                trainer={el.Author}
                                isLastElement={lastElement}
                                isDeregisterDisabled={el.DeregisterDisabled}
                                onDeRegistrationButtonClicked={props.onDeRegistrationButtonClicked.bind(this, el.Id)}
                            />
                        );
                    }
                    )
                    :
                    <div className={styles.NoData}>
                        <div className={styles.NoDataContent}>No Registrations available for this day</div>
                    </div>
            }

        </div>
    );
};

export default trainingDataInfo;
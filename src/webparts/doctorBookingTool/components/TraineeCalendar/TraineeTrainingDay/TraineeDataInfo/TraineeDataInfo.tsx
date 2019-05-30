import * as React from 'react';
import styles from '../TraineeDataInfo/TraineeDataInfo.module.scss';
import TraineeData from '../TraineeData/TraineeData';
import { ITraineeRegisteredDataStructure } from '../../ITraineeCalendar';

export interface ITrainingDataInfoProps {
    traineeDataInfo: ITraineeRegisteredDataStructure[];
    onRegisterSlotButtonClicked:(event, key) => void;
    onDeregisterSlotButtonClicked:(event, key) => void;
}

const trainingDataInfo = (props: ITrainingDataInfoProps) => {
    return (
        <div className={styles.TraineeDataInfo}>
            {
                props.traineeDataInfo && props.traineeDataInfo.length > 0 ?
                    props.traineeDataInfo.map((el, index: number) => {
                        let lastElement: boolean = false;

                        if (props.traineeDataInfo.length - 1 === index) {
                            lastElement = true;
                        }

                        return (
                            <TraineeData
                                session={el.Title}
                                key={el.Id}
                                time={el.SlotTiming}
                                trainer={el.Author}
                                isLastElement={lastElement}
                                traineeBookingStatus={el.TraineeBookingStatus} 
                                slotAvailable={el.SlotAvailable}
                                onRegisterSlotButtonClicked={props.onRegisterSlotButtonClicked.bind(this, el.Id)}
                                onDeregisterSlotButtonClicked={props.onDeregisterSlotButtonClicked.bind(this, el.Id)}
                                disablePreviousDayRegDeregBUtton={el.DisablePrevDay}
                                timezone={el.DoctorTimeZone}
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
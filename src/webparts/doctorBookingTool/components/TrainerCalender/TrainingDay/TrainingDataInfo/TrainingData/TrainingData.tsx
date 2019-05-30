import * as React from 'react';
import styles from './TrainingData.module.scss';
import { ActionButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

export interface ITrainingDataProps {
    time: string;
    session: string;
    trainer: string;
    isLastElement: boolean;
    isDeregisterDisabled: boolean;
    onDeRegistrationButtonClicked: () => void;
}

const trainingData = (props: ITrainingDataProps) => {

    const styleToBeApplied: React.CSSProperties = {
        marginBottom: "0"
    };

    const classToBeApplied = props.isDeregisterDisabled ? `${styles.Info} ${styles.OtherUsersDataStyles}` : `${styles.Info} ${styles.CurrLoggedInUserStyles}`;

    return (
        <div className={classToBeApplied} style={props.isLastElement ? styleToBeApplied : null}>
            <div className={styles.InfoHolder}>
                <div>{props.time}</div>
                <div className={styles.SessionCss}>{`${props.session}`}</div>
            </div>
            <div className={styles.DoctorDispNameCss}>{`by ${props.trainer}`}</div>
            <div className={styles.ButtonStyle}>
                <ActionButton
                    iconProps={{ iconName: "EventDeclined" }}
                    disabled={props.isDeregisterDisabled}
                    onClick={props.onDeRegistrationButtonClicked}
                >
                </ActionButton>
            </div>
        </div>
    );
};

export default trainingData;
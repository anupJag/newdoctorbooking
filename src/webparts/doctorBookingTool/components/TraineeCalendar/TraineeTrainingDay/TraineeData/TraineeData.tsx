import * as React from 'react';
import styles from './TraineeData.module.scss';
import { ActionButton, IButtonProps, IButtonStyles } from 'office-ui-fabric-react/lib/Button';
import { TraineeBookingStatusTypes } from '../../ITraineeCalendar';
import { UrlException } from 'sp-pnp-js';


export interface ITraineeDataProps {
    time: string;
    session: string;
    trainer: string;
    isLastElement: boolean;
    traineeBookingStatus: string;
    slotAvailable: boolean;
    disablePreviousDayRegDeregBUtton: boolean;
    onDeregisterSlotButtonClicked: () => void;
    onRegisterSlotButtonClicked: () => void;
    timezone: string;
}

const traineeData = (props: ITraineeDataProps) => {

    const styleToBeApplied: React.CSSProperties = {
        marginBottom: "0"
    };
    //#region CSS Styling
    let styleToApply: string = null;
    let iconButtonStyle: IButtonStyles;

    const isDisabled: boolean = props.traineeBookingStatus === TraineeBookingStatusTypes.NotAvailableForMe || !props.slotAvailable || props.disablePreviousDayRegDeregBUtton;

    if (props.traineeBookingStatus === TraineeBookingStatusTypes.BookedByMe) {
        styleToApply = `${styles.Info} ${styles.BookedSlot}`;
        iconButtonStyle = {
            icon: {
                color: 'white'
            },
            iconHovered: {
                color: 'white'
            }
        };
    }
    else if (props.traineeBookingStatus === TraineeBookingStatusTypes.NotAvailableForMe) {
        styleToApply = `${styles.Info} ${styles.NotBookedForMe}`;
    }
    else {
        if (!props.slotAvailable) {
            styleToApply = `${styles.Info} ${styles.NotBookedForMe}`;
        }
        else {
            styleToApply = `${styles.Info} ${styles.AvailableSlot}`;
        }
    }
    //#endregion

    return (
        <div className={styleToApply} style={props.isLastElement ? styleToBeApplied : null}>
            <div className={styles.InfoHolder}>
                <div className={styles.SessionInfo}>{props.time} {props.timezone}</div>
                <div className={styles.SessionCss}>{`${props.session}`}</div>
            </div>
            <div className={styles.DoctorDispNameCss}>{`by ${props.trainer}`}</div>
            <div className={styles.ButtonStyle}>
                {
                    props.traineeBookingStatus === TraineeBookingStatusTypes.BookedByMe ?
                        <ActionButton
                            iconProps={{ iconName: "RemoveEvent" }}
                            styles={iconButtonStyle}
                            onClick={props.onDeregisterSlotButtonClicked}
                            disabled={props.disablePreviousDayRegDeregBUtton}
                        >
                        </ActionButton>
                        :

                        !props.slotAvailable ?
                            <ActionButton
                                iconProps={{ iconName: "ProtectRestrict" }}
                                styles={iconButtonStyle}
                                disabled={isDisabled}
                                onClick={props.onRegisterSlotButtonClicked}
                            />
                            :
                            <button
                                onClick={props.onRegisterSlotButtonClicked}
                                disabled={isDisabled}
                                className={styles.ButtonStyling}
                                style={
                                    {
                                        background: !isDisabled ? `url('https://team.effem.com/sites/myAnalytics/SiteAssets/Images/Book.png')`
                                            :
                                            `url('https://team.effem.com/sites/myAnalytics/SiteAssets/Images/BookDisable.png')`,
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundColor: "transparent",
                                        backgroundSize: "contain",
                                        cursor: !isDisabled ? "pointer" : "not-allowed"
                                    }
                                }
                            />
                }
            </div>
        </div>
    );
};

export default traineeData;
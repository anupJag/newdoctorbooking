import * as React from 'react';
import styles from './SessionDetail.module.scss';

export interface ISessionDetailsProps {
    sessionTitle: string;
    sessionDate: string;
    sessionSlotTiming: string;
    sessionTimezone: string;
}

const sessionDetails = (props: ISessionDetailsProps) => {
    return (
        <div className={styles.SessionDetail}>
            <div className={styles.Session}>Session Details</div>
            <div className={styles.SessionTitleContainer}>
                <div className={styles.SessionTitle}>Session Title</div>
                <div className={styles.Title}>{props.sessionTitle}</div>
            </div>
            {/* <div className={styles.SessionOfferingContainer}>
                <div className={styles.SessionOffering}>Session Offering</div>
                <div className={styles.Offering}>{props.sessionInfo}</div>
            </div> */}
            <div className={styles.SessionOfferingContainer}>
                <div className={styles.SessionOffering}>Session Timezone</div>
                <div className={styles.Offering}>{props.sessionTimezone}</div>
            </div>
            <div className={styles.Details}>
                <div className={styles.SessionDateContainer}>
                    <div className={styles.SessionDate}>Session Date</div>
                    <div className={styles.SessionDateDetail}>{props.sessionDate}</div>
                </div>
                <div className={styles.SessionTimingContainer}>
                    <div className={styles.SessionSlotTiming}>Session Time</div>
                    <div className={styles.SessionSlotTimingDetail}>{props.sessionSlotTiming}</div>
                </div>
            </div>
        </div>
    );
};

export default sessionDetails;
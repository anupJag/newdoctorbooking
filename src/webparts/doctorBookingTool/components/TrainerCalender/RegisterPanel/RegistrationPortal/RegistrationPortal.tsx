import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from './RegistrationPortal.module.scss';
import LeftSection from './LeftSection/LeftSection';
import RightSection from './RightSection/RightSection';
import { ITrainingSlots } from '../../ITrainerCalender';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';


export interface IRegistrationPortalProps {
    timeOfDay: ITrainingSlots[];
    sessionName: string;
    sessionDate: string;
    sessionNameFieldOnBlur: (event: any) => void;
    //sessionDescFieldOnBlur: (event: any) => void;
    onCheckboxChangeEvent: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    isSessionNameDisabled: boolean;
    isTimezoneDisabled: boolean;
    //isSessionDescDisabled: boolean;
    forceDisable: boolean;
    defaultValueForSessionName: string;
    timezoneData: IDropdownOption[];
    onTimezoneDropDownChanged : (event: React.FormEvent<HTMLDivElement>, item : IDropdownOption) => void;
}

const registrationPortal = (props: IRegistrationPortalProps) => {
    return (
        <div className={styles.RegistrationPortal}>
            <div className={styles.HeaderContainer}>
                <header className={styles.Header}>
                    <div>
                        Session on {props.sessionName}
                    </div>
                    <div>
                        Session date: {props.sessionDate}
                    </div>
                </header>
            </div>
            <div className={styles.BodyContainer}>
                <div className={styles.LeftContainer}>
                    {/* Training Session Details Disabled <LeftSection 
                        sessionNameFieldOnBlur={props.sessionNameFieldOnBlur.bind(this)}
                        sessionDescFieldOnBlur={props.sessionDescFieldOnBlur.bind(this)}
                        isSessionDescDisabled={props.isSessionDescDisabled}
                        isSessionNameDisabled={props.isSessionNameDisabled}
                        defaultValueForSessionName={props.defaultValueForSessionName}
                    /> */}
                    <LeftSection 
                        sessionNameFieldOnBlur={props.sessionNameFieldOnBlur.bind(this)}
                        isSessionNameDisabled={props.isSessionNameDisabled}
                        defaultValueForSessionName={props.defaultValueForSessionName}
                        timezoneData={props.timezoneData}
                        isTimezoneDisabled={props.isTimezoneDisabled}
                        onTimezoneDropDownChanged={props.onTimezoneDropDownChanged}
                    />
                </div>
                <div className={styles.RightContainer}>
                    <RightSection
                        timeOfDay={props.timeOfDay}
                        onCheckboxChangeEvent={props.onCheckboxChangeEvent.bind(this)}
                        forceDisable={props.forceDisable}
                    />
                </div>
            </div>
        </div>
    );
};

export default registrationPortal;
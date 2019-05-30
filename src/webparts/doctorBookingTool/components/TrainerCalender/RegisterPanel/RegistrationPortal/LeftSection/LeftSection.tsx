import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from './LeftSection.module.scss';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface ILeftSectionProps {
    sessionNameFieldOnBlur: (event: any) => void;
    //sessionDescFieldOnBlur: (event: any) => void;
    isSessionNameDisabled: boolean;
    isTimezoneDisabled: boolean;
    //isSessionDescDisabled: boolean;
    defaultValueForSessionName : string;
    timezoneData : IDropdownOption[];
    onTimezoneDropDownChanged: (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => void;
}

const leftSection = (props: ILeftSectionProps) => {

    let defaultSelected : IDropdownOption[] = props.timezoneData && props.timezoneData.length > 0 ? props.timezoneData.filter(el => el.key === 48) : [];

    if(!(defaultSelected && defaultSelected.length > 0)){
        defaultSelected = [{
            text: props.timezoneData[0].text,
            key: props.timezoneData[0].key
        }];
    }


    return (
        <div className={styles.LeftSection}>
            <div className={styles.TextFieldSection}>
                <TextField
                    label={"Session Name"}
                    ariaLabel={"Session Name"}
                    required={true}
                    disabled={props.isSessionNameDisabled}
                    onBlur={props.sessionNameFieldOnBlur}
                    defaultValue={props.defaultValueForSessionName}
                />
            </div>
            {/* <div className={styles.TextMultiLineFieldSection}>
                <TextField
                    label={"Session Information"}
                    ariaLabel={"Session Name"}
                    multiline={true}
                    rows={4}
                    required={true}
                    disabled={props.isSessionDescDisabled}
                    onBlur={props.sessionDescFieldOnBlur}
                />
            </div> */}
            <div className={styles.DropDownSelectionSection}>
                <Dropdown 
                    placeHolder={"Select a Timezone"}
                    label={"Timezone"}
                    required={true}
                    options={props.timezoneData}
                    onChange={props.onTimezoneDropDownChanged}
                    disabled={props.isTimezoneDisabled}
                    defaultSelectedKey={defaultSelected[0].key}
                />
            </div>
        </div>
    );
};

export default leftSection;
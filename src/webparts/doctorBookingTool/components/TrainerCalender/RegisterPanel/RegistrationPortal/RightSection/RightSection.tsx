import * as React from 'react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Checkbox, ICheckboxProps, ICheckboxStyles } from 'office-ui-fabric-react/lib/Checkbox';
import styles from './RightSection.module.scss';
import { ITrainingSlots } from '../../../ITrainerCalender';

export interface IRightSectionProps {
    timeOfDay: ITrainingSlots[];
    forceDisable: boolean;
    onCheckboxChangeEvent: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
}

const rightSection = (props: IRightSectionProps) => {
    const checkBoxStyle: ICheckboxStyles = {
        root: {
            marginTop : '4px',
            marginBottom : '4px'
        }
    };

    return (
        <div className={styles.RightSection}>
            <div>
                <Label>Select Session(s) Schedule</Label>
            </div>
            <div className={styles.SessionCheckSection}>
                {
                    props.timeOfDay.map((el: ITrainingSlots) =>
                        <Checkbox
                            label={el.Label}
                            key={el.Id}
                            checked={el.isChecked}
                            disabled={el.isDisabled || props.forceDisable}
                            styles={checkBoxStyle}
                            onChange={props.onCheckboxChangeEvent.bind(this, el.Id)}
                        />
                    )
                }
            </div>
        </div>
    );
};


export default rightSection;
import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ITraineeToolCheckBox } from '../../ITraineeCalendar';
import styles from './SessionPanel.module.scss';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import SessionDetail from './SessionDetails/SessionDetails';

export interface ISessionPanelProps {
    sessionType: string;
    sessionTitle: string;
    sessionDate: string;
    //sessionInfo: string;
    sessionSlotTiming: string;
    checkBoxProficiency: ITraineeToolCheckBox[];
    checkBoxProficiencyChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    traineeSharedDashboardOptions: ITraineeToolCheckBox[];
    onTraineeSharedDashboardChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    checkBoxAlreadySharingDashBoard: ITraineeToolCheckBox[];
    checkBoxAlreadySharingDashboardChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    checkboxTraineeToolForUse: ITraineeToolCheckBox[];
    checkBoxTraineeToolForUseChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    checkboxTraineeDataSourceInUse: ITraineeToolCheckBox[];
    checkboxTraineeDataSourceInUseChange: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    onTraineeIssueDescBlur: (event: any) => void;
    traineeIssueDesc: string;
    forceDisable: boolean;
    sessionTimezone: string;
}

const sessionPanel = (props: ISessionPanelProps) => {
    return (
        <div className={styles.SessionPanel}>
            <header className={styles.HeaderContainer}>
                <div className={styles.Header}>
                    Thank you! For choosing session on {props.sessionType}
                </div>
                <div className={styles.SessionDetail}>
                    <SessionDetail
                        sessionDate={props.sessionDate}
                        //sessionInfo={props.sessionInfo}
                        sessionSlotTiming={props.sessionSlotTiming}
                        sessionTitle={props.sessionTitle}
                        sessionTimezone={props.sessionTimezone}
                    />
                </div>
                <div className={styles.SubHeader}>
                    Inorder to complete your registraion, you are requested to complete the below questionnaire.
                </div>
            </header>
            <div className={styles.BodyContainer}>
                <div className={styles.InnerBody}>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>1. Can you briefly describe the {props.sessionType} issue you wish us to help you with?</div>
                        <TextField
                            multiline
                            onBlur={props.onTraineeIssueDescBlur}
                            value={props.traineeIssueDesc}
                            disabled={props.forceDisable}
                        />
                    </div>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>2. How would you rate your {props.sessionType} proficiency? (Please check the appropriate answer)</div>
                        <div>
                            {
                                props.checkBoxProficiency.map((el: ITraineeToolCheckBox) =>
                                    <Checkbox
                                        label={el.label}
                                        checked={el.isChecked}
                                        key={el.id}
                                        onChange={props.checkBoxProficiencyChange.bind(this, el.id)}
                                        disabled={props.forceDisable}
                                        styles={{root : {
                                            marginTop: '2px'
                                        }}}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>3. Do you have any intention to share your dashboards with other people?</div>
                        <div>
                            {
                                props.traineeSharedDashboardOptions.map((el: ITraineeToolCheckBox) =>
                                    <Checkbox
                                        label={el.label}
                                        checked={el.isChecked}
                                        key={el.id}
                                        onChange={props.onTraineeSharedDashboardChange.bind(this, el.id)}
                                        disabled={props.forceDisable}
                                        styles={{root : {
                                            marginTop: '2px'
                                        }}}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>4. If you are already sharing dashboards, how do you share them:</div>
                        <div>
                            {
                                props.checkBoxAlreadySharingDashBoard.map((el: ITraineeToolCheckBox) =>
                                    <Checkbox
                                        label={el.label}
                                        checked={el.isChecked}
                                        key={el.id}
                                        onChange={props.checkBoxAlreadySharingDashboardChange.bind(this, el.id)}
                                        disabled={props.forceDisable}
                                        styles={{root : {
                                            marginTop: '2px'
                                        }}}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>5. Do you use {props.sessionType} for:</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {
                                props.checkboxTraineeToolForUse.map((el: ITraineeToolCheckBox) =>
                                    <Checkbox
                                        label={el.label}
                                        checked={el.isChecked}
                                        key={el.id}
                                        onChange={props.checkBoxTraineeToolForUseChange.bind(this, el.id)}
                                        disabled={props.forceDisable}
                                    />
                                )
                            }
                        </div>
                    </div>
                    <div className={styles.Questionnaire}>
                        <div className={styles.Question}>6. What type of Data Source are you currently using?</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            {
                                props.checkboxTraineeDataSourceInUse.map((el: ITraineeToolCheckBox) =>
                                    <Checkbox
                                        label={el.label}
                                        checked={el.isChecked}
                                        key={el.id}
                                        onChange={props.checkboxTraineeDataSourceInUseChange.bind(this, el.id)}
                                        disabled={props.forceDisable}
                                    />
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default sessionPanel;
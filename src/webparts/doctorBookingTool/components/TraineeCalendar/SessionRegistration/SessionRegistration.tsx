import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType, } from 'office-ui-fabric-react/lib/Panel';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import SessionPanel from './SessionPanel/SessionPanel';
import { ITraineeToolCheckBox } from '../ITraineeCalendar';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';


export interface ISessionRegistraionProps {
    isPanelOpen: boolean;
    onDismissClick: () => void;
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
    bookSlotHandler: () => void;
    sessionTimezone: string;
}

export interface ISessionRegistraionState {
    showSpinner: boolean;
    forceDisable: boolean;
}

export default class SessionRegistraion extends React.Component<ISessionRegistraionProps, ISessionRegistraionState>{

    /**
     * Default Constructor
     */
    constructor(props: ISessionRegistraionProps) {
        super(props);
        this.state = {
            showSpinner: false,
            forceDisable: false
        };

    }

    protected onBookSessionClickHandler = async () => {
        const disableControl = async () => {
            const promise = new Promise((resolve, reject) => {
                this.setState({
                    forceDisable: true,
                    showSpinner: true
                });
                resolve("State Updated");
            });

            await promise.then((data) => console.log(data));
        };

        const timingOut = async () => {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve("Complete"), 2000);
            });

            let result = await promise;
            console.log(result);
        };

        disableControl().then(() => {
            timingOut().then(this.props.bookSlotHandler);
        });

    }


    private _onRenderFooterContent = (): JSX.Element => {

        const showSpinner: JSX.Element = this.state.showSpinner ?
            <Spinner
                size={SpinnerSize.medium}
                style={{ marginLeft: "3%" }}
            />
            :
            null;

        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <PrimaryButton
                    style={{ marginRight: '8px' }}
                    disabled={this.state.forceDisable}
                    onClick={this.onBookSessionClickHandler}
                >
                    Book Session
                </PrimaryButton>
                <DefaultButton onClick={this.props.onDismissClick} disabled={this.state.forceDisable}>Cancel</DefaultButton>
                {showSpinner}
            </div>
        );
    }

    public render(): React.ReactElement<ISessionRegistraionProps> {
        return (
            <div>
                <Panel
                    isOpen={this.props.isPanelOpen}
                    type={PanelType.medium}
                    isFooterAtBottom={true}
                    hasCloseButton={false}
                    onRenderFooterContent={this._onRenderFooterContent}
                >
                    <SessionPanel
                        sessionDate={this.props.sessionDate}
                        sessionSlotTiming={this.props.sessionSlotTiming}
                        sessionTitle={this.props.sessionTitle}
                        //sessionInfo={this.props.sessionInfo}
                        sessionType={this.props.sessionType}
                        checkBoxProficiency={this.props.checkBoxProficiency}
                        checkBoxProficiencyChange={this.props.checkBoxProficiencyChange.bind(this)}
                        traineeSharedDashboardOptions={this.props.traineeSharedDashboardOptions}
                        onTraineeSharedDashboardChange={this.props.onTraineeSharedDashboardChange.bind(this)}
                        checkBoxAlreadySharingDashBoard={this.props.checkBoxAlreadySharingDashBoard}
                        checkBoxAlreadySharingDashboardChange={this.props.checkBoxAlreadySharingDashboardChange.bind(this)}
                        checkboxTraineeToolForUse={this.props.checkboxTraineeToolForUse}
                        checkBoxTraineeToolForUseChange={this.props.checkBoxTraineeToolForUseChange.bind(this)}
                        checkboxTraineeDataSourceInUse={this.props.checkboxTraineeDataSourceInUse}
                        checkboxTraineeDataSourceInUseChange={this.props.checkboxTraineeDataSourceInUseChange.bind(this)}
                        onTraineeIssueDescBlur={this.props.onTraineeIssueDescBlur.bind(this)}
                        traineeIssueDesc={this.props.traineeIssueDesc}
                        forceDisable={this.state.forceDisable}
                        sessionTimezone={this.props.sessionTimezone}
                    />
                </Panel>
            </div>
        );
    }
}
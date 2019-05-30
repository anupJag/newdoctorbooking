import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType, } from 'office-ui-fabric-react/lib/Panel';
import RegistrationPortal from './RegistrationPortal/RegistrationPortal';
import { ITrainingSlots } from '../ITrainerCalender';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface IRegisterPanelProps {
    isPanelOpen: boolean;
    onDismissClick: () => void;
    registrationDate: string;
    timeOfDay: ITrainingSlots[];
    sessionNameFieldOnBlur: (event: any) => void;
    //sessionDescFieldOnBlur: (event: any) => void;
    sessionName: string;
    sessionDate: string;
    onCheckboxChangeEvent: (ev: React.FormEvent<HTMLElement>, isChecked: boolean, index: number) => void;
    primaryButtonText: string;
    onSaveClick: () => void;
    isReserveSlotsDisabled: boolean;
    timezoneData: IDropdownOption[];
    onTimezoneDropDownChanged : (event: React.FormEvent<HTMLDivElement>, item : IDropdownOption) => void;
}

export interface IRegisterPanelState {
    showSpinner: boolean;
    isSessionNameDisabled: boolean;
    //isSessionDescDisabled: boolean;
    isReserveSlotsDisabled: boolean;
    isCancelDisabled: boolean;
    isTrainingSlotsDisabled: boolean;
    isTrainerTimezoneDisabled: boolean;
}

export default class registerPanel extends React.Component<IRegisterPanelProps, IRegisterPanelState>{

    /**
     *
     */
    constructor(props: IRegisterPanelProps) {
        super(props);
        this.state = {
            showSpinner: false,
            //isSessionDescDisabled: false,
            isSessionNameDisabled: false,
            isReserveSlotsDisabled: false,
            isCancelDisabled: false,
            isTrainingSlotsDisabled: false,
            isTrainerTimezoneDisabled: false
        };
    }

    protected onSaveButtonClicked = async () => {

        const updateState = async () => {
            let promise = new Promise((resolve, reject) => {
                this.setState({
                    showSpinner: true,
                    isReserveSlotsDisabled: true,
                    //isSessionDescDisabled: true,
                    isSessionNameDisabled: true,
                    isCancelDisabled: true,
                    isTrainingSlotsDisabled: true,
                    isTrainerTimezoneDisabled: true
                });
                resolve("State Updated");
            });

            let result = await promise;
            console.log(result);
        };

        const timingOut = async () => {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve("Complete"), 2000);
            });

            let result = await promise;
            console.log(result);
        };

        updateState().then(() => {
            timingOut().then(this.props.onSaveClick);
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
                <PrimaryButton onClick={this.onSaveButtonClicked} style={{ marginRight: '8px' }} disabled={this.props.isReserveSlotsDisabled || this.state.isReserveSlotsDisabled}>
                    {this.props.primaryButtonText}
                </PrimaryButton>
                <DefaultButton onClick={this.props.onDismissClick} disabled={this.state.isCancelDisabled}>Cancel</DefaultButton>
                {showSpinner}
            </div>
        );
    }


    public render(): React.ReactElement<IRegisterPanelProps> {


        return (
            <div>
                <Panel
                    isOpen={this.props.isPanelOpen}
                    type={PanelType.medium}
                    isFooterAtBottom={true}
                    hasCloseButton={false}
                    onRenderFooterContent={this._onRenderFooterContent}
                >
                    {/* Training Session Disabled <RegistrationPortal
                        timeOfDay={this.props.timeOfDay}
                        sessionDescFieldOnBlur={this.props.sessionDescFieldOnBlur.bind(this)}
                        sessionNameFieldOnBlur={this.props.sessionNameFieldOnBlur.bind(this)}
                        sessionDate={this.props.sessionDate}
                        sessionName={this.props.sessionName}
                        defaultValueForSessionName={`${this.props.sessionName} doctor session`}
                        isSessionDescDisabled={this.state.isSessionDescDisabled}
                        isSessionNameDisabled={this.state.isSessionNameDisabled}
                        onCheckboxChangeEvent={this.props.onCheckboxChangeEvent.bind(this)}
                        forceDisable={this.state.isTrainingSlotsDisabled}
                    /> */}
                    <RegistrationPortal
                        timeOfDay={this.props.timeOfDay}
                        sessionNameFieldOnBlur={this.props.sessionNameFieldOnBlur.bind(this)}
                        sessionDate={this.props.sessionDate}
                        sessionName={this.props.sessionName}
                        defaultValueForSessionName={`${this.props.sessionName} doctor session`}
                        isSessionNameDisabled={this.state.isSessionNameDisabled}
                        onCheckboxChangeEvent={this.props.onCheckboxChangeEvent.bind(this)}
                        forceDisable={this.state.isTrainingSlotsDisabled}
                        timezoneData={this.props.timezoneData}
                        onTimezoneDropDownChanged={this.props.onTimezoneDropDownChanged}
                        isTimezoneDisabled={this.state.isTrainerTimezoneDisabled}
                    />
                </Panel>
            </div>
        );
    }

}


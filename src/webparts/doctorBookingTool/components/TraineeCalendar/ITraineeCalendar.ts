import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import { IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup";

export interface ITraineeCalendarProps {
    startDate: Date;
    endDate: Date;
    trainingType: IDropdownOption;
    daysOfWeek: string[];
    months: string[];
    siteURL: string;
    trainingSlotsListGUID: string;
    loggedInUser: string;
    doctorsAppointments: string;
    loggedInUserEmail: string;
}

export interface ITraineeCalendarState {
    startDate: Date;
    endDate: Date;
    trainingType: IDropdownOption;
    isRegisterPanelOpen: boolean;
    // registrationDate: string;
    showSpinner: boolean;
    trainingSlots: ITrainingSlots[];
    selectedTraininigSlot: ITraineeRegisteredDataStructure;
    registeredWeekData: IWeekTraineeData;
    hideConfirmDialog: boolean;
    deleteRegistration: ITraineeRegisteredDataStructure;
    showDialogSpinner: boolean;
    powerBIProficiency: ITraineeToolCheckBox[];
    tableauProficiency: ITraineeToolCheckBox[];
    traineeShareDashboard: ITraineeToolCheckBox[];
    powerBIAlreadySharingDashboard: ITraineeToolCheckBox[];
    tableauAlreadySharingDashboard: ITraineeToolCheckBox[];
    traineeToolForUse: ITraineeToolCheckBox[];
    traineeDataSourceInUse: ITraineeToolCheckBox[];
    traineeIssueDescription: string;
}

export interface ITraineeData {
    Title: string;
    RegistrationDate: string;
    TrainerRegistrationStatus: string;
    CategoryId: number;
    //TrainingInfo: string;
    SlotTimingId: number;
    SessionId: string;
}

export enum TraineeBookingStatusTypes {
    BookedByMe = "BookedByMe",
    Available = "Available",
    NotAvailableForMe = "NotAvailableForMe"
}

export interface ITrainingSlots {
    Id: string;
    Label: string;
    isChecked: boolean;
    isDisabled: boolean;
}

export interface ITraineeToolCheckBox {
    isChecked: boolean;
    label: string;
    id: number;
}


export interface ITraineeRegisteredDataStructure {
    Title: string;
    SlotTiming: string;
    Author: string;
    Id: number;
    RegistrationDate: string;
    Trainee: string;
    SlotAvailable: boolean;
    TraineeBookingStatus: string;
    //TrainingInfo: string;
    DoctorTimeZone : string;
    DisablePrevDay: boolean;
    SessionId: string;
}

export interface IWeekTraineeData {
    Monday: ITraineeRegisteredDataStructure[];
    Tuesday: ITraineeRegisteredDataStructure[];
    Wednesday: ITraineeRegisteredDataStructure[];
    Thursday: ITraineeRegisteredDataStructure[];
    Friday: ITraineeRegisteredDataStructure[];
}
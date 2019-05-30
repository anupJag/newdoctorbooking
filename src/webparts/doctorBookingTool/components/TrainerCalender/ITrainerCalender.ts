import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";

export interface ITrainerCalenderProps {
    startDate: Date;
    endDate: Date;
    trainingType: IDropdownOption;
    daysOfWeek: string[];
    months: string[];
    siteURL: string;
    trainingSlotsListGUID : string;
    loggedInUser: string;
    doctorsAppointments: string;
    timeZoneListGUID: string;
}

export interface ITrainerCalenderState {
    startDate: Date;
    endDate: Date;
    trainingType: IDropdownOption;
    timezoneSelected: IDropdownOption;
    timezoneData: IDropdownOption[];
    isRegisterPanelOpen: boolean;
    registrationDate: string;
    showSpinner: boolean;
    sessionName: string;
    //sessionDesc: string;
    trainingSlots: ITrainingSlots[];
    selectedTraininigSlots: string[];
    registeredWeekData: IWeekTrainerData;
    hideConfirmDialog: boolean;
    deleteRegistration: ITrainerRegisteredDataStructure;
    showDialogSpinner : boolean;
}

export interface ITrainerData {
    Title: string;
    RegistrationDate: string;
    TrainerRegistrationStatus: string;
    CategoryId: number;
    //TrainingInfo: string;
    SlotTimingId: number;
    DoctorTimeZoneId: number;
    SessionId : string;
}

export enum TrainerRegistrationStatus {
    Booked = "Booked",
    Cancelled = "Cancelled"
}

export interface ITrainingSlots {
    Id: string;
    Label: string;
    isChecked: boolean;
    isDisabled: boolean;
}

export interface ITrainerRegisteredDataStructure{
    Title: string;
    SlotTiming: string;
    Author: string;
    Id: number;
    RegistrationDate: string;
    DeregisterDisabled? : boolean;
}

export interface IWeekTrainerData{
    Monday: ITrainerRegisteredDataStructure[];
    Tuesday: ITrainerRegisteredDataStructure[];
    Wednesday: ITrainerRegisteredDataStructure[];
    Thursday: ITrainerRegisteredDataStructure[];
    Friday: ITrainerRegisteredDataStructure[];
}
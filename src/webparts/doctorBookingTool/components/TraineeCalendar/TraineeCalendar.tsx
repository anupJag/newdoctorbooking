import * as React from 'react';
import TraineeTrainingDay from './TraineeTrainingDay/TraineeTrainingDay';
import styles from './TraineeCalendar.module.scss';
import { ITraineeCalendarProps, ITraineeCalendarState, TraineeBookingStatusTypes, ITrainingSlots, ITraineeRegisteredDataStructure, IWeekTraineeData, ITraineeToolCheckBox } from './ITraineeCalendar';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { escape, findIndex, find, assign } from '@microsoft/sp-lodash-subset';
import pnp, { Web, ItemAddResult } from 'sp-pnp-js';
import ConfirmationDialog from './ConfirmationDialog/ConfirmationDialog';
import SessionRegistraion from './SessionRegistration/SessionRegistration';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';


export default class TraineeCalendar extends React.Component<ITraineeCalendarProps, ITraineeCalendarState>{

    /**
     * Default Constructor
     */
    constructor(props: ITraineeCalendarProps) {
        super(props);
        this.state = {
            registeredWeekData: undefined,
            endDate: props.endDate,
            traineeIssueDescription: '',
            startDate: props.startDate,
            trainingType: props.trainingType,
            trainingSlots: undefined,
            showSpinner: true,
            hideConfirmDialog: true,
            showDialogSpinner: false,
            deleteRegistration: undefined,
            isRegisterPanelOpen: false,
            selectedTraininigSlot: undefined,
            traineeDataSourceInUse: [
                {
                    id: 0,
                    isChecked: false,
                    label: "Excel"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "CSV"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "Azure"
                },
                {
                    id: 3,
                    isChecked: false,
                    label: "SAP"
                },
                {
                    id: 4,
                    isChecked: false,
                    label: "SQL"
                },
                {
                    id: 5,
                    isChecked: false,
                    label: "Others"
                },
            ],
            traineeToolForUse: [
                {
                    id: 0,
                    isChecked: false,
                    label: "Creating Reports"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "Ad hoc Analysis"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "I don’t use Power BI"
                },
            ],
            powerBIAlreadySharingDashboard: [
                {
                    id: 0,
                    isChecked: false,
                    label: "Using Power BI Service"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "Power BI Desktop (pbix) files"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "E-mail"
                },
                {
                    id: 3,
                    isChecked: false,
                    label: "None of the above"
                }
            ],
            tableauAlreadySharingDashboard: [
                {
                    id: 0,
                    isChecked: false,
                    label: "Using Tableau server"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "E-mail"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "Tableau Reader"
                },
                {
                    id: 3,
                    isChecked: false,
                    label: "None of the above"
                }
            ],
            powerBIProficiency: [
                {
                    id: 0,
                    isChecked: false,
                    label: "I have no idea what Power BI is"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "I have downloaded a Power BI trial and just started using it"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "I’m already creating and sharing dashboards with a Power BI Pro license"
                },
                {
                    id: 3,
                    isChecked: false,
                    label: "I’m creating dashboards on a daily basis and sharing via Mars Power BI Service"
                },
                {
                    id: 4,
                    isChecked: false,
                    label: "I’m very proficient and already giving support to my team"
                },
            ],
            tableauProficiency: [
                {
                    id: 0,
                    isChecked: false,
                    label: "I have no idea what Tableau is"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "I have downloaded a Tableau trial and just started using it"
                },
                {
                    id: 2,
                    isChecked: false,
                    label: "I’m already creating and sharing dashboards with a trial version"
                },
                {
                    id: 3,
                    isChecked: false,
                    label: "I’m creating dashboards on a daily basis and sharing via Mars Tableau server"
                },
                {
                    id: 4,
                    isChecked: false,
                    label: "I’m very proficient and already giving support to my team"
                },
            ],
            traineeShareDashboard: [
                {
                    id: 0,
                    isChecked: false,
                    label: "Yes"
                },
                {
                    id: 1,
                    isChecked: false,
                    label: "No"
                }
            ]
        };

    }

    public componentDidMount() {
        this.getTrainingSlots().then(() => {
            this.getTraineeRegisteredData().then(() => console.log('Loading Complete'));
        });
    }

    public componentWillReceiveProps(nextProps: ITraineeCalendarProps) {
        let tempStartDate = this.state.startDate;
        let tempEndDate = this.state.endDate;
        let tempTrainingType = this.state.trainingType;

        if (nextProps.startDate != this.props.startDate) {
            tempStartDate = nextProps.startDate;
        }

        if (nextProps.endDate != this.props.endDate) {
            tempEndDate = nextProps.endDate;
        }

        if (nextProps.trainingType != this.props.trainingType) {
            tempTrainingType = nextProps.trainingType;
        }

        this.setState({
            startDate: tempStartDate,
            endDate: tempEndDate,
            trainingType: tempTrainingType
        }, this.getTraineeRegisteredData);
    }

    protected getTrainingSlots = async () => {
        let web = new Web(this.props.siteURL);
        let trainingSlotsGUID: string = this.props.trainingSlotsListGUID;
        let trainingSlotsCollection: ITrainingSlots[] = [];

        if (web && trainingSlotsGUID) {
            const data = await web.lists.getById(trainingSlotsGUID).items.select("Id", "Title").usingCaching({
                expiration: pnp.util.dateAdd(new Date, "minute", 60),
                key: trainingSlotsGUID,
                storeName: "local"
            }).configure({
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            }).get().then(p => p).catch((error: any) => error);

            if (data) {
                if (!data.status) {
                    data.forEach(element => {
                        trainingSlotsCollection.push({
                            Id: element["Id"],
                            Label: element["Title"],
                            isChecked: false,
                            isDisabled: false
                        });
                    });
                }
            }

            this.setState({
                trainingSlots: trainingSlotsCollection
            });
        }
    }

    protected getTraineeRegisteredData = async () => {
        this.setState({
            showSpinner: true
        });
        const slotData: ITrainingSlots[] = [...this.state.trainingSlots];
        const doctorBookingListID = this.props.doctorsAppointments;
        const startDate: Date = new Date(this.state.startDate.toUTCString());
        const trainingType: number = parseInt(this.state.trainingType.key.toString(), 0);
        const daysOfWeek: string[] = [...this.props.daysOfWeek];
        const todayDate = new Date();
        let batch = pnp.sp.createBatch();

        for (let index = 0; index < daysOfWeek.length; index++) {

            let newDate : Date = null;
            newDate = new Date(startDate.toUTCString());
            newDate.setDate(newDate.getDate() + index);

            pnp.sp.web.lists.getById(doctorBookingListID).items.select("Title", "DoctorTimeZone/Title", "SessionId" , "SlotTiming/Id", "Id", "Author/Title", "TrainerRegistrationStatus", "Category/Id", "RegistrationDate", "Trainee/Title", "SlotAvailable").expand("Author", "SlotTiming", "Category", "Trainee", "DoctorTimeZone").filter(`TrainerRegistrationStatus eq 'Booked' and Category eq ${trainingType} and RegistrationDate eq '${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}T00:00:00Z'`).configure({
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            }).inBatch(batch).get().then((p: any) => {
                let tempData: ITraineeRegisteredDataStructure[] = [];
                let tempRegisteredWeekData: IWeekTraineeData = { ...(this.state.registeredWeekData ? this.state.registeredWeekData : null) };
                if (p && p.length > 0) {
                    p.forEach(element => {

                        let slotTiming = slotData.filter(el => el.Id === element["SlotTiming"]["Id"]);
                        let slotName: string;
                        let tempDateToBeQueried: Date = new Date(element["RegistrationDate"]);
                        const checkIfRegIsDisabled: boolean = new Date(Date.UTC(tempDateToBeQueried.getFullYear(), tempDateToBeQueried.getMonth(), tempDateToBeQueried.getDate(), 0, 0, 0, 0)) >= new Date(Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, 0, 0, 0)) ? false : true;
                        if (slotTiming && slotTiming.length > 0) {
                            slotName = slotTiming[0]["Label"];
                        }

                        tempData.push({
                            Title: element["Title"],
                            SlotTiming: element["SlotTiming"] ? slotName : null,
                            Author: element["Author"]["Title"],
                            Id: element["Id"],
                            RegistrationDate: element["RegistrationDate"],
                            Trainee: element["Trainee"] ? element["Trainee"]["Title"] : null,
                            SlotAvailable: element["SlotAvailable"],
                            TraineeBookingStatus: TraineeBookingStatusTypes.Available,
                            //TrainingInfo: element["TrainingInfo"],
                            DoctorTimeZone: element["DoctorTimeZone"]["Title"],
                            DisablePrevDay: checkIfRegIsDisabled,
                            SessionId: element["SessionId"]
                        });
                    });
                }

                const { loggedInUser } = this.props;
                let getFilteredDataForLoggedInUser = tempData.filter(el => el.Trainee === loggedInUser);
                if (getFilteredDataForLoggedInUser && getFilteredDataForLoggedInUser.length > 0) {
                    getFilteredDataForLoggedInUser.forEach(element => {
                        const tempTitle = element.SessionId;
                        let getSessionInfoFromTitle = tempData.filter(el => el.SessionId === tempTitle);

                        if (getSessionInfoFromTitle && getSessionInfoFromTitle.length > 0) {
                            getSessionInfoFromTitle.forEach(ele => {
                                let trainingBookingStatus: string = null;
                                if (ele.SlotAvailable === false && ele.Trainee === loggedInUser) {
                                    trainingBookingStatus = TraineeBookingStatusTypes.BookedByMe;
                                }
                                else {
                                    trainingBookingStatus = TraineeBookingStatusTypes.NotAvailableForMe;
                                }

                                let indx = findIndex(tempData, el => el.Id === ele.Id);
                                tempData[indx]["TraineeBookingStatus"] = trainingBookingStatus;
                            });
                        }
                    });
                }

                tempRegisteredWeekData[daysOfWeek[index]] = tempData;

                this.setState({
                    registeredWeekData: tempRegisteredWeekData
                });

                console.log(tempRegisteredWeekData);
            }).catch(error => error);
        }

        await batch.execute().then(d => {
            console.log("Done");
            this.setState({
                showSpinner: false
            });
        });
    }

    protected onTraineeRegistrationClickHandler = (key: number): void => {

        const tempSessionData: IWeekTraineeData = { ...this.state.registeredWeekData };
        const weekDays: string[] = [...this.props.daysOfWeek];
        let dataToBeUpdated: ITraineeRegisteredDataStructure;

        for (let index = 0; index < weekDays.length; index++) {
            let dataForTheWeek: ITraineeRegisteredDataStructure[] = [...tempSessionData[weekDays[index]]];

            let dataToBeremoved = dataForTheWeek.filter(el => el.Id === key);

            if (dataToBeremoved && dataToBeremoved.length > 0) {
                dataToBeUpdated = { ...dataToBeremoved[0] };
                break;
            }
        }

        if (dataToBeUpdated) {
            let dateToBeConstructed: Date = new Date(dataToBeUpdated["RegistrationDate"]);
            let dateInString: string = `${this.props.months[dateToBeConstructed.getMonth()]} ${dateToBeConstructed.getDate()}, ${dateToBeConstructed.getFullYear()}`;
            dataToBeUpdated["RegistrationDate"] = dateInString;
        }

        this.setState({
            selectedTraininigSlot: dataToBeUpdated,
            isRegisterPanelOpen: true
        });
    }

    protected onTraineeDeregistrationClickHandler = (key: number): void => {

        const tempSessionData: IWeekTraineeData = { ...this.state.registeredWeekData };
        const weekDays: string[] = [...this.props.daysOfWeek];
        let dataToBeDeregistered: ITraineeRegisteredDataStructure;

        for (let index = 0; index < weekDays.length; index++) {
            let dataForTheWeek: ITraineeRegisteredDataStructure[] = [...tempSessionData[weekDays[index]]];

            let dataToBeremoved = dataForTheWeek.filter(el => el.Id === key);

            if (dataToBeremoved && dataToBeremoved.length > 0) {
                dataToBeDeregistered = { ...dataToBeremoved[0] };
                break;
            }
        }

        if (dataToBeDeregistered) {
            let dateToBeConstructed: Date = new Date(dataToBeDeregistered["RegistrationDate"]);
            let dateInString: string = `${this.props.months[dateToBeConstructed.getMonth()]} ${dateToBeConstructed.getDate()}, ${dateToBeConstructed.getFullYear()}`;
            dataToBeDeregistered["RegistrationDate"] = dateInString;
        }

        this.setState({
            deleteRegistration: dataToBeDeregistered,
            hideConfirmDialog: false
        });

    }

    protected onConfirmCloseDialogClickHandler = (): void => {
        this.setState({
            hideConfirmDialog: true
        });
    }

    /***
     * De register Slot
     */
    protected onConfirmYesDailogClickHandler = async () => {
        this.setState({
            showDialogSpinner: true
        });

        const asyncCall = async () => {
            const promise = await pnp.sp.web.lists.getById(this.props.doctorsAppointments).items.getById(this.state.deleteRegistration["Id"]).update({
                Questionnaire: "",
                SlotAvailable: true,
                TraineeId: 0
            }).then(data => {
                console.log(data);
            });

            console.log(promise);
        };


        asyncCall().then(() => {
            this.setState({
                hideConfirmDialog: true,
                showDialogSpinner: false
            });
        }).then(() => this.getTraineeRegisteredData());


    }

    protected onCheckboxProficiencyChangeEventHandler = (key: any, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
        let tempTrainingSlots: ITraineeToolCheckBox[] = [];

        if (this.state.trainingType.text === "Power BI") {
            tempTrainingSlots = [...this.state.powerBIProficiency];
        }
        else {
            tempTrainingSlots = [...this.state.tableauProficiency];
        }

        for (let i = 0; i < tempTrainingSlots.length; i++) {
            if (tempTrainingSlots[i]["id"] === key) {
                tempTrainingSlots[i]["isChecked"] = isChecked;
            }
        }

        if (this.state.trainingType.text === "Power BI") {
            this.setState({
                powerBIProficiency: tempTrainingSlots
            });
        }
        else {
            this.setState({
                tableauProficiency: tempTrainingSlots
            });
        }
    }

    protected onCheckboxAlreadySharedDashboardChangeEventHandler = (key: any, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
        let tempTrainingSlots: ITraineeToolCheckBox[] = [];

        if (this.state.trainingType.text === "Power BI") {
            tempTrainingSlots = [...this.state.powerBIAlreadySharingDashboard];
        }
        else {
            tempTrainingSlots = [...this.state.tableauAlreadySharingDashboard];
        }

        for (let i = 0; i < tempTrainingSlots.length; i++) {
            if (tempTrainingSlots[i]["id"] === key) {
                tempTrainingSlots[i]["isChecked"] = isChecked;
            }
        }

        if (this.state.trainingType.text === "Power BI") {
            this.setState({
                powerBIAlreadySharingDashboard: tempTrainingSlots
            });
        }
        else {
            this.setState({
                tableauAlreadySharingDashboard: tempTrainingSlots
            });
        }
    }

    protected onCheckboxTraineeToolForUseChangeEventHandler = (key: any, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
        let tempTraineeToolForUse: ITraineeToolCheckBox[] = [...this.state.traineeToolForUse];

        for (let i = 0; i < tempTraineeToolForUse.length; i++) {
            if (tempTraineeToolForUse[i]["id"] === key) {
                tempTraineeToolForUse[i]["isChecked"] = isChecked;
            }
        }

        this.setState({
            traineeToolForUse: tempTraineeToolForUse
        });
    }

    protected onCheckboxTraineeDataSourceInUseChangeEventHandler = (key: any, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
        let tempTraineeDataSourceInUse: ITraineeToolCheckBox[] = [...this.state.traineeDataSourceInUse];

        for (let i = 0; i < tempTraineeDataSourceInUse.length; i++) {
            if (tempTraineeDataSourceInUse[i]["id"] === key) {
                tempTraineeDataSourceInUse[i]["isChecked"] = isChecked;
            }
        }

        this.setState({
            traineeDataSourceInUse: tempTraineeDataSourceInUse
        });
    }

    protected onDismissClickHandler = (): void => {

        let tempPowerBIProficiency: ITraineeToolCheckBox[] = [...this.state.powerBIProficiency];
        let tempTableauProficiency: ITraineeToolCheckBox[] = [...this.state.tableauProficiency];

        for (let i = 0; i < tempPowerBIProficiency.length; i++) {
            tempPowerBIProficiency[i]["isChecked"] = false;
        }

        for (let i = 0; i < tempTableauProficiency.length; i++) {
            tempTableauProficiency[i]["isChecked"] = false;
        }

        let tempPowerBIAlreadyShared: ITraineeToolCheckBox[] = [...this.state.powerBIAlreadySharingDashboard];
        let tempTableauAlreadyShared: ITraineeToolCheckBox[] = [...this.state.tableauAlreadySharingDashboard];

        for (let i = 0; i < tempPowerBIAlreadyShared.length; i++) {
            tempPowerBIAlreadyShared[i]["isChecked"] = false;
        }

        for (let i = 0; i < tempTableauAlreadyShared.length; i++) {
            tempTableauAlreadyShared[i]["isChecked"] = false;
        }

        let tempTraineeToolForUse: ITraineeToolCheckBox[] = [...this.state.traineeToolForUse];

        for (let i = 0; i < tempTraineeToolForUse.length; i++) {
            tempTraineeToolForUse[i]["isChecked"] = false;
        }

        let tempTraineeDataSourceInUse: ITraineeToolCheckBox[] = [...this.state.traineeDataSourceInUse];

        for (let i = 0; i < tempTraineeDataSourceInUse.length; i++) {
            tempTraineeDataSourceInUse[i]["isChecked"] = false;
        }

        let tempTraineeSharedDashboard: ITraineeToolCheckBox[] = [...this.state.traineeShareDashboard];

        for (let i = 0; i < tempTraineeSharedDashboard.length; i++) {
            tempTraineeSharedDashboard[i]["isChecked"] = false;
        }



        this.setState({
            powerBIProficiency: tempPowerBIProficiency,
            tableauProficiency: tempTableauProficiency,
            traineeShareDashboard: tempTraineeSharedDashboard,
            traineeToolForUse: tempTraineeToolForUse,
            powerBIAlreadySharingDashboard: tempPowerBIAlreadyShared,
            tableauAlreadySharingDashboard: tempTableauAlreadyShared,
            traineeDataSourceInUse: tempTraineeDataSourceInUse,
            traineeIssueDescription: '',
            isRegisterPanelOpen: false
        });
    }

    protected onTraineeIssueDescriptionBlurHandler = (event: any): void => {
        let issueDescData = escape(event.target.value);
        this.setState({
            traineeIssueDescription: issueDescData
        });
    }

    protected onTraineeSharedDashboardChangeHandler = (key: any, ev: React.FormEvent<HTMLElement>, isChecked: boolean): void => {
        let tempTraineeSharedDashboard: ITraineeToolCheckBox[] = [...this.state.traineeShareDashboard];

        for (let i = 0; i < tempTraineeSharedDashboard.length; i++) {
            if (tempTraineeSharedDashboard[i]["id"] === key) {
                tempTraineeSharedDashboard[i]["isChecked"] = isChecked;
            }
            else {
                tempTraineeSharedDashboard[i]["isChecked"] = !isChecked;
            }
        }

        this.setState({
            traineeShareDashboard: tempTraineeSharedDashboard
        });
    }

    protected traineeBookSlotHandler = async () => {
        const loggedInUserID = await pnp.sp.web.ensureUser(`i:0#.f|membership|${this.props.loggedInUserEmail}`).then(el => el);

        //#region Questionnaire
        const ques1: string = `1. Can you briefly describe the ${this.state.trainingType.text} issue you wish us to help you with?`;
        const ques2: string = `2. How would you rate your ${this.state.trainingType.text} proficiency? (Please check the appropriate answer)`;
        const ques3: string = `3. Do you have any intention to share your dashboards with other people?`;
        const ques4: string = `4. If you are already sharing dashboards, how do you share them:`;
        const ques5: string = `5. Do you use ${this.state.trainingType.text} for:`;
        const ques6: string = `6. What type of Data Source are you currently using?`;

        const proficiency: string = this.state.trainingType.text.toLowerCase() === "Power BI".toLowerCase() ?
            this.state.powerBIProficiency.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('')
            :
            this.state.tableauProficiency.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('');

        const alreadySharingDashBoard: string = this.state.trainingType.text.toLowerCase() === "Power BI".toLowerCase() ?
            this.state.powerBIAlreadySharingDashboard.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('')
            :
            this.state.tableauAlreadySharingDashboard.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('');

        const traineeToolForUse: string = this.state.traineeToolForUse.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('');

        const traineeDataSourceInUse: string = this.state.traineeDataSourceInUse.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('');

        const traineeSharedDashboard : string = this.state.traineeShareDashboard.filter(el => el.isChecked === true).map(el => `<p>${el.label}</p>`).join('');

        let questionnaireString: string = `
            <div>
                <div>
                    <p><strong>${ques1}</strong></p>
                    <p>${this.state.traineeIssueDescription}</p>
                </div>
                <div>
                    <p><strong>${ques2}</strong></p>
                    <p>${proficiency}</p>
                </div>
                <div>
                    <p><strong>${ques3}</strong></p>
                    <p>${traineeSharedDashboard}</p>
                </div>
                <div>
                    <p><strong>${ques4}</strong></p>
                    <p>${alreadySharingDashBoard}</p>
                </div>
                <div>
                    <p><strong>${ques5}</strong></p>
                    <p>${traineeToolForUse}</p>
                </div>
                <div>
                    <p><strong>${ques6}</strong></p>
                    <p>${traineeDataSourceInUse}</p>
                </div>
            </div>
        `;

        //#endregion

        const reserveSlot = async () => {
            const promise = await pnp.sp.web.lists.getById(this.props.doctorsAppointments).items.getById(this.state.selectedTraininigSlot["Id"]).update({
                TraineeId: loggedInUserID.data.Id,
                SlotAvailable: false,
                Questionnaire: questionnaireString
            }).then(data => {
                console.log(data);
            });

            console.log(promise);
        };

        reserveSlot().then(() => this.onDismissClickHandler()).then(() => this.getTraineeRegisteredData()).then(() => this.sendEmail());

    }

    protected sendEmail = async () => {
        const idInJSON = {
            "id" : this.state.selectedTraininigSlot["Id"]
        };
        const uri : string = "https://prod-79.westus.logic.azure.com:443/workflows/0b6bea8a4d1c4528a9f3f20929657bab/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wrnWuFxieMgI4ubZjxl3UxgA5ptXnzPgHo0haHmKa74";
        let request = new XMLHttpRequest();
        request.open('POST', uri);
        request.setRequestHeader("Content-Type", "application/json");
        const response = await request.send(JSON.stringify(idInJSON));

        console.log(response);
    }

    public render(): React.ReactElement<ITraineeCalendarProps> {
        const showSpinner: JSX.Element = this.state.showSpinner ? <div style={{ position: 'absolute', left: '50%', top: '50%', transform : 'translate(-50%, -50%)' }}><Spinner size={SpinnerSize.large} label="Please wait while finish loading..." style={{ margin: "auto" }} /></div> : null;

        const trainingData: any = this.props.daysOfWeek.map((day: string, index: number) => {
            let temp = new Date(this.state.startDate.toUTCString());
            const todayDate = new Date();
            let tempVar = new Date(this.state.startDate.toUTCString());
            const tempDateParser = new Date(temp.setDate(tempVar.getDate() + index));
            let date: string = `${this.props.months[tempDateParser.getMonth()]} ${tempDateParser.getDate()}, ${tempDateParser.getFullYear()}`;
            temp = tempVar = null;

            const checkIfRegIsDisabled: boolean = new Date(Date.UTC(tempDateParser.getFullYear(), tempDateParser.getMonth(), tempDateParser.getDate(), 0, 0, 0, 0)) >= new Date(Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, 0, 0, 0)) ? false : true;

            let daysData: ITraineeRegisteredDataStructure[] = this.state.registeredWeekData ?
                [...(this.state.registeredWeekData[day] ? this.state.registeredWeekData[day] : [])]
                :
                [];

            daysData.sort((a: any, b: any) => {
                var SlotA = a["SlotTiming"].toUpperCase();
                var SlotB = b["SlotTiming"].toUpperCase();
                if (SlotA < SlotB) {
                    return -1;
                }
                if (SlotA > SlotB) {
                    return 1;
                }
                return 0;
            });

            return (
                <TraineeTrainingDay
                    day={day}
                    date={date}
                    key={index}
                    trainingDataInfo={daysData}
                    onRegisterButtonClicked={this.onTraineeRegistrationClickHandler.bind(this)}
                    onDeregistrationButtonClicked={this.onTraineeDeregistrationClickHandler.bind(this)}
                />

            );
        });

        const confirmDialog: JSX.Element = !this.state.hideConfirmDialog ?
            <ConfirmationDialog
                hideDialog={this.state.hideConfirmDialog}
                showSpinner={this.state.showDialogSpinner}
                _closeDialog={this.onConfirmCloseDialogClickHandler.bind(this)}
                _yesDialog={this.onConfirmYesDailogClickHandler.bind(this)}
                sessionName={this.state.deleteRegistration["Title"]}
                date={this.state.deleteRegistration["RegistrationDate"]}
                time={this.state.deleteRegistration["SlotTiming"]}
            />
            : null;

        const sessionRegistrationPortal: JSX.Element = this.state.isRegisterPanelOpen ?
            <SessionRegistraion
                isPanelOpen={this.state.isRegisterPanelOpen}
                onDismissClick={this.onDismissClickHandler.bind(this)}
                sessionDate={this.state.selectedTraininigSlot["RegistrationDate"]}
                sessionSlotTiming={this.state.selectedTraininigSlot["SlotTiming"]}
                sessionTitle={this.state.selectedTraininigSlot["Title"]}
                //sessionInfo={this.state.selectedTraininigSlot["TrainingInfo"]}
                sessionType={this.state.trainingType.text}
                checkBoxProficiency={this.state.trainingType.text === "Power BI" ? this.state.powerBIProficiency : this.state.tableauProficiency}
                checkBoxProficiencyChange={this.onCheckboxProficiencyChangeEventHandler.bind(this)}
                traineeSharedDashboardOptions={this.state.traineeShareDashboard}
                onTraineeSharedDashboardChange={this.onTraineeSharedDashboardChangeHandler.bind(this)}
                checkBoxAlreadySharingDashBoard={this.state.trainingType.text === "Power BI" ? this.state.powerBIAlreadySharingDashboard : this.state.tableauAlreadySharingDashboard}
                checkBoxAlreadySharingDashboardChange={this.onCheckboxAlreadySharedDashboardChangeEventHandler.bind(this)}
                checkboxTraineeToolForUse={this.state.traineeToolForUse}
                checkBoxTraineeToolForUseChange={this.onCheckboxTraineeToolForUseChangeEventHandler.bind(this)}
                checkboxTraineeDataSourceInUse={this.state.traineeDataSourceInUse}
                checkboxTraineeDataSourceInUseChange={this.onCheckboxTraineeDataSourceInUseChangeEventHandler.bind(this)}
                onTraineeIssueDescBlur={this.onTraineeIssueDescriptionBlurHandler.bind(this)}
                traineeIssueDesc={this.state.traineeIssueDescription}
                bookSlotHandler={this.traineeBookSlotHandler.bind(this)}
                sessionTimezone={this.state.selectedTraininigSlot["DoctorTimeZone"]}
            />
            :
            null;

        return (
            <div className={styles.TraineeCalender} >
                {
                    this.state.showSpinner ? showSpinner : trainingData
                }
                {confirmDialog}
                {sessionRegistrationPortal}
            </div>
        );
    }
}
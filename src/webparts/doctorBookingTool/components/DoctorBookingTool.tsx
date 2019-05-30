import * as React from 'react';
import styles from './DoctorBookingTool.module.scss';
import { IDoctorBookingToolProps } from './IDoctorBookingToolProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'DoctorBookingToolWebPartStrings';
import { CommandBarButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import Header from './Header/Header';
import ContractorsNotAllowed from './ContractorsNotAllowed/ContractorsNotAllowed';
import TopicSelection from './TopicSelection/TopicSelection';
import Footer from './Footer/Footer';
import DaysOfWeek from './DaysOfWeek/DaysOfWeek';
import TrainerCalender from './TrainerCalender/TrainerCalender';
import TrainingSelection from './TypeSelectionHolder/TrainingTypeSelection';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import pnp, { Web } from 'sp-pnp-js';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Aux from './HOC/Auxilliary';
import TraineeCalendar from './TraineeCalendar/TraineeCalendar';
import MessageHandler from './MessageHandler/MessageHandler';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IDoctorBookingToolState {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
  trainingType: IDropdownOption;
  trainingTypes: IDropdownOption[];
  showSpinner: boolean;
  showMessageHandler: boolean;
  trainerViewToBeLoaded: boolean;
  messageToBeDisplayed: string;
  messageBarType: MessageBarType;
}

export default class DoctorBookingTool extends React.Component<IDoctorBookingToolProps, IDoctorBookingToolState> {

  private monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  /**
   * Default constructor
   */
  constructor(props: IDoctorBookingToolProps) {
    super(props);
    this.state = {
      firstDayOfWeek: undefined,
      lastDayOfWeek: undefined,
      trainingType: undefined,
      trainingTypes: undefined,
      showSpinner: true,
      trainerViewToBeLoaded: false,
      showMessageHandler: false,
      messageToBeDisplayed: '',
      messageBarType: 0
    };
  }

  public async componentDidMount() {
    this.getCurrentWeekData();
    await this.checkIfUserIsPartOfDoctorGroup();
    await this.getTrainingType();
    this.setState({
      showSpinner: false
    });

  }


  protected getTrainingType = async () => {
    let web = new Web(this.props.siteURL);
    let trainingListGUID: string = this.props.trainingSession;

    let trainingTypes: IDropdownOption[] = [];

    if (web && trainingListGUID) {
      const data = await web.lists.getById(trainingListGUID).items.select("Id", "Title").usingCaching({
        expiration: pnp.util.dateAdd(new Date, "minute", 60),
        key: trainingListGUID,
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
            trainingTypes.push({
              key: element["Id"],
              text: element["Title"]
            });
          });
        }
        else {
          let errorMessage: string;
          let tempMessageBarType: any;

          switch (data.status) {
            case 400:
              errorMessage = `${strings.Error400} Error At: GettingTrainingType`;
              tempMessageBarType = MessageBarType.error;
              break;

            case 401:
              errorMessage = `${strings.Error401} Error At: GettingTrainingType`;
              tempMessageBarType = MessageBarType.error;
              break;

            default:
              errorMessage = data.message;
              tempMessageBarType = MessageBarType.error;
              break;
          }

          this.setState({
            messageToBeDisplayed: errorMessage,
            showMessageHandler: true,
            messageBarType: tempMessageBarType
          });

        }
      }

      this.setState({
        trainingTypes: trainingTypes
      });
    }
  }


  /**
   * Default Current Week Date Builder
   */
  protected getCurrentWeekData = (): void => {
    let currDate: Date = new Date();
    let firstDate = currDate.getDate() - currDate.getDay() + 1;
    let lastDate = firstDate + 4;

    var firstday = new Date(currDate.setDate(firstDate));
    var lastday = new Date(currDate.setDate(lastDate));

    this.setState({
      firstDayOfWeek: firstday,
      lastDayOfWeek: lastday
    });
  }

  /**
   * Next Week Button Click Handler
   */
  protected getNextWeekClickHandler = (): void => {
    const tempStartDate: Date = this.state.firstDayOfWeek;
    const tempLastDate: Date = this.state.lastDayOfWeek;

    let nextWeekFirstDate = tempStartDate.getDate() + 7;
    let nextWeekLastDate = tempLastDate.getDate() + 7;

    var firstday = new Date(tempStartDate.setDate(nextWeekFirstDate));
    var lastday = new Date(tempLastDate.setDate(nextWeekLastDate));

    this.setState({
      firstDayOfWeek: firstday,
      lastDayOfWeek: lastday
    });
  }

  /**
  * Previous Week Button Click Handler
  */
  protected getPreviousWeekClickHandler = (): void => {
    const tempStartDate: Date = this.state.firstDayOfWeek;
    const tempLastDate: Date = this.state.lastDayOfWeek;

    let nextWeekFirstDate = tempStartDate.getDate() - 7;
    let nextWeekLastDate = tempLastDate.getDate() - 7;

    var firstday = new Date(tempStartDate.setDate(nextWeekFirstDate));
    var lastday = new Date(tempLastDate.setDate(nextWeekLastDate));

    this.setState({
      firstDayOfWeek: firstday,
      lastDayOfWeek: lastday
    });
  }

  /**
   * Check User Group to load the required view
   * If User is present in the group then the user is a Doctor so load TrainerCalender
   * else load TraineeCalendar
   */
  protected checkIfUserIsPartOfDoctorGroup = async () => {

    const groupName: string = this.props.userGroup && this.props.userGroup.length > 0 ? this.props.userGroup[0].fullName : null;
    if (!groupName) {
      return;
    }

    const loggedInUserID = await pnp.sp.web.ensureUser(`i:0#.f|membership|${this.props.loggedInUserEmail}`)
      .then(el => el);

    const checkUserInGroup = await pnp.sp.web.siteGroups.getByName(groupName).users.filter(`Id eq ${loggedInUserID.data.Id}`).get().then(el => el);

    if (checkUserInGroup && checkUserInGroup.length > 0) {
      this.setState({
        trainerViewToBeLoaded: true
      });
    }
  }

  /**
   * Method which handles change in Training Option Selection
   */
  protected getTopicSelectionDropDownChangeHandler = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => {
    let selectedKey = item.key;
    let temptrainingTypes: IDropdownOption[] = [...this.state.trainingTypes];

    let conditionCheck = temptrainingTypes.filter(el => el.key === selectedKey);

    if (conditionCheck && conditionCheck.length > 0) {
      this.setState({
        trainingType: conditionCheck[0]
      });
    }
  }

  protected messageBarDismissHandler = (): void => {
    this.setState({
      messageToBeDisplayed: '',
      showMessageHandler: false,
      messageBarType: MessageBarType.info
    });
  }

  public render(): React.ReactElement<IDoctorBookingToolProps> {

    let trainingModuleRendering: JSX.Element;

    if (this.props.isTrainingEnabledForContractors) {
      trainingModuleRendering = this.state.trainingType ?
        this.state.trainerViewToBeLoaded ?
          <TrainerCalender
            daysOfWeek={this.daysArray}
            months={this.monthArray}
            trainingType={this.state.trainingType}
            startDate={this.state.firstDayOfWeek}
            endDate={this.state.lastDayOfWeek}
            siteURL={this.props.siteURL}
            trainingSlotsListGUID={this.props.trainingSlots}
            loggedInUser={this.props.loggedInUserName}
            doctorsAppointments={this.props.doctorsAppointments}
            timeZoneListGUID={this.props.timeZone}
          />
          :
          <TraineeCalendar
            daysOfWeek={this.daysArray}
            months={this.monthArray}
            trainingType={this.state.trainingType}
            startDate={this.state.firstDayOfWeek}
            endDate={this.state.lastDayOfWeek}
            siteURL={this.props.siteURL}
            trainingSlotsListGUID={this.props.trainingSlots}
            loggedInUser={this.props.loggedInUserName}
            doctorsAppointments={this.props.doctorsAppointments}
            loggedInUserEmail={this.props.loggedInUserEmail}
          />
        :
        <TrainingSelection />;
    }
    else {
      if (!this.state.trainerViewToBeLoaded) {
        if (this.props.loggedInUserName.toLowerCase().indexOf("(Contractor)".toLowerCase()) >= 0) {
          trainingModuleRendering = <ContractorsNotAllowed />;
        }
        else {
          trainingModuleRendering = this.state.trainingType ?
            <TraineeCalendar
              daysOfWeek={this.daysArray}
              months={this.monthArray}
              trainingType={this.state.trainingType}
              startDate={this.state.firstDayOfWeek}
              endDate={this.state.lastDayOfWeek}
              siteURL={this.props.siteURL}
              trainingSlotsListGUID={this.props.trainingSlots}
              loggedInUser={this.props.loggedInUserName}
              doctorsAppointments={this.props.doctorsAppointments}
              loggedInUserEmail={this.props.loggedInUserEmail}
            />
            :
            <TrainingSelection />;
        }
      }
      else {
        trainingModuleRendering = this.state.trainingType ?
          <TrainerCalender
            daysOfWeek={this.daysArray}
            months={this.monthArray}
            trainingType={this.state.trainingType}
            startDate={this.state.firstDayOfWeek}
            endDate={this.state.lastDayOfWeek}
            siteURL={this.props.siteURL}
            trainingSlotsListGUID={this.props.trainingSlots}
            loggedInUser={this.props.loggedInUserName}
            doctorsAppointments={this.props.doctorsAppointments}
            timeZoneListGUID={this.props.timeZone}
          />
          :
          <TrainingSelection />;
      }
    }



    let currentWeekStringValue: string;

    if (this.state.firstDayOfWeek && this.state.lastDayOfWeek) {
      const tempStartDate: Date = this.state.firstDayOfWeek;
      const tempLastDate: Date = this.state.lastDayOfWeek;

      if (tempStartDate.getMonth() === tempLastDate.getMonth()) {
        currentWeekStringValue =
          `${this.monthArray[tempStartDate.getMonth()]} ${tempStartDate.getDate()} - ${tempLastDate.getDate()}, ${tempStartDate.getFullYear()}`;
      }

      if (tempStartDate.getMonth() !== tempLastDate.getMonth()) {

        if (tempStartDate.getFullYear() === tempLastDate.getFullYear()) {
          //Jan 28 - Feb 2, 2019
          currentWeekStringValue =
            `${this.monthArray[tempStartDate.getMonth()]} ${tempStartDate.getDate()} - ${this.monthArray[tempLastDate.getMonth()]} ${tempLastDate.getDate()}, ${tempStartDate.getFullYear()}`;
        }
        else {
          // Dec 28, 2019 - Jan 1, 2020
          currentWeekStringValue =
            `${this.monthArray[tempStartDate.getMonth()]} ${tempStartDate.getDate()}, ${tempStartDate.getFullYear()} - ${this.monthArray[tempLastDate.getMonth()]} ${tempLastDate.getDate()}, ${tempLastDate.getFullYear()}`;
        }

      }

    }
    else {
      currentWeekStringValue = "";
    }

    const showSpinner: JSX.Element = this.state.showSpinner ? <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}><Spinner size={SpinnerSize.large} label="Please wait while finish loading..." style={{ margin: "auto" }} /></div> :
      <Aux className={styles.doctorsAppointment}>
        <Header />
        <TopicSelection
          onDropDownChange={this.getTopicSelectionDropDownChangeHandler.bind(this)}
          topicLabel={this.state.trainerViewToBeLoaded ? strings.TopicSelectionHeaderTrainer : strings.TopicSelectionHeaderTrainee}
          labelSelection={this.state.trainerViewToBeLoaded ? strings.TopicSelectionLabelTrainer : strings.TopicSelectionLabelTrainee}
          topicDropDownOptions={this.state.trainingTypes && this.state.trainingTypes.length > 0 ? this.state.trainingTypes : []}
        />
        <DaysOfWeek
          currentWeek={currentWeekStringValue}
          nextButtonClick={this.getNextWeekClickHandler.bind(this)}
          previousButtonClick={this.getPreviousWeekClickHandler.bind(this)}
        />
        {trainingModuleRendering}
        <Footer />
      </Aux>
      ;

    const messageHandler: JSX.Element = this.state.showMessageHandler ?
      <MessageHandler
        message={this.state.messageToBeDisplayed}
        messageBarType={this.state.messageBarType}
        messageBarDismiss={this.messageBarDismissHandler.bind(this)}
      /> : null;

    return (
      <div style={{ width: "100%", height: "100vh", position: 'relative' }}>
        {messageHandler}
        {showSpinner}
      </div>
    );
  }
}

import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

export interface IDoctorBookingToolProps {
  siteURL: string;
  trainingSession: string;
  trainingSlots: string;
  doctorsAppointments: string;
  loggedInUserName: string;
  loggedInUserEmail: string;
  timeZone: string;
  userGroup: IPropertyFieldGroupOrPerson[];
  isTrainingEnabledForContractors : boolean;
}

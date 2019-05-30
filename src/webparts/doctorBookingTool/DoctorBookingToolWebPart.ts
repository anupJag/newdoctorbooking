import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import 'core-js/es6/number';
import 'core-js/es6/array';
import { PropertyFieldPeoplePicker, PrincipalType, IPropertyFieldGroupOrPerson } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import * as strings from 'DoctorBookingToolWebPartStrings';
import DoctorBookingTool from './components/DoctorBookingTool';
import { IDoctorBookingToolProps } from './components/IDoctorBookingToolProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import pnp from "sp-pnp-js";

export interface IDoctorBookingToolWebPartProps {
  trainingSession: string;
  trainingSlots: string;
  doctorsAppointments: string;
  timeZone: string;
  group: IPropertyFieldGroupOrPerson[];
  contractorEnabled: boolean;
}

export default class DoctorBookingToolWebPart extends BaseClientSideWebPart<IDoctorBookingToolWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {

      pnp.setup({
        spfxContext: this.context
      });

    });
  }

  public render(): void {
    
    if(this.properties.contractorEnabled === null){
      this.properties.contractorEnabled = true;
    }

    const element: React.ReactElement<IDoctorBookingToolProps> = React.createElement(
      DoctorBookingTool,
      {
        siteURL: this.context.pageContext.web.absoluteUrl,
        trainingSession: this.properties.trainingSession,
        trainingSlots: this.properties.trainingSlots,
        doctorsAppointments: this.properties.doctorsAppointments,
        loggedInUserName: this.context.pageContext.user.displayName,
        loggedInUserEmail: this.context.pageContext.user.email,
        userGroup: this.properties.group,
        timeZone: this.properties.timeZone,
        isTrainingEnabledForContractors: this.properties.contractorEnabled
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Webpart configuration pane'
          },
          groups: [
            {
              groupName: '',
              groupFields: [
                PropertyFieldListPicker('trainingSession', {
                  label: 'Select list to populate Training Type',
                  selectedList: this.properties.trainingSession,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'trainingSession',
                  baseTemplate: 100
                }),
                PropertyFieldListPicker('trainingSlots', {
                  label: 'Select list to populate Training Slots',
                  selectedList: this.properties.trainingSlots,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'trainingSlots',
                  baseTemplate: 100
                }),
                PropertyFieldListPicker('doctorsAppointments', {
                  label: 'Select list to populate Store Data',
                  selectedList: this.properties.doctorsAppointments,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'doctorsAppointments',
                  baseTemplate: 100
                }),
                PropertyFieldListPicker('timeZone', {
                  label: 'Select list to populate Timezone Data',
                  selectedList: this.properties.timeZone,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'timeZone',
                  baseTemplate: 100
                }),
                PropertyFieldPeoplePicker('group', {
                  label: "Select Doctor's Group",
                  initialData: this.properties.group,
                  allowDuplicate: false,
                  principalType: [PrincipalType.SharePoint],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'groupFieldID',
                  multiSelect: false
                }),
                PropertyPaneToggle('contractorEnabled', {
                  label: "Can Contractors avail Training?",
                  checked: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

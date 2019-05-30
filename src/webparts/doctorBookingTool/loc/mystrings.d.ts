declare interface IDoctorBookingToolWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  TopicSelectionHeaderTrainer : string;
  TopicSelectionHeaderTrainee : string;

  TopicSelectionLabelTrainer : string;
  TopicSelectionLabelTrainee : string;

  Error400: string;
  Error401: string;
}

declare module 'DoctorBookingToolWebPartStrings' {
  const strings: IDoctorBookingToolWebPartStrings;
  export = strings;
}

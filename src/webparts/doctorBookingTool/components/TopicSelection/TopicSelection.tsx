import * as React from 'react';
import Topic from './Topic/Topic';
import TopicLabel from './TopicSelectionLabel/TopicSelectionLabel';
import styles from './TopicSelection.module.scss';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface ITopicSelectionProps {
    onDropDownChange: (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => void;
    topicLabel: string;
    labelSelection: string;
    topicDropDownOptions: IDropdownOption[];
}

const topicSelection = (props: ITopicSelectionProps) => {
    return (
        <div className={styles.Topic}>
            <Topic
                topicLabel={props.topicLabel}
                onDropDownChange={props.onDropDownChange.bind(this)}
                topicDropDownOptions={props.topicDropDownOptions}
            />
            <TopicLabel
                labelSelection={props.labelSelection}
            />
        </div>
    );
};

export default topicSelection;



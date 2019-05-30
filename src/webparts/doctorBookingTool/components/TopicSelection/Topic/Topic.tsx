import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import styles from './Topic.module.scss';

export interface ITopicProps {
    onDropDownChange: (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) => void;
    topicLabel: string;
    topicDropDownOptions : IDropdownOption[];
}

const topic = (props: ITopicProps) => {

    return (
        <div className={styles.Topic}>
            <div className={styles.TopicContainer}>
                <div className={styles.TopicLabel}>{props.topicLabel}</div>
                <Dropdown
                    options={props.topicDropDownOptions}
                    ariaLabel={"Select training dropdown session"}
                    placeHolder={"Select a training"}
                    className={styles.TopicDropDown}
                    onChange={props.onDropDownChange}
                    
                />
            </div>
        </div>
    );
};


export default topic;

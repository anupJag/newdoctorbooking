import * as React from 'react';
import styles from './TopicSelectionLabel.module.scss';

export interface ITopicSelectionLabel{
    labelSelection : string;
}

const topicSelectionLabel = (props : ITopicSelectionLabel) => {
    return(
        <div className={styles.TopicSelectionLabel}>
            <div className={styles.TopicLabel}>{props.labelSelection}</div>
        </div>
    );
};

export default topicSelectionLabel;
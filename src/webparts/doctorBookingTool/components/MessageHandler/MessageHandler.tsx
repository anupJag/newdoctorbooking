import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';


export interface IMessageHandler {
    message: string;
    messageBarType: MessageBarType;
    messageBarDismiss: () => void;
}

const messageHandler = (props: IMessageHandler) => {
    return (
        <div>
            <MessageBar messageBarType={props.messageBarType} onDismiss={props.messageBarDismiss}>
                {props.message}
            </MessageBar>
        </div>
    );
};

export default messageHandler;

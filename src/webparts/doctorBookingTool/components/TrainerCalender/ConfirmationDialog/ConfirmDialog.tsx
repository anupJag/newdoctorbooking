import * as React from 'react';
import { Dialog, DialogType, DialogFooter, IDialogFooterStyleProps, IDialogFooterProps } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import styles from './ConfirmationDialog.module.scss';

export interface IConfirmDialogProps {
    hideDialog: boolean;
    date: string;
    time: string;
    showSpinner: boolean;
    _yesDialog: () => void;
    _closeDialog: () => void;
}

const confirmDialog = (props: IConfirmDialogProps) => {

    const classToBeAlpplied = props.showSpinner ? `${styles.isFooterClosed}` : `${styles.isFooterVisible}`;

    const hideSpinner: React.CSSProperties = !props.showSpinner ? { display: "none" } : null;

    return (
        <Dialog
            hidden={props.hideDialog}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: 'Cancel Session',
                subText: `Click "Yes" to cancel the session at ${props.date} on ${props.time}. Be sure to inform any trainees registered for this time that the session is cancelled. `,
            }}
            className={styles.ConfirmationDialog}
        >
            <div className={styles.ShowSpinner} style={hideSpinner}>
                <Spinner label={"De-registering your request"} size={SpinnerSize.medium} />
            </div>
            <DialogFooter className={classToBeAlpplied}>
                <PrimaryButton onClick={props._yesDialog} text="Yes" />
                <DefaultButton onClick={props._closeDialog} text="Cancel" />
            </DialogFooter>
        </Dialog>
    );
};

export default confirmDialog;
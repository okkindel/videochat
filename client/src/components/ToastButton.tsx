import * as React from 'react';

export const ButtonWithToast = ({ notificationSystem, children }) => {
    const createToast = () => {
        const opts = {
            type: 'toast',
            autoHideDelayTime: 3000,
            payload: {
                variant: 'notification',
                content: 'Link copied to clipboard!',
                horizontalPosition: 'center',
                verticalPosition: 'top',
                removable: true
            }
        };
        return notificationSystem.add(opts);
    };
    return <div onClick={createToast}>{children}</div>;
};

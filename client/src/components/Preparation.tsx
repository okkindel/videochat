import { Button, Loader, notificationConnect } from '@livechat/design-system';
import { ButtonWithToast } from './ToastButton';
import { Content, Invitation } from '../styles';
import { BsClipboard } from 'react-icons/bs';
import copy from 'copy-to-clipboard';
import * as React from 'react';

function CreateInvitationLink(props): JSX.Element {
    const ToastedButton = notificationConnect(ButtonWithToast);
    const url = `https://textless.ml/?myID=&targetID=${props.id}`;
    if (props.id) {
        return (
            <Invitation onClick={() => copy(url)}>
                <ToastedButton>
                    <BsClipboard /> Copy Invitation Link
                </ToastedButton>
            </Invitation>
        );
    }
}

export function Preparation(props): JSX.Element {
    return (
        <Content>
            {props.targetID ? (
                <Button kind='primary' onClick={props.connect}>
                    Call now to your partner
                </Button>
            ) : (
                <Loader size='large' label='Waiting for an incoming call...' />
            )}
            <CreateInvitationLink id={props.myID} />
        </Content>
    );
}

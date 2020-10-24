import { Button, Loader, notificationConnect } from '@livechat/design-system';
import { Content, Header, SpacerContainer, Tank } from '../styles';
import { ButtonWithToast } from './ToastButton';
import { BsClipboard } from 'react-icons/bs';
import copy from 'copy-to-clipboard';
import * as React from 'react';

function CreateInvitationLink(props): JSX.Element {
    const ToastedButton = notificationConnect(ButtonWithToast);
    const url = `https://textless.ml/?myID=&targetID=${props.id}`;
    // const url = `localhost:3000/?myID=&targetID=${props.id}`;
    if (props.id) {
        return (
            <ToastedButton>
                <Button
                    kind={props.hasTarget ? 'text' : undefined}
                    onClick={() => copy(url)}
                >
                    <BsClipboard /> Copy Invitation Link
                </Button>
            </ToastedButton>
        );
    }
}

export function Preparation(props): JSX.Element {
    return (
        <Tank>
            <Content>
                {props.targetID ? (
                    <SpacerContainer>
                        <Header>Your conversation is ready.</Header>
                        <Button kind='primary' onClick={props.connect}>
                            Call now to your partner
                        </Button>
                    </SpacerContainer>
                ) : (
                    <SpacerContainer>
                        <Loader
                            size='large'
                            label='Waiting for an incoming call...'
                        />
                    </SpacerContainer>
                )}
                <SpacerContainer>
                    <CreateInvitationLink
                        id={props.myID}
                        hasTarget={props.targetID}
                    />
                </SpacerContainer>
            </Content>
        </Tank>
    );
}

import { SpacerContainer, Content, Header, Tank } from '../styles';
import { Button } from '@livechat/design-system';
import * as React from 'react';

export function Closing() {
    function closeWindow(): void {
        open(location as any, '_self').close();
    }

    return (
        <Tank>
            <Content>
                <Header>
                    Thank you for participating in the conversation.
                </Header>
                <SpacerContainer onClick={closeWindow}>
                    <Button kind='text'>Join a new call</Button>
                </SpacerContainer>
            </Content>
        </Tank>
    );
}

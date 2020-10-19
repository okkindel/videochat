import { useCallback, useState } from 'react';
import { BsClipboard } from 'react-icons/bs';
import useWebRTC from './hooks/useWebRTC';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import { render } from 'react-dom';
import * as React from 'react';
import {
    NotificationProvider,
    notificationConnect,
    ToastConsumer,
    Button,
    Loader
} from '@livechat/design-system';

const ButtonWithToast = ({ notificationSystem, children }) => {
    const createToast = () => {
        const opts = {
            type: 'toast',
            autoHideDelayTime: 3000,
            payload: {
                variant: 'success',
                content: 'Link copied to clipboard!',
                horizontalPosition: 'center',
                verticalPosition: 'top',
                removable: true
            }
        };
        return notificationSystem.add(opts);
    };
    return <Button onClick={createToast}>{children}</Button>;
};

function Loading() {
    return (
        <Container>
            <Tank>
                <Content>
                    <Loader size='large' />
                </Content>
            </Tank>
        </Container>
    );
}

function Error({ error }: { error: string }) {
    return <pre>Error: {error.toString()}</pre>;
}

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

function getURLParams(): [string, string] {
    const url = new URL(window.location.href);
    const myID = url.searchParams.get('myID');
    const targetID = url.searchParams.get('targetID');
    console.log('myID', myID, 'targetID', targetID);
    return [myID, targetID];
}

function App() {
    const [myID, targetID] = getURLParams();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const showMyCamera = useCallback(() => {
        setIsVisible(true);
        const video = document.getElementById('receiver') as HTMLVideoElement;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            console.log(video, 'ustawiam stram');
            video.srcObject = stream;
        });
    }, [setIsVisible]);
    const { id, loading, error, connectTo } = useWebRTC(myID, showMyCamera);

    if (loading) {
        return <Loading />;
    }

    function connect() {
        connectTo(targetID).then(showMyCamera).catch(alert);
    }

    return (
        <Container>
            <NotificationProvider>
                <ToastConsumer
                    horizontalPosition='center'
                    verticalPosition='top'
                    fixed
                />

                <Tank>
                    {targetID ? (
                        <Content>
                            <Button kind='primary' onClick={connect}>
                                Call to your partner
                            </Button>
                        </Content>
                    ) : (
                        <Content>
                            <Loader
                                size='large'
                                label='Waiting for an incoming call...'
                            />
                            <CreateInvitationLink id={id} />
                        </Content>
                    )}

                    <CallerVideo
                        isVisible={isVisible}
                        autoPlay
                        id='caller'
                    ></CallerVideo>
                    <ReceiverVideo
                        isVisible={isVisible}
                        autoPlay
                        id='receiver'
                    ></ReceiverVideo>
                </Tank>
            </NotificationProvider>
            {error && <Error error={error} />}
        </Container>
    );
}

const Container = styled.div`
    background-image: linear-gradient(62deg, #fbab7e 0%, #f7ce68 100%);
    background-color: #fbab7e;
    position: relative;
    height: 100vh;
`;

const Tank = styled.div`
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border: 3px solid #333333;
    position: relative;
    padding: 2rem;
    height: 80vh;
    width: 80vw;
    left: 50%;
    top 50%;

    &::before {
      transform: translate3d(-50%, -50%, 0) scale(1.015) rotate(0.5deg);
      border-radius: 1% 1% 2% 4% / 2% 6% 5% 4%;
      border: 2px solid #353535;
      position: absolute;
      display: block;
      height: 100%;
      width: 100%;
      content: '';
      left: 50%;
      top: 50%;
  }
`;

const Content = styled.div`
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
    position: absolute;
    display: flex;
    left: 50%;
    flex: 1;
    top 50%;
`;

const ReceiverVideo = styled.video<{ isVisible: boolean }>`
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    position: absolute;
    height: 250px;
    width: 250px;
    right: 16px;
    bottom: 6px;
    z-index: 5;
`;

const CallerVideo = styled.video<{ isVisible: boolean }>`
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    transform: translate(-50%, -50%);
    position: absolute;
    height: 100vh;
    width: 100vw;
    z-index: 3;
    left: 50%;
    top 50%;
`;

const Invitation = styled.div`
    margin-top: 2rem;
`;

render(<App />, document.getElementById('root'));

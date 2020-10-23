import { NotificationProvider, ToastConsumer } from '@livechat/design-system';
import { Loading, Preparation, Video, Error } from './components';
import { useCallback, useState } from 'react';
import useWebRTC from './hooks/useWebRTC';
import { Container } from './styles';
import { render } from 'react-dom';
import * as React from 'react';
import Peer from 'peerjs';

function getURLParams(): [string, string] {
    const url = new URL(window.location.href);
    const myID = url.searchParams.get('myID');
    const targetID = url.searchParams.get('targetID');
    return [myID, targetID];
}

function App() {
    const [userId, targetID] = getURLParams();
    const [isCallActive, setIsCallActive] = useState<boolean>(false);

    const createLocalStream = useCallback(() => {
        setIsCallActive(true);
        const video = document.getElementById('receiver') as HTMLVideoElement;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
        });
    }, [setIsCallActive]);

    function hangUpConnection(): void {
        peer.destroy();
        setIsCallActive(false);
    }

    const { id, loading, error, peer, connectTo } = useWebRTC(
        userId,
        createLocalStream,
        hangUpConnection
    );

    if (loading) {
        return <Loading />;
    }

    function connect() {
        connectTo(targetID).then(createLocalStream).catch(alert);
    }

    return (
        <Container>
            <NotificationProvider>
                <ToastConsumer
                    horizontalPosition='center'
                    verticalPosition='top'
                    fixed
                />
                {isCallActive ? (
                    <Video hangUp={hangUpConnection} />
                ) : (
                    <Preparation
                        myID={id}
                        targetID={targetID}
                        connect={connect}
                    />
                )}
            </NotificationProvider>
            <Error error={error} />
        </Container>
    );
}

render(<App />, document.getElementById('root'));

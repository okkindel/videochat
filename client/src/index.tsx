import { NotificationProvider, ToastConsumer } from '@livechat/design-system';
import { Loading, Preparation, Video, Error, Closing } from './components';
import { useCallback, useState } from 'react';
import useWebRTC from './hooks/useWebRTC';
import { Container } from './styles';
import { render } from 'react-dom';
import * as React from 'react';

enum AppState {
    READY,
    ACTIVE,
    GONE
}

function getURLParams(): [string, string] {
    const url = new URL(window.location.href);
    const myID = url.searchParams.get('myID');
    const targetID = url.searchParams.get('targetID');
    return [myID, targetID];
}

function App() {
    const [userId, targetID] = getURLParams();
    const [appState, setAppState] = useState<AppState>(AppState.READY);

    const createLocalStream = useCallback(() => {
        setAppState(AppState.ACTIVE);
        const video = document.getElementById('receiver') as HTMLVideoElement;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            video.srcObject = stream;
        });
    }, [setAppState]);

    function hangUpConnection(): void {
        peer.destroy();
        setAppState(AppState.GONE);
    }

    function isAppState(state: AppState): boolean {
        return appState === state;
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
                {isAppState(AppState.READY) ? (
                    <Preparation
                        myID={id}
                        targetID={targetID}
                        connect={connect}
                    />
                ) : isAppState(AppState.ACTIVE) ? (
                    <Video hangUp={hangUpConnection} />
                ) : (
                    <Closing />
                )}
            </NotificationProvider>
            <Error error={error} />
        </Container>
    );
}

render(<App />, document.getElementById('root'));

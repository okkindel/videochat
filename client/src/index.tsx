import { NotificationProvider, ToastConsumer } from '@livechat/design-system';
import { Loading, Preparation, Video, Error } from './components';
import { useCallback, useState } from 'react';
import useWebRTC from './hooks/useWebRTC';
import { Container } from './styles';
import { render } from 'react-dom';
import * as React from 'react';

function getURLParams(): [string, string] {
    const url = new URL(window.location.href);
    const myID = url.searchParams.get('myID');
    const targetID = url.searchParams.get('targetID');
    return [myID, targetID];
}

function App() {
    const [myID, targetID] = getURLParams();
    const [isCallActive, setIsCallActive] = useState<boolean>(false);

    const showMyCamera = useCallback(() => {
        setIsCallActive(true);
        const video = document.getElementById('receiver') as HTMLVideoElement;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            console.log(video, 'ustawiam stram');
            video.srcObject = stream;
        });
    }, [setIsCallActive]);

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
                {isCallActive ? (
                    <Video />
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

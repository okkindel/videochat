import { NotificationProvider, ToastConsumer } from '@livechat/design-system';
import { ReceiverVideo, CallerVideo, Container, Tank } from './styles';
import { Loading, Preparation } from './components';
import { useCallback, useState } from 'react';
import useWebRTC from './hooks/useWebRTC';
import { render } from 'react-dom';
import * as React from 'react';

function Error({ error }: { error: string }) {
    return <pre>Error: {error.toString()}</pre>;
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
    const [isCallActive, setIsVisible] = useState<boolean>(false);
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
                    {!isCallActive && (
                        <Preparation
                            myID={id}
                            targetID={targetID}
                            connect={connect}
                        />
                    )}
                    <CallerVideo
                        isVisible={isCallActive}
                        autoPlay
                        id='caller'
                    ></CallerVideo>
                    <ReceiverVideo
                        isVisible={isCallActive}
                        autoPlay
                        id='receiver'
                    ></ReceiverVideo>
                </Tank>
            </NotificationProvider>
            {error && <Error error={error} />}
        </Container>
    );
}

render(<App />, document.getElementById('root'));

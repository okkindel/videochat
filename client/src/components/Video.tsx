import { AiOutlineFullscreen } from 'react-icons/ai';
import { VscMute, VscUnmute } from 'react-icons/vsc';
import { useState } from 'react';
import * as React from 'react';
import {
    VideoTagContainer,
    ReceiverVideo,
    CallerVideo,
    VideoIcons,
    VideoIcon,
    Tank
} from '../styles';

export function Video(): JSX.Element {
    const [isMuted, setIsMuted] = useState<boolean>(false);

    function setFullscreen(): void {
        const videoElement = document.getElementById(
            'caller'
        ) as HTMLVideoElement;
        videoElement.requestFullscreen();
    }

    function muteVideo(): void {
        const videoElement = document.getElementById(
            'caller'
        ) as HTMLVideoElement;
        setIsMuted(!isMuted);
        videoElement.muted = isMuted;
    }

    return (
        <Tank>
            <VideoTagContainer>
                <CallerVideo autoPlay id='caller'></CallerVideo>
                <ReceiverVideo autoPlay id='receiver'></ReceiverVideo>
                <VideoIcons>
                    <VideoIcon>
                        {isMuted ? (
                            <VscUnmute onClick={muteVideo} />
                        ) : (
                            <VscMute onClick={muteVideo} />
                        )}
                    </VideoIcon>
                    <VideoIcon>
                        <AiOutlineFullscreen onClick={setFullscreen} />
                    </VideoIcon>
                </VideoIcons>
            </VideoTagContainer>
        </Tank>
    );
}

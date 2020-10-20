import styled from 'styled-components';

export const CallerVideo = styled.video`
    transform: translate(-50%, -50%);
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 3;
    left: 50%;
    top 50%;
`;

export const ReceiverVideo = styled.video`
    position: absolute;
    height: 250px;
    width: 250px;
    z-index: 5;
    left: 2rem;
    top: 0;
`;

export const VideoTagContainer = styled.div`
    transform: translate(-50%, -50%);
    position: relative;
    background: black;
    height: 70vh;
    width: 70vw;
    left: 50%;
    top 50%;
`;

export const VideoIcons = styled.div`
    position: absolute;
    font-size: 1.5rem;
    display: flex;
    height: 2rem;
    color: white;
    z-index: 10;
    bottom: 0;
    right: 0;
`;

export const VideoIcon = styled.div`
    margin: 0 0.35rem;
    color: white;
    &:hover {
        opacity: 50%;
    }
`;

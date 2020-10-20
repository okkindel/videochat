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
    right: 2%;
    top: 1%;
`;

export const VideoTagContainer = styled.div`
    position: relative;
    background: black;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    left: 0;
    top 0;
`;

export const VideoIcons = styled.div`
    background: linear-gradient(transparent, black);
    align-items: center;
    position: absolute;
    display: block;
    height: 4rem;
    z-index: 10;
    width 100%;
    bottom: 0;
    right: 0;
`;

export const VideoIcon = styled.div`
    margin: 0 0.5rem;
    margin-top: 0.3rem;
    font-size: 3rem;
    float: right;
    color: white;
    &:hover {
        opacity: 50%;
    }
`;

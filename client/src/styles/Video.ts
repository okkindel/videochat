import styled from 'styled-components';

export const CallerVideo = styled.video`
    transform: translate(-50%, -50%);
    position: relative;
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
    justify-content: center;
    position: absolute;
    color: transparent;
    background: none;
    transition: 0.3s;
    display: flex;
    height: 4rem;
    z-index: 10;
    width 100%;
    bottom 0;

    &:hover {
        background: white;
        color: #5f6368;
        display: flex;
    }
`;

export const VideoIcon = styled.div`
    transform: translate(0.2rem,0.55rem);
    margin: 0 2rem;
    margin-top: 0.7rem;
    font-size: 1.7rem;
    
    &:hover {
        opacity: 50%;
    }
`;

export const MainIcon = styled.div`
    transform: translate(0.2rem, 0.55rem);
    font-size: 1.7rem;
    margin: 0 0.5rem;
    &:hover {
        opacity: 50%;
    }
`;

export const MainIconContainer = styled.div`
    box-shadow: 0 0 7px #999;
    margin-left: 0.2rem;
    border-radius: 50%;
    margin-top: 0.5rem;
    background: white;
    color: #c5221f;
    height: 3rem;
    width: 3rem;
`;

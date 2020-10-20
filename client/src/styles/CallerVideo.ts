import styled from "styled-components";

export const CallerVideo = styled.video<{ isVisible: boolean }>`
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    transform: translate(-50%, -50%);
    position: absolute;
    height: 100vh;
    width: 100vw;
    z-index: 3;
    left: 50%;
    top 50%;
`;

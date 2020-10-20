import styled from "styled-components";

export const ReceiverVideo = styled.video<{ isVisible: boolean }>`
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
    position: absolute;
    height: 250px;
    width: 250px;
    right: 16px;
    bottom: 6px;
    z-index: 5;
`;

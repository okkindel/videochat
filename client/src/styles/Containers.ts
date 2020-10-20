import styled from 'styled-components';

export const Container = styled.div`
    background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
    background-color: #fbab7e;
    position: relative;
    height: 100vh;
`;

export const Content = styled.div`
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
    position: absolute;
    display: flex;
    left: 50%;
    flex: 1;
    top 50%;
`;

export const Tank = styled.div`
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    box-shadow:
    0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
    position: relative;
    padding: 2rem;
    height: 50vh;
    width: 50vw;
    left: 50%;
    top 50%;
`;

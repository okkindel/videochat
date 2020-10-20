import styled from 'styled-components';

export const Container = styled.div`
    background-image: linear-gradient(62deg, #fbab7e 0%, #f7ce68 100%);
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
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border: 3px solid #333333;
    position: relative;
    padding: 2rem;
    height: 80vh;
    width: 80vw;
    left: 50%;
    top 50%;

    &::before {
      transform: translate3d(-50%, -50%, 0) scale(1.015) rotate(0.5deg);
      border-radius: 1% 1% 2% 4% / 2% 6% 5% 4%;
      border: 2px solid #353535;
      position: absolute;
      display: block;
      height: 100%;
      width: 100%;
      content: '';
      left: 50%;
      top: 50%;
  }
`;

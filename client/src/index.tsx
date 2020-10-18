import React, { useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import useWebRTC from "./hooks/useWebRTC";

function Loading() {
  return <h1>Loading...</h1>;
}

function Error({ error }: { error: string }) {
  return <pre>Error: {error.toString()}</pre>;
}

function getURLParams() {
  const url = new URL(window.location.href);
  const myID = url.searchParams.get("myID");
  const targetID = url.searchParams.get("targetID");
  console.log(!targetID, 'target')
  return [myID, targetID];
}

function App() {
  const [myID, targetID] = getURLParams();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { id, loading, error, connectTo } = useWebRTC(myID);

  if (loading) {
    return <Loading />;
  }

  function connect() {
    setIsVisible(true);
    const video = document.getElementById('yours') as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
      console.log(video, 'ustawiam stram')
      video.srcObject = stream;
    });
    connectTo(targetID).catch(alert);
  }

  return (
    <Container>
      <h1>Your peerId: {id}</h1>
      {targetID ? (
        <button onClick={connect}>
          Call {targetID}
        </button>
      ) : (
        <h2>Waiting for connection...</h2>
        )}
        
      <Video isVisible={isVisible} autoPlay id='yours'></Video>
      {error && <Error error={error} />}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin: 32px;
`;

const Video = styled.video<{isVisible: boolean}>`
  display: ${props => props.isVisible ? 'block' : 'none'};
  position: absolute;
  height: 250px;
  width: 250px;
  right: 16px;
  bottom: 6px;
  z-index: 2;
`;

render(<App />, document.getElementById("root"));

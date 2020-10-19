import useWebRTC from "./hooks/useWebRTC";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { render } from "react-dom";

function Loading() {
  return <h1>Loading...</h1>;
}

function Error({ error }: { error: string }) {
  return <pre>Error: {error.toString()}</pre>;
}

// SAMPLE URL
// http://localhost:3001/?myID=99826463-8e66-4641-ac2e-1f97c3101882&targetID=02eae70c-e581-4d54-b702-0bc98aca3d66

function getURLParams() {
  const url = new URL(window.location.href);
  const myID = url.searchParams.get("myID");
  const targetID = url.searchParams.get("targetID");
  console.log("my", myID, "target", targetID);
  return [myID, targetID];
}

function App() {
  const [myID, targetID] = getURLParams();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const showMyCamera = useCallback(() => {
    setIsVisible(true);
    const video = document.getElementById("yours") as HTMLVideoElement;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      console.log(video, "ustawiam stram");
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
      <h1>Your peerId: {id}</h1>
      {targetID ? (
        <button onClick={connect}>Call {targetID}</button>
      ) : (
        <h2>Waiting for connection...</h2>
      )}

      <Video isVisible={isVisible} autoPlay id="yours"></Video>
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

const Video = styled.video<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  height: 250px;
  width: 250px;
  right: 16px;
  bottom: 6px;
  z-index: 2;
`;

render(<App />, document.getElementById("root"));

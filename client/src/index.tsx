import React, { useState } from "react";
import { render } from "react-dom";
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
  return [myID, targetID];
}

function App() {
  const [myID, targetID] = getURLParams();
  const { id, loading, error, connectTo } = useWebRTC(myID);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1>Your peerId: {id}</h1>
      {targetID ? (
        <button onClick={() => connectTo(targetID).catch(alert)}>
          Call {targetID}
        </button>
      ) : (
        <h2>Waiting for connection...</h2>
      )}
      {error && <Error error={error} />}
    </>
  );
}

render(<App />, document.getElementById("root"));

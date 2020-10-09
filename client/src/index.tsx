import React, { useState } from "react";
import { render } from "react-dom";
import useWebRTC from "./hooks/useWebRTC";

function Loading() {
  return <h1>Loading...</h1>;
}

function Error({ error }: { error: Record<string, unknown> }) {
  return <pre>{JSON.stringify(error, null, 2)}</pre>;
}

function App() {
  const [targetId, setTargetId] = useState("");
  const { id, loading, error, connectTo } = useWebRTC("vid");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      <h1>Your peerId: {id}</h1>
      <input
        type="text"
        onChange={(e) => setTargetId(e.target.value)}
        value={targetId}
      />
      <button
        onClick={() =>
          connectTo(targetId).catch(alert)
        }
      >
        Call {targetId}
      </button>
    </>
  );
}

render(<App />, document.getElementById("root"));

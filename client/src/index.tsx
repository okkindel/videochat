import React from "react";
import { render } from "react-dom";
import useWebRTC from "./hooks/useWebRTC";

function App() {
  const state = useWebRTC();
  return (
    <>
      <h1>Hello Worlddddd</h1>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
}

render(<App />, document.getElementById("root"));
